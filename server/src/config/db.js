const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⏳ Retrying MongoDB connection in 10s (Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas)...');
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
