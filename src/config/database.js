const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bon-rewards');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Please ensure MongoDB is running on your system or update MONGODB_URI in your .env file');
    console.error('For local MongoDB installation, start with: mongod');
    process.exit(1);
  }
};

module.exports = connectDB;