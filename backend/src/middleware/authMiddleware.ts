import { type RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../errors/AppError";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken } from "../utils/jwt";

const getBearerToken = (authorizationHeader: string | undefined): string => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication token is required");
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    throw new AppError(401, "Authentication token is required");
  }

  return token;
};

export const protect: RequestHandler = asyncHandler(async (req, _res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("_id email role");

    if (!user) {
      throw new AppError(401, "User attached to this token no longer exists");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, "Authentication token has expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, "Invalid authentication token");
    }

    throw new AppError(401, "Authentication failed");
  }
});
