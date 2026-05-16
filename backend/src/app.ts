import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { authRoutes } from "./routes/authRoutes";
import { leadRoutes } from "./routes/leadRoutes";

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Smart Leads API is running"
    });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/leads", leadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
