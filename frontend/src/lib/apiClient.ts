import { API_BASE_URL } from "./config";
import {
  type ApiErrorDetail,
  type ApiErrorResponse,
  type ApiSuccessResponse
} from "../types/api";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details: readonly ApiErrorDetail[];

  public constructor(
    statusCode: number,
    message: string,
    details: readonly ApiErrorDetail[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface RequestJsonOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null | undefined;
  signal?: AbortSignal | undefined;
}

interface RequestBlobOptions {
  token?: string | null | undefined;
  signal?: AbortSignal | undefined;
}

export interface FileDownload {
  blob: Blob;
  filename: string | null;
}

const parseJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as unknown;
};

const isApiErrorResponse = (payload: unknown): payload is ApiErrorResponse => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    (payload as { success?: unknown }).success === false &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  );
};

const buildUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

const parseContentDispositionFilename = (contentDisposition: string | null): string | null => {
  if (!contentDisposition) {
    return null;
  }

  const encodedMatch = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);

  if (encodedMatch?.[1]) {
    return decodeURIComponent(encodedMatch[1].trim().replace(/^"|"$/g, ""));
  }

  const filenameMatch = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return filenameMatch?.[1] ?? null;
};

export const requestJson = async <TData>(
  path: string,
  options: RequestJsonOptions = {}
): Promise<TData> => {
  const headers = new Headers();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const requestInit: RequestInit = {
    headers,
    method: options.method ?? "GET"
  };

  if (options.body !== undefined) {
    requestInit.body = JSON.stringify(options.body);
  }

  if (options.signal) {
    requestInit.signal = options.signal;
  }

  const response = await fetch(buildUrl(path), requestInit);

  const payload = await parseJson(response);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiError(response.status, payload.message, payload.errors ?? []);
    }

    throw new ApiError(response.status, "Request failed");
  }

  const apiResponse = payload as ApiSuccessResponse<TData>;
  return apiResponse.data;
};

export const requestBlob = async (
  path: string,
  options: RequestBlobOptions = {}
): Promise<FileDownload> => {
  const headers = new Headers();

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const requestInit: RequestInit = {
    headers,
    method: "GET"
  };

  if (options.signal) {
    requestInit.signal = options.signal;
  }

  const response = await fetch(buildUrl(path), requestInit);

  if (!response.ok) {
    const payload = await parseJson(response);

    if (isApiErrorResponse(payload)) {
      throw new ApiError(response.status, payload.message, payload.errors ?? []);
    }

    throw new ApiError(response.status, "Request failed");
  }

  return {
    blob: await response.blob(),
    filename: parseContentDispositionFilename(response.headers.get("Content-Disposition"))
  };
};
