const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const bcrypt = require('bcryptjs');

// Reorder Members (Admin Only) - Moved to top to avoid conflicts
router.post('/reorder', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    console.log('Reorder route hit');
    try {
        const { orderedIds } = req.body;
        if (!orderedIds || !Array.isArray(orderedIds)) return res.status(400).json({ message: 'Invalid data' });

        for (let i = 0; i < orderedIds.length; i++) {
            await User.update({ order_index: i }, { where: { id: orderedIds[i] } });
        }
        res.json({ message: 'Order updated' });
    } catch (err) {
        console.error('Reorder error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all members (Public) - Exclude password
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['order_index', 'ASC'], ['id', 'ASC']]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single user (Public? or Protected?)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Member (Admin Only)
router.post('/', authMiddleware, roleMiddleware(['admin']), upload.single('profile_image'), async (req, res) => {
    try {
        const { name, email, password, role, insta_id, post } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let profile_image = null;
        if (req.file) {
            profile_image = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
        }

        const user = await User.create({
            name, email, password: hashedPassword, role, insta_id, post, profile_image
        });
        res.status(201).json({ message: 'Member created', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Member (Admin can update anyone, Member can update self)
router.put('/:id', authMiddleware, upload.single('profile_image'), async (req, res) => {
    try {
        // Check permissions
        const userToUpdateId = parseInt(req.params.id);
        if (req.user.role !== 'admin' && req.user.id !== userToUpdateId) {
            return res.status(403).json({ message: 'Access Forbidden' });
        }

        const user = await User.findByPk(userToUpdateId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, insta_id, post, password } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (insta_id) user.insta_id = insta_id;
        if (post) user.post = post;
        if (req.file) {
            user.profile_image = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
        }

        // Only admin can change role
        if (req.user.role === 'admin' && req.body.role) {
            user.role = req.body.role;
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'User updated', user: { ...user.toJSON(), password: undefined } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Member (Admin Only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
