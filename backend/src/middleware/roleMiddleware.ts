import { type RequestHandler } from "express";

import { AppError } from "../errors/AppError";
import { type UserRole } from "../models/User";

export const authorizeRoles = (...allowedRoles: readonly UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication is required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
};
