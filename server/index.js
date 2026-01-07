const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Sync Database after start
    sequelize.sync({ alter: true }).then(() => {
        console.log('Database synced successfully');
    }).catch(err => {
        console.error('Database sync error:', err);
    });
});
