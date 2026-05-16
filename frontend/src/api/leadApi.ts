import { requestBlob, requestJson, type FileDownload } from "../lib/apiClient";
import { type LeadListData, type PublicLead } from "../types/api";
import { type LeadSource, type LeadStatus } from "../types/domain";
import { type LeadListQuery } from "../types/leads";

export interface LeadPayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

type LeadExportQuery = Omit<LeadListQuery, "page">;

const buildLeadQueryString = (query: LeadListQuery | LeadExportQuery): string => {
  const params = new URLSearchParams();

  if ("page" in query) {
    params.set("page", String(query.page));
  }

  params.set("sort", query.sort);

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (query.source) {
    params.set("source", query.source);
  }

  return params.toString();
};

export const getLeads = async (
  token: string,
  query: LeadListQuery,
  signal?: AbortSignal
): Promise<LeadListData> => {
  return requestJson<LeadListData>(`/leads?${buildLeadQueryString(query)}`, {
    signal,
    token
  });
};

export const getLeadById = async (
  token: string,
  leadId: string,
  signal?: AbortSignal
): Promise<PublicLead> => {
  return requestJson<PublicLead>(`/leads/${leadId}`, {
    signal,
    token
  });
};

export const createLead = async (
  token: string,
  payload: LeadPayload
): Promise<PublicLead> => {
  return requestJson<PublicLead>("/leads", {
    body: payload,
    method: "POST",
    token
  });
};

export const updateLead = async (
  token: string,
  leadId: string,
  payload: LeadPayload
): Promise<PublicLead> => {
  return requestJson<PublicLead>(`/leads/${leadId}`, {
    body: payload,
    method: "PATCH",
    token
  });
};

export const deleteLead = async (token: string, leadId: string): Promise<PublicLead> => {
  return requestJson<PublicLead>(`/leads/${leadId}`, {
    method: "DELETE",
    token
  });
};

export const exportLeadsCsv = async (
  token: string,
  query: LeadExportQuery
): Promise<FileDownload> => {
  return requestBlob(`/leads/export/csv?${buildLeadQueryString(query)}`, {
    token
  });
};
