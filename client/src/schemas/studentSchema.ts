import { z } from 'zod'

export const studentFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  course: z.string().trim().min(1, 'Course is required').max(120),
  year: z.number().int('Year must be a whole number').min(1).max(8),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'Date of birth is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Date of birth must be valid')
    .refine((value) => new Date(value) <= new Date(), 'Date of birth cannot be in the future'),
  email: z.string().trim().email('Email must be valid').max(160),
  mobileNo: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, 'Mobile number must be 10 to 15 digits'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().trim().min(1, 'Address is required').max(500),
})
