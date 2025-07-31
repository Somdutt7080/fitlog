// models/user.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; 
  fullName: string;
  email: string;
  password: string;
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  role?: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender:   { type: String },
    dateOfBirth: { type: String },
    height:   { type: Number },   // ✅
    weight:   { type: Number },   // ✅
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// ⬇️ DEV hot-reload ke waqt purana model remove karo
try {
  mongoose.deleteModel("User");
} catch { /* ignore if not exists */ }

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
