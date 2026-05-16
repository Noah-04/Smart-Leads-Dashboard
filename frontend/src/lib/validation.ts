import { z } from "zod";

import { LeadSource, LeadStatus } from "../types/domain";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name cannot exceed 80 characters");

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password cannot exceed 72 characters")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/[0-9]/, "Password needs a number");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password")
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Lead name must be at least 2 characters")
    .max(100, "Lead name cannot exceed 100 characters"),
  email: emailSchema,
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource)
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;
