import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { checkAdmin } from "@/lib/checkAdmin";
import { UserModel } from "@/app/models/user";

export async function GET() {
  await dbConnect();

  const { status, error, session } = await checkAdmin();
  if (status !== 200) return NextResponse.json({ error }, { status });

  try {
    const users = await UserModel.find({}, "fullName email _id createdAt");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
