import { z } from "zod";

export const tripSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  participantCount: z.number()
    .int("Must be a whole number")
    .min(2, "At least 2 participants required")
    .max(1000, "Maximum 1000 participants"),
  budgetLevel: z.enum(["low", "medium", "high"]),
  goalTags: z.array(z.string()).max(10, "Maximum 10 goals"),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const activitySchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(500),
  duration_minutes: z.number().int().positive(),
});

export const blockUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export const checklistItemSchema = z.object({
  title: z.string().min(1).max(500),
});

export type TripFormData = z.infer<typeof tripSchema>;
