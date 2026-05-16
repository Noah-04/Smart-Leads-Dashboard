import { requestJson } from "../lib/apiClient";
import { type AuthResponseData } from "../types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponseData> => {
  return requestJson<AuthResponseData>("/auth/login", {
    body: payload,
    method: "POST"
  });
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponseData> => {
  return requestJson<AuthResponseData>("/auth/register", {
    body: payload,
    method: "POST"
  });
};
