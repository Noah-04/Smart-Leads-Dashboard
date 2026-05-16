import bcrypt from "bcrypt";

import { AppError } from "../errors/AppError";
import { User, UserRole, type UserDocument } from "../models/User";
import { type AuthResponseData, type PublicUser } from "../types/auth";
import { signAccessToken } from "../utils/jwt";
import { type LoginRequestBody, type RegisterRequestBody } from "../validators/authSchemas";

const PASSWORD_SALT_ROUNDS = 12;

const toPublicUser = (user: UserDocument): PublicUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const buildAuthResponse = (user: UserDocument): AuthResponseData => {
  return {
    user: toPublicUser(user),
    accessToken: signAccessToken({
      id: user.id,
      role: user.role
    })
  };
};

export const registerUser = async (input: RegisterRequestBody): Promise<AuthResponseData> => {
  const existingUser = await User.exists({ email: input.email });

  if (existingUser) {
    throw new AppError(409, "An account with this email already exists", [
      {
        field: "email",
        message: "Email is already registered"
      }
    ]);
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: UserRole.SalesUser
  });

  return buildAuthResponse(user);
};

export const loginUser = async (input: LoginRequestBody): Promise<AuthResponseData> => {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  return buildAuthResponse(user);
};

export const getUserProfile = async (userId: string): Promise<PublicUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return toPublicUser(user);
};
