// src/app/api/profile/update/route.ts
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UpdateUserSchema } from "@/lib/schema/updatedUserSchema";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = UpdateUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { fullName, gender, dateOfBirth, height, weight } = result.data;

  try {
    await UserModel.findByIdAndUpdate(session.user.id, {
      fullName,
      gender,
      dateOfBirth,
      height,
      weight,
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Update failed", error: err }, { status: 500 });
  }
}
