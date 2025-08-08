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

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { date, steps, calories, distance, duration, route, ...rest } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const istNow = getISTDate();
    const activityDate = new Date(date);

    if (activityDate.toDateString() !== istNow.toDateString()) {
      return NextResponse.json({
        error: "You can only log activity for today.",
      }, { status: 400 });
    }

    if (activityDate.getTime() > istNow.getTime()) {
      return NextResponse.json({ error: "Date cannot be in the future." }, { status: 400 });
    }

    // Validation for steps, calories, distance, duration
    if (typeof steps !== "number" || steps <= 0 || steps > 100000) {
      return NextResponse.json({ error: "Invalid step count" }, { status: 400 });
    }

    if (typeof calories !== "number" || calories < 0 || calories > 5000) {
      return NextResponse.json({ error: "Invalid calories value" }, { status: 400 });
    }

    if (typeof distance !== "number" || distance <= 0.05 || distance > 100) {
      return NextResponse.json({ error: "Distance must be valid" }, { status: 400 });
    }

    if (typeof duration !== "number" || duration <= 0 || duration > 36000) {
      return NextResponse.json({ error: "Duration must be valid" }, { status: 400 });
    }

  //  route-based distance verification
    if (!Array.isArray(route) || route.length < 2) {
      return NextResponse.json({ error: "Invalid route data" }, { status: 400 });
    }

    const toRad = (value: number) => (value * Math.PI) / 180;
    const haversine = ([lat1, lon1]: number[], [lat2, lon2]: number[]) => {
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let calculatedDistance = 0;
    for (let i = 1; i < route.length; i++) {
      calculatedDistance += haversine(route[i - 1], route[i]);
    }

    if (Math.abs(calculatedDistance - distance) > 0.05) {
      return NextResponse.json({ error: "Tampered distance detected." }, { status: 400 });
    }

    const newActivity = await Activity.create({
      ...rest,
      date: istNow,
      userId: user._id,
      steps,
      calories,
      distance,
      duration,
      route,
    });

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
