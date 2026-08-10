const mongoose = require('mongoose');

const mongoOptions = {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 30000,
    tls: true,
    tlsAllowInvalidCertificates: true
};

async function connectDB(retries = 5, delayMs = 3000) {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error('MONGO_URI is not defined in your environment variables.');
    }

    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            await mongoose.connect(uri, mongoOptions);
            console.log('Connected to MongoDB');
            return;
        } catch (error) {
            console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);

            if (attempt === retries) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}

module.exports = connectDB;