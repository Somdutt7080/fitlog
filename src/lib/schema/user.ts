import { z } from "zod";

const genderOptions = ["male", "female", "other", "prefer-not-to-say"] as const;

export const UserRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(6, " Username is required")
      .max(30, "Username too long"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100)
      .refine(
        (val) =>
          /[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val),
        {
          message:
            "Password must contain uppercase, lowercase, and number",
        }
      ),

    confirmPassword: z.string(),

    dateOfBirth: z
      .string()
      .refine(
        (val) => {
          const date = new Date(val);
          const now = new Date();
          return date < now;
        },
        { message: "Date of birth must be in the past" }
      ),

    gender: z.enum(genderOptions),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
