import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(MONGODB_URI);
  return cached.conn;
}
