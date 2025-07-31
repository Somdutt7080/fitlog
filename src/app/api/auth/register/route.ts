// app/api/auth/register/route.ts (ya jahan hai)
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/app/models/user";
import bcrypt from "bcryptjs";
import { userRegisterSchema } from "@/lib/schema/signup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = userRegisterSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const {
      fullName,
      email,
      password,
      dateOfBirth,
      gender,
      height,
      weight,
    } = result.data;

    // 🔎 Debug
  console.log("DATA TO SAVE:", { fullName, email, dateOfBirth, gender, height, weight });

    await dbConnect();

    const userExists = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      dateOfBirth,
      gender,
      height: Number(height),   // ✅ explicit number
      weight: Number(weight),   // ✅ explicit number
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
