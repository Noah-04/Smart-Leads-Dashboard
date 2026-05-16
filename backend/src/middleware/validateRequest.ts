import { type RequestHandler } from "express";
import { type ZodType } from "zod";

import { AppError } from "../errors/AppError";
import { type ErrorDetail } from "../types/api";

const toErrorDetails = (issues: readonly { path: readonly (string | number)[]; message: string }[]): ErrorDetail[] => {
  return issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message
  }));
};

export const validateBody = <TBody>(schema: ZodType<TBody>): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body as unknown);

    if (!result.success) {
      return next(new AppError(400, "Validation failed", toErrorDetails(result.error.issues)));
    }

    req.body = result.data;
    return next();
  };
};

export const validateQuery = <TQuery>(schema: ZodType<TQuery>): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query as unknown);

    if (!result.success) {
      return next(new AppError(400, "Validation failed", toErrorDetails(result.error.issues)));
    }

    (req as unknown as { query: TQuery }).query = result.data;
    return next();
  };
};
