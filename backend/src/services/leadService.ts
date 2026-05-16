import mongoose, { type FilterQuery, type SortOrder } from "mongoose";

import { AppError } from "../errors/AppError";
import { Lead, type ILead, type LeadDocument } from "../models/Lead";
import {
  type CsvExportData,
  type LeadExportQueryOptions,
  type LeadListData,
  type LeadQueryOptions,
  type PublicLead
} from "../types/lead";
import {
  type CreateLeadRequestBody,
  type UpdateLeadRequestBody
} from "../validators/leadSchemas";

const LEADS_PER_PAGE = 10;

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const toPublicLead = (lead: LeadDocument): PublicLead => {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt
  };
};

const buildLeadFilter = (
  options: LeadExportQueryOptions | LeadQueryOptions
): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  if (options.status) {
    filter.status = options.status;
  }

  if (options.source) {
    filter.source = options.source;
  }

  if (options.search) {
    const searchRegex = new RegExp(escapeRegex(options.search), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const buildLeadSort = (sort: LeadQueryOptions["sort"]): { createdAt: SortOrder } => {
  return {
    createdAt: sort === "oldest" ? 1 : -1
  };
};

const assertValidObjectId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid lead identifier");
  }
};

const escapeCsvValue = (value: string | Date): string => {
  const stringValue = value instanceof Date ? value.toISOString() : value;

  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
};

const leadsToCsv = (leads: readonly LeadDocument[]): string => {
  const headers = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.createdAt
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
};

export const createLead = async (input: CreateLeadRequestBody): Promise<PublicLead> => {
  const lead = await Lead.create(input);
  return toPublicLead(lead);
};

export const listLeads = async (options: LeadQueryOptions): Promise<LeadListData> => {
  const filter = buildLeadFilter(options);
  const skip = (options.page - 1) * LEADS_PER_PAGE;

  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter)
      .sort(buildLeadSort(options.sort))
      .skip(skip)
      .limit(LEADS_PER_PAGE),
    Lead.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalRecords / LEADS_PER_PAGE);

  return {
    leads: leads.map(toPublicLead),
    pagination: {
      page: options.page,
      limit: LEADS_PER_PAGE,
      totalRecords,
      totalPages,
      hasNextPage: options.page < totalPages,
      hasPreviousPage: options.page > 1
    }
  };
};

export const getLeadById = async (id: string): Promise<PublicLead> => {
  assertValidObjectId(id);

  const lead = await Lead.findById(id);

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  return toPublicLead(lead);
};

export const updateLead = async (
  id: string,
  input: UpdateLeadRequestBody
): Promise<PublicLead> => {
  assertValidObjectId(id);

  const lead = await Lead.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true
  });

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  return toPublicLead(lead);
};

export const deleteLead = async (id: string): Promise<PublicLead> => {
  assertValidObjectId(id);

  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  return toPublicLead(lead);
};

export const exportLeadsCsv = async (
  options: LeadExportQueryOptions
): Promise<CsvExportData> => {
  const leads = await Lead.find(buildLeadFilter(options)).sort(buildLeadSort(options.sort));
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return {
    filename: `leads-export-${timestamp}.csv`,
    content: leadsToCsv(leads)
  };
};
