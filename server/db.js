const mongoose = require('mongoose');

// Get MongoDB URI from environment variables or use a local fallback
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aiesa_google';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Do not exit process in dev/test, but maybe in prod? 
        // For now, just log the error.
        process.exit(1);
    }
};

module.exports = connectDB;
