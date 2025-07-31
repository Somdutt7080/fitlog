import { z } from "zod";

const genderOptions = ["male", "female", "other", "prefer-not-to-say"] as const;

export const UserRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(6, "Full name is required")
      .max(30, "Full name too long"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100)
      .refine(
        (val) => /[A-Z]/.test(val) && /[a-z]/.test(val) && /\d/.test(val),
        { message: "Password must contain uppercase, lowercase, and number" }
      ),

    confirmPassword: z.string(),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine(
        (val) => {
          const date = new Date(val);
          const now = new Date();
          return !isNaN(date.getTime()) && date < now;
        },
        { message: "Date of birth must be in the past" }
      ),

    // ✅ FIX: errorMap removed
    gender: z.enum(genderOptions, "Please select gender"),

    height: z.coerce.number().min(50, "Min 50 cm").max(300, "Max 300 cm"),
    weight: z.coerce.number().min(20, "Min 20 kg").max(500, "Max 500 kg"),

    agree: z.literal(true, {
      error: "You must agree to the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;
