import { type LeadSource, type LeadStatus } from "../models/Lead";

export type LeadSort = "latest" | "oldest";

export interface PublicLead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
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

export interface LeadQueryOptions {
  status?: LeadStatus | undefined;
  source?: LeadSource | undefined;
  search?: string | undefined;
  sort: LeadSort;
  page: number;
}

export type LeadExportQueryOptions = Omit<LeadQueryOptions, "page">;

export interface CsvExportData {
  filename: string;
  content: string;
}
