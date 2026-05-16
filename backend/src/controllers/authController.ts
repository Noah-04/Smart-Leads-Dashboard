import { type ParamsDictionary } from "express-serve-static-core";

import { AppError } from "../errors/AppError";
import { getUserProfile, loginUser, registerUser } from "../services/authService";
import { type ApiSuccessResponse } from "../types/api";
import { type AuthResponseData, type PublicUser } from "../types/auth";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { type LoginRequestBody, type RegisterRequestBody } from "../validators/authSchemas";

export const register = asyncHandler<
  ParamsDictionary,
  ApiSuccessResponse<AuthResponseData>,
  RegisterRequestBody
>(async (req, res) => {
  const data = await registerUser(req.body);
  res.status(201).json(successResponse("User registered successfully", data));
});

export const login = asyncHandler<
  ParamsDictionary,
  ApiSuccessResponse<AuthResponseData>,
  LoginRequestBody
>(async (req, res) => {
  const data = await loginUser(req.body);
  res.status(200).json(successResponse("User logged in successfully", data));
});

export const getCurrentUser = asyncHandler<
  ParamsDictionary,
  ApiSuccessResponse<PublicUser>
>(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Authentication is required");
  }

  const data = await getUserProfile(req.user.id);
  res.status(200).json(successResponse("Authenticated user fetched successfully", data));
});
