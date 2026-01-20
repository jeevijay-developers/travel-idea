import { z } from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" });

// Admin login schema
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Enquiry form validation schema
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name contains invalid characters" }),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .max(20, { message: "Phone number is too long" })
    .regex(/^[\d\s\+\-\(\)]*$/, { message: "Invalid phone number format" })
    .optional()
    .or(z.literal("")),
  destination: z
    .string()
    .trim()
    .min(1, { message: "Destination is required" })
    .max(100, { message: "Destination must be less than 100 characters" }),
  message: z
    .string()
    .trim()
    .max(2000, { message: "Message must be less than 2000 characters" })
    .optional()
    .or(z.literal("")),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
