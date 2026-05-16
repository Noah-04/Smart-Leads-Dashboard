import { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError";
import { type ApiErrorResponse, type ErrorDetail } from "../types/api";

interface MongoDuplicateKeyError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

const isMongoDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
};

const duplicateKeyDetails = (error: MongoDuplicateKeyError): ErrorDetail[] => {
  const fields = error.keyValue ? Object.keys(error.keyValue) : ["field"];

  return fields.map((field) => ({
    field,
    message: `${field} already exists`
  }));
};

const mongooseValidationDetails = (error: mongoose.Error.ValidationError): ErrorDetail[] => {
  return Object.entries(error.errors).map(([field, validationError]) => ({
    field,
    message: validationError.message
  }));
};

const zodValidationDetails = (error: ZodError): ErrorDetail[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message
  }));
};

const sendError = (
  res: Response<ApiErrorResponse>,
  statusCode: number,
  message: string,
  details: readonly ErrorDetail[] = []
): void => {
  const response: ApiErrorResponse = details.length
    ? {
        success: false,
        message,
        errors: details
      }
    : {
        success: false,
        message
      };

  res.status(statusCode).json(response);
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message, error.details);
    return;
  }

  if (error instanceof ZodError) {
    sendError(res, 400, "Validation failed", zodValidationDetails(error));
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    sendError(res, 400, "Validation failed", mongooseValidationDetails(error));
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    sendError(res, 400, "Invalid resource identifier");
    return;
  }

  if (isMongoDuplicateKeyError(error)) {
    sendError(res, 409, "Duplicate value conflict", duplicateKeyDetails(error));
    return;
  }

  const message = process.env.NODE_ENV === "production" ? "Internal server error" : "Unexpected server error";
  sendError(res, 500, message);
};
