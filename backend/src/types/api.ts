export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  message: string;
  data: TData;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: readonly ErrorDetail[];
}
