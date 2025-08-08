import { z } from "zod";

export const ActivitySchema = z.object({
  type: z.enum(["Run", "Walk", "Ride"]),

  distance: z
    .number()
    .min(0.1, "Distance must be at least 0.1 km")
    .max(200, "Distance cannot exceed 200 km"),

  duration: z
    .number()
    .min(0.1, "Duration must be at least 0.1 minute")
    .max(480, "Duration cannot exceed 8 hours (480 minutes)"),

  date: z.string(),

 notes: z
  .string()
  .optional()
  .refine(
    (val) => !val || val.trim().split(/\s+/).length <= 100,
    { message: "Notes must not exceed 100 words" }
  ).optional(),

  pace: z.string(),

  route: z.array(z.tuple([z.number(), z.number()])),

  steps: z
    .number()
    .min(0, "Steps must be 0 or more"),

  calories: z
    .number()
    .min(0, "Calories must be 0 or more"),
});
