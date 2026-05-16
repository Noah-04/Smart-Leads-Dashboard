import dotenv from "dotenv";
import { type SignOptions } from "jsonwebtoken";

dotenv.config();

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

interface EnvironmentConfig {
  readonly nodeEnv: "development" | "production" | "test";
  readonly port: number;
  readonly mongoUri: string;
  readonly jwtAccessSecret: string;
  readonly jwtAccessExpiresIn: JwtExpiresIn;
}

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return 5000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
};

const parseNodeEnv = (value: string | undefined): EnvironmentConfig["nodeEnv"] => {
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }

  return "development";
};

const parseJwtExpiresIn = (value: string | undefined): JwtExpiresIn => {
  return (value ?? "15m") as JwtExpiresIn;
};

export const env: EnvironmentConfig = {
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  port: parsePort(process.env.PORT),
  mongoUri: getRequiredEnv("MONGODB_URI"),
  jwtAccessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),
  jwtAccessExpiresIn: parseJwtExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN)
};
