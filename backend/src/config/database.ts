import mongoose from "mongoose";

import { env } from "./env";

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(env.mongoUri);
    console.info(`MongoDB connected: ${connection.connection.host}`);

    return connection;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    throw new Error(`MongoDB connection failed: ${message}`);
  }
};
