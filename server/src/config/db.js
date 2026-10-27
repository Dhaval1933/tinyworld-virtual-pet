const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (retries > 0) {
      console.log(`⏳ Retrying MongoDB connection in ${delay / 1000}s... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error('⚠️ Could not connect to MongoDB after multiple attempts. Please check IP whitelist (0.0.0.0/0).');
    }
  }
};

module.exports = connectDB;
