import mongoose from 'mongoose';

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODBURI!, {
      dbName: `${process.env.DB}`,
    });
    console.log('Database connected');
  } catch (error) {
    throw new Error('Database connection failed');
  }
}

export default dbConnect;
