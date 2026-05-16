import { z } from "zod";

import { LeadSource, LeadStatus } from "../models/Lead";

const leadNameSchema = z
  .string({
    required_error: "Lead name is required"
  })
  .trim()
  .min(2, "Lead name must be at least 2 characters")
  .max(100, "Lead name cannot exceed 100 characters");

const leadEmailSchema = z
  .string({
    required_error: "Lead email is required"
  })
  .trim()
  .email("Please provide a valid email address")
  .toLowerCase();

const pageQuerySchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim().length > 0) {
      return Number(value);
    }

    return value;
  },
  z
    .number({
      invalid_type_error: "Page must be a number"
    })
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1)
);

const searchQuerySchema = z
  .string()
  .trim()
  .min(1, "Search cannot be empty")
  .max(100, "Search cannot exceed 100 characters")
  .optional();

const sortQuerySchema = z.enum(["latest", "oldest"]).default("latest");

export const createLeadSchema = z
  .object({
    name: leadNameSchema,
    email: leadEmailSchema,
    status: z.nativeEnum(LeadStatus).default(LeadStatus.New),
    source: z.nativeEnum(LeadSource, {
      required_error: "Lead source is required"
    })
  })
  .strict();

export const updateLeadSchema = z
  .object({
    name: leadNameSchema.optional(),
    email: leadEmailSchema.optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one lead field must be provided",
    path: ["body"]
  });

export const listLeadsQuerySchema = z
  .object({
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    search: searchQuerySchema,
    sort: sortQuerySchema,
    page: pageQuerySchema
  })
  .strict();

export const exportLeadsQuerySchema = z
  .object({
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    search: searchQuerySchema,
    sort: sortQuerySchema
  })
  .strict();

export type CreateLeadRequestBody = z.infer<typeof createLeadSchema>;
export type UpdateLeadRequestBody = z.infer<typeof updateLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
export type ExportLeadsQuery = z.infer<typeof exportLeadsQuerySchema>;
