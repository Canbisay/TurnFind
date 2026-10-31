import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected");
  });

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000, // do not hang forever if DB is down
  });
  console.log("MongoDB connected");
};