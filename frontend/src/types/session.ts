import { type PublicUser } from "./api";

export interface AuthSession {
  user: PublicUser;
  accessToken: string;
}
