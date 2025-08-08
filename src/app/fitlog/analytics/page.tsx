"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import ActivityStore from "@/store/activityStore";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

export default function AnalyticsPage() {
  const { activities } = ActivityStore();
  const { data: session } = useSession();

  const userWeight = session?.user?.weight ?? 70; // fallback to 70kg if missing

const weeklyStats = useMemo(() => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const stats = dayNames.map((day) => ({
    day,
    distance: 0,
    duration: 0,
    calories: 0,
    pace: 0,
    count: 0,
  }));

  activities.forEach((activity: {
    date: string | number | Date;
    distance: number;
    duration: number;
    pace: string;
  }) => {
    const date = new Date(activity.date);
    const dayIdx = date.getDay();
    const entry = stats[dayIdx];

    entry.distance += activity.distance;
    entry.duration += activity.duration;
    entry.calories += Math.round(activity.distance * 60); // 🔥 calorie calc
    const paceNum = parseFloat(activity.pace?.split(" ")[0]) || 0;
    entry.pace += paceNum;
    entry.count += 1;
  });

  // ⏫ Reorder stats starting from today
  const todayIdx = new Date().getDay();
  const orderedStats = [
    ...stats.slice(todayIdx),
    ...stats.slice(0, todayIdx),
  ];

  return orderedStats.map((entry) => ({
    day: entry.day,
    distance: entry.distance.toFixed(1),
    duration: entry.duration,
    calories: entry.calories,
    pace: entry.count > 0 ? (entry.pace / entry.count).toFixed(1) : "0.0",
  }));
}, [activities]);


  return (
    <div className="bg-gradient-to-br from-black via-[#0b0b0f] to-[#1c0d21] min-h-screen p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
          Activity Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calories Bar Chart */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-pink-400">Calories Burned</CardTitle>
              <CardDescription className="text-white/70">Per day over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      color: "white",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#94a3b8" }}
                    itemStyle={{ color: "#f472b6" }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="calories"
                    fill="url(#caloriesGradient)"
                    barSize={20}
                    radius={[6, 6, 0, 0]}
                    activeBar={{
                      fill: "url(#caloriesHoverGradient)",
                      style: { filter: "drop-shadow(0 0 8px rgba(255, 0, 255, 0.6))" }
                    }}
                  />
                  <defs>
                    <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec21fb" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ec21fb" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="caloriesHoverGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#ec21fb" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stats Table */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-lg overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-cyan-400">Weekly Stats</CardTitle>
              <CardDescription className="text-white/70">Detailed summary of your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-cyan-300">
                    <th className="py-2">Day</th>
                    <th className="py-2">Distance (km)</th>
                    <th className="py-2">Duration (min)</th>
                    <th className="py-2">Calories</th>
                    <th className="py-2">Pace</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyStats.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white/10" : "bg-white/5"}>
                      <td className="px-2 py-1 font-medium">{row.day}</td>
                      <td className="px-2 py-1">{row.distance}</td>
                      <td className="px-2 py-1">{row.duration}</td>
                      <td className="px-2 py-1">{row.calories}</td>
                      <td className="px-2 py-1">{row.pace} min/km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Pace Line Chart */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-400">Average Pace</CardTitle>
            <CardDescription className="text-white/70">Minutes per kilometer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis unit=" min/km" stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    color: "white",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#94a3b8" }}
                  itemStyle={{ color: "#22c55e" }}
                  cursor={{ fill: "transparent" }}
                />
                <Line
                  type="monotone"
                  dataKey="pace"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#fff", strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
