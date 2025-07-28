// app/api/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import { Activity } from "@/app/models/addActivity";
import { UserModel } from "@/app/models/user";

function getISTDate(): Date {
  const now = new Date();
  const offsetInMs = 5.5 * 60 * 60 * 1000; // IST offset
  return new Date(now.getTime() + offsetInMs);
}

function getTimeBlock(hour: number): 1 | 2 | 3 {
  if (hour < 8) return 1;
  if (hour < 16) return 2;
  return 3;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      console.log("❌ Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { date, ...rest } = body;

    if (!date) {
      console.log("❌ No date provided");
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const istNow = getISTDate();
    const activityDate = new Date(date);

    console.log("🕒 IST Time:", istNow.toISOString());
    console.log("📅 Client Provided Date:", activityDate.toISOString());

    if (activityDate.toDateString() !== istNow.toDateString()) {
      console.log("❌ Invalid date - not today's date");
      return NextResponse.json({
        error: "You can only log activity for today.",
      }, { status: 400 });
    }

    const startOfDay = new Date(istNow);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(istNow);
    endOfDay.setHours(23, 59, 59, 999);

    const todaysActivities = await Activity.find({
      userId: user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    console.log("📊 Activities Today:", todaysActivities.length);
    todaysActivities.forEach((a, i) =>
      console.log(`🔹 Activity ${i + 1} at:`, new Date(a.date).toISOString())
    );

    if (todaysActivities.length >= 3) {
      console.log("❌ Max 3 activities reached");
      return NextResponse.json({
        error: "You’ve reached the max limit of 3 activities for today.",
      }, { status: 400 });
    }

    const currentHour = istNow.getHours();
    const currentBlock = getTimeBlock(currentHour);
    console.log("📦 Current Block:", currentBlock);

    const hasActivityInCurrentBlock = todaysActivities.some((activity: any) => {
      const activityHour = new Date(activity.date).getHours();
      const activityBlock = getTimeBlock(activityHour);
      console.log(`🔍 Checking activity at hour ${activityHour} → block ${activityBlock}`);
      return activityBlock === currentBlock;
    });

    if (hasActivityInCurrentBlock) {
      console.log("❌ Already logged activity in this block");
      return NextResponse.json({
        error: `You’ve already logged an activity in this time block (Block ${currentBlock}). Try in the next block.`,
      }, { status: 400 });
    }

    const passedBlocks = currentBlock - 1;
    const maxAllowed = 3 - passedBlocks;

    console.log("⏳ Passed Blocks:", passedBlocks);
    console.log("✅ Max allowed activities right now:", maxAllowed);

    if (todaysActivities.length >= maxAllowed) {
      console.log("❌ Missed earlier blocks, can't log more");
      return NextResponse.json({
        error: `You missed earlier time blocks. You can log max ${maxAllowed} activity(ies) now.`,
      }, { status: 400 });
    }

    const newActivity = await Activity.create({
      ...rest,
      date: istNow,
      userId: user._id,
    });

    console.log("✅ New Activity Logged:", newActivity._id);
    return NextResponse.json({ success: true, activity: newActivity });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}





// ✅ GET = Fetch activities of logged-in user
export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activities = await Activity.find({ userId: user._id }).sort({ date: -1 });

    return NextResponse.json(activities); // 👈 You can also wrap in { success: true, data: activities } if needed
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
