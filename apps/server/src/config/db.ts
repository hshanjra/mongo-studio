import mongoose from "mongoose";
import dotenv from "dotenv";
import { Express } from "express";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mongo-studio";

export const connectDB = async (app: Express) => {
  try {
    await mongoose.connect(MONGODB_URI);

    // Attach mongoose instance to app.locals
    app.locals.mongoose = mongoose;

    console.log("MongoDB connected successfully");
    return mongoose;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
