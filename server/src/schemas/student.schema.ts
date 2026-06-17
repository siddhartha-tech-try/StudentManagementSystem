import { z } from "zod";

const requiredText = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`);

const dobSchema = z
  .string()
  .trim()
  .min(1, "Date of birth is required")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Date of birth must be a valid date")
  .refine((value) => new Date(value) <= new Date(), "Date of birth cannot be in the future");

export const studentBodySchema = z.object({
  name: requiredText("Name"),
  course: requiredText("Course"),
  year: z.coerce.number().int("Year must be a whole number").min(1).max(8),
  dateOfBirth: dobSchema,
  email: z.string().trim().email("Email must be valid").max(160),
  mobileNo: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Mobile number must be 10 to 15 digits and may start with +"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: requiredText("Address", 500)
});

export const studentIdParamSchema = z.object({
  id: z.string().uuid("Student id must be a valid UUID")
});

export const studentListQuerySchema = z.object({
  search: z.string().trim().optional().default(""),
  course: z.string().trim().optional().default(""),
  year: z.coerce.number().int().min(1).max(8).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(["createdAt", "updatedAt", "name", "course", "year", "admissionNumber"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export const activityQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export type StudentBody = z.infer<typeof studentBodySchema>;
export type StudentListQuery = z.infer<typeof studentListQuerySchema>;
