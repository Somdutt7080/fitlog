import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { checkAdmin } from "@/lib/checkAdmin";
import { Activity } from "@/app/models/addActivity";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { status, error, session } = await checkAdmin();
  if (status !== 200) return NextResponse.json({ error }, { status });

  const userId = req.nextUrl.searchParams.get("userId");

  try {
    const filter = userId ? { userId } : {};
    const activities = await Activity.find(filter).sort({ date: -1 });

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
