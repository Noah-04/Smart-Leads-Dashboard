import { type ApiSuccessResponse } from "../types/api";

export const successResponse = <TData>(
  message: string,
  data: TData
): ApiSuccessResponse<TData> => {
  return {
    success: true,
    message,
    data
  };
};
