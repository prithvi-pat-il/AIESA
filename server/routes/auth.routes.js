const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register (for initial setup or admin use)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, insta_id, post } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'member',
            insta_id,
            post
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Setup Default Admin (Manual Trigger)
router.get('/setup-admin', async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ where: { email: 'admin@aiesa.com' } });
        if (existingAdmin) {
            return res.json({ message: 'Admin user already exists', user: existingAdmin });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = await User.create({
            name: 'Super Admin',
            email: 'admin@aiesa.com',
            password: hashedPassword,
            role: 'admin',
            post: 'President',
            order_index: 0
        });
        res.status(201).json({ message: 'Default admin created successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

        const SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '10h' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                insta_id: user.insta_id,
                post: user.post,
                profile_image: user.profile_image
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
