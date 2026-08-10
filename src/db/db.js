const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spotify-clone';

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 30000,
            tls: true,
            tlsAllowInvalidCertificates: true
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        console.error('If you are using Atlas, make sure your current IP is allowed in Network Access.');
        throw error;
    }
}

module.exports = connectDB;