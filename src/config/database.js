const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bon-rewards';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log database name for verification
    console.log(`Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Please check your MONGODB_URI environment variable in Render dashboard');
      console.error('Make sure MongoDB Atlas is properly configured and accessible');
    } else {
      console.error('Please ensure MongoDB is running on your system or update MONGODB_URI in your .env file');
      console.error('For local MongoDB installation, start with: mongod');
      console.error('For cloud database, use MongoDB Atlas connection string');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;