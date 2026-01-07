const sequelize = require('./db');
const User = require('./models/User');
const Settings = require('./models/Settings');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        await sequelize.sync();

        // Check if admin exists
        const adminExists = await User.findOne({ where: { email: 'admin@aiesa.edu' } });
        if (adminExists) {
            console.log('Admin user already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Super Admin',
            email: 'admin@aiesa.edu',
            password: hashedPassword,
            role: 'admin',
            post: 'System Administrator'
        });

        console.log('Admin user created successfully.');
        console.log('Email: admin@aiesa.edu');
        console.log('Password: admin123');

        // Ensure settings exist
        const settings = await Settings.findOne();
        if (!settings) {
            await Settings.create({ main_event_name: 'AIESA Annual Event' });
            console.log('Default settings created.');
        }

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();
