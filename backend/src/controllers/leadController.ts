import { type ParamsDictionary } from "express-serve-static-core";

import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLeadById,
  listLeads,
  updateLead
} from "../services/leadService";
import { type ApiSuccessResponse } from "../types/api";
import { type LeadListData, type PublicLead } from "../types/lead";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  type CreateLeadRequestBody,
  type ExportLeadsQuery,
  type ListLeadsQuery,
  type UpdateLeadRequestBody
} from "../validators/leadSchemas";

interface LeadParams extends ParamsDictionary {
  id: string;
}

export const createLeadHandler = asyncHandler<
  ParamsDictionary,
  ApiSuccessResponse<PublicLead>,
  CreateLeadRequestBody
>(async (req, res) => {
  const data = await createLead(req.body);
  res.status(201).json(successResponse("Lead created successfully", data));
});

export const listLeadsHandler = asyncHandler<
  ParamsDictionary,
  ApiSuccessResponse<LeadListData>
>(async (req, res) => {
  const query = req.query as unknown as ListLeadsQuery;
  const data = await listLeads(query);
  res.status(200).json(successResponse("Leads fetched successfully", data));
});

export const getLeadHandler = asyncHandler<
  LeadParams,
  ApiSuccessResponse<PublicLead>
>(async (req, res) => {
  const data = await getLeadById(req.params.id);
  res.status(200).json(successResponse("Lead fetched successfully", data));
});

export const updateLeadHandler = asyncHandler<
  LeadParams,
  ApiSuccessResponse<PublicLead>,
  UpdateLeadRequestBody
>(async (req, res) => {
  const data = await updateLead(req.params.id, req.body);
  res.status(200).json(successResponse("Lead updated successfully", data));
});

export const deleteLeadHandler = asyncHandler<
  LeadParams,
  ApiSuccessResponse<PublicLead>
>(async (req, res) => {
  const data = await deleteLead(req.params.id);
  res.status(200).json(successResponse("Lead deleted successfully", data));
});

export const exportLeadsCsvHandler = asyncHandler<
  ParamsDictionary,
  string
>(async (req, res) => {
  const query = req.query as unknown as ExportLeadsQuery;
  const data = await exportLeadsCsv(query);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${data.filename}"`);
  res.status(200).send(data.content);
});
