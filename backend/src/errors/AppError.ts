import { type ErrorDetail } from "../types/api";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details: readonly ErrorDetail[];

  public constructor(
    statusCode: number,
    message: string,
    details: readonly ErrorDetail[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
