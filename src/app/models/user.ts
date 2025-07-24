import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  gender?: string;
  dob?: string;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String },
  dob: { type: String },
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
