import { type LeadSource, type LeadStatus } from "./domain";

export type LeadSort = "latest" | "oldest";
export type StatusFilter = "all" | LeadStatus;
export type SourceFilter = "all" | LeadSource;

export interface LeadListQuery {
  page: number;
  sort: LeadSort;
  search?: string | undefined;
  status?: LeadStatus | undefined;
  source?: LeadSource | undefined;
}

export interface LeadFilterState {
  page: number;
  sort: LeadSort;
  searchInput: string;
  status: StatusFilter;
  source: SourceFilter;
}
