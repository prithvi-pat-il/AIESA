const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('./models/User');
const Settings = require('./models/Settings');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        await connectDB();

        // Wait for connection to be ready (connectDB is async but we need to ensure it's done)
        // Actually connectDB above awaits connection.

        console.log('Connected to MongoDB...');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@aiesa.edu' });
        if (adminExists) {
            console.log('Admin user already exists.');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Super Admin',
                email: 'admin@aiesa.edu',
                password: hashedPassword,
                role: 'admin',
                post: 'System Administrator'
            }); // removed order_index, it defaults to 0

            console.log('Admin user created successfully.');
            console.log('Email: admin@aiesa.edu');
            console.log('Password: admin123');
        }

        // Ensure settings exist
        const settings = await Settings.findOne();
        if (!settings) {
            await Settings.create({ main_event_name: 'AIESA Annual Event' });
            console.log('Default settings created.');
        }

        console.log('Seeding complete.');
        process.exit(0);

    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
