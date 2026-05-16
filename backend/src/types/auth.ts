import { type UserRole } from "../models/User";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseData {
  user: PublicUser;
  accessToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
