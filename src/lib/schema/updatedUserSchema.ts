// src/lib/schema/updateUserSchema.ts
import { z } from "zod";

export const UpdateUserSchema = z.object({
  fullName: z.string().min(6, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  height: z
    .string()
    .min(1, "Height is required")
    .transform((val) => parseFloat(val)),
  weight: z
    .string()
    .min(1, "Weight is required")
    .transform((val) => parseFloat(val)),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
