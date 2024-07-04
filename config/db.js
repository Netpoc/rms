const mongoose = require('mongoose');
// Load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL);
        console.log('Database connected...');
    } catch (err) {
        console.error('Database connection failed!');
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;