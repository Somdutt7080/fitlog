

import { z } from "zod";

export const ActivitySchema = z.object({
  type: z.enum(["Run", "Walk", "Ride"]),
  distance: z.number().min(0.1, "Distance must be positive"),
  duration: z.number().min(0.1, "Duration must be positive"),
  date: z.string(), // can use date refinement if needed
  notes: z.string().optional(),
  pace: z.string(),
  route: z.array(z.tuple([z.number(), z.number()])),
});
