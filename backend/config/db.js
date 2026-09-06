import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && mongoUri.trim() !== '') {
    try {
      const conn = await mongoose.connect(mongoUri);
      isConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`MongoDB Atlas connection error: ${error.message}`);
      console.log('Falling back to local in-memory persistent database engine for preview...');
      isConnected = false;
      return false;
    }
  } else {
    console.log('No MONGO_URI provided in environment. Initializing local database store...');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => isConnected;
