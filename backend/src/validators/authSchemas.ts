import { z } from "zod";

const emailSchema = z
  .string({
    required_error: "Email is required"
  })
  .trim()
  .email("Please provide a valid email address")
  .toLowerCase();

const passwordSchema = z
  .string({
    required_error: "Password is required"
  })
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password cannot exceed 72 characters")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[0-9]/, "Password must include at least one number");

export const registerSchema = z.object({
  name: z
    .string({
      required_error: "Name is required"
    })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({
      required_error: "Password is required"
    })
    .min(1, "Password is required")
});

export type RegisterRequestBody = z.infer<typeof registerSchema>;
export type LoginRequestBody = z.infer<typeof loginSchema>;
