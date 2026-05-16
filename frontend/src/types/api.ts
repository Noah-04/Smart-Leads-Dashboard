import { type LeadSource, type LeadStatus, type UserRole } from "./domain";

export interface ApiErrorDetail {
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
  errors?: readonly ApiErrorDetail[];
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: PublicUser;
  accessToken: string;
}

export interface PublicLead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LeadListData {
  leads: PublicLead[];
  pagination: PaginationMeta;
}
