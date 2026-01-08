const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db'); // Changed import
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        res.status(400).json({ error: err.message, field: err.field });
    } else if (err) {
        res.status(500).json({ error: err.message });
    } else {
        next();
    }
});

const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Start Server and Seed Admin
const startServer = async () => {
    try {
        // We are already connected via connectDB(), but we can wait or just start.
        // connectDB() is async but we didn't await it at top level (common pattern).
        // Better to seed inside here if connection is ready, or use 'open' event.
        // Simple approach:

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            seedDefaultAdmin();
        });

    } catch (error) {
        console.error('Server startup error:', error);
    }
}

const seedDefaultAdmin = async () => {
    try {
        const User = require('./models/User');
        const bcrypt = require('bcryptjs');

        // Mongoose: countDocuments
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Super Admin',
                email: 'admin@aiesa.com',
                password: hashedPassword,
                role: 'admin',
                post: 'President',
                order_index: 0
            });
            console.log('------------------------------------------------');
            console.log('DEFAULT ADMIN CREATED');
            console.log('Email: admin@aiesa.com');
            console.log('Password: admin123');
            console.log('------------------------------------------------');
        }
    } catch (seedErr) {
        console.error('Error seeding default admin:', seedErr);
    }
};

startServer();
