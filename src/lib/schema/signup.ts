import { z } from "zod";

const genderOptions = ["male", "female", "other", "prefer-not-to-say"] as const;

export const userRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(6, "Full Name must be at least 6 characters")
      .max(30, "Full Name must be at most 30 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password too long")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must contain at least one number",
      }),

    confirmPassword: z.string(),

    dateOfBirth: z
      .string()
      .refine((val) => {
        const dob = new Date(val);
        const today = new Date();
        return !isNaN(dob.getTime()) && dob < today;
      }, { message: "Date of birth must be in the past" }),

    gender: z.enum(genderOptions),

    // 🔹 New fields (metric only)
    height: z
      .coerce
      .number()
      .min(50, "Height must be at least 50 cm")
      .max(300, "Height must be at most 300 cm"),

    weight: z
      .coerce
      .number()
      .min(20, "Weight must be at least 20 kg")
      .max(500, "Weight must be at most 500 kg"),

    // 🔹 Terms checkbox: must be true
    agree: z
      .boolean()
      .refine((v) => v === true, { message: "You must agree to the Terms and Privacy Policy" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
