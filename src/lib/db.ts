import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached: { conn: typeof mongoose | null } = (global as any).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  try {
    cached.conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'vendorvault', 
    });
    (global as any).mongoose = cached; 
    console.log('✅ Connected to MongoDB');
    return cached.conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
