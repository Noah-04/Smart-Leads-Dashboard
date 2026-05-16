import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { UserRole } from "../models/User";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
}

interface TokenSubject {
  id: string;
  role: UserRole;
}

const isUserRole = (value: unknown): value is UserRole => {
  return typeof value === "string" && Object.values(UserRole).includes(value as UserRole);
};

export const signAccessToken = (user: TokenSubject): string => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    role: user.role
  };

  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.jwtAccessSecret);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as Record<string, unknown>;

  if (typeof payload.sub !== "string" || !isUserRole(payload.role)) {
    throw new Error("Invalid token payload");
  }

  return {
    ...decoded,
    sub: payload.sub,
    role: payload.role
  };
};
