import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { User, UserRole } from "./models/User";

dotenv.config();

const ADMIN_EMAIL = "admin@company.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Company Admin";
const PASSWORD_SALT_ROUNDS = 12;

const getMongoUri = (): string => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  return mongoUri;
};

const seedAdminUser = async (): Promise<void> => {
  await mongoose.connect(getMongoUri());

  const existingAdmin = await User.exists({
    email: ADMIN_EMAIL
  });

  if (existingAdmin) {
    console.info(`Admin seed skipped: ${ADMIN_EMAIL} already exists`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, PASSWORD_SALT_ROUNDS);

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: UserRole.Admin
  });

  console.info(`Admin seed created: ${ADMIN_EMAIL}`);
};

const runSeed = async (): Promise<void> => {
  try {
    await seedAdminUser();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown seed error";
    console.error(`Admin seed failed: ${message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void runSeed();
