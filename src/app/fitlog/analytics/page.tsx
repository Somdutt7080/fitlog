// app/fitlog/analytics/page.tsx
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

export default function AnalyticsPage() {
  const { activities } = ActivityStore();

  // 🧠 Generate weekly stats (Sun-Sat)
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

    activities.forEach((activity: { date: string | number | Date; distance: number; duration: number; pace: string; }) => {
      const date = new Date(activity.date);
      const dayIdx = date.getDay();
      const entry = stats[dayIdx];

      entry.distance += activity.distance;
      entry.duration += activity.duration;
      entry.calories += Math.round(activity.distance * 60); // estimate
      const paceNum = parseFloat(activity.pace?.split(" ")[0]) || 0;
      entry.pace += paceNum;
      entry.count += 1;
    });

    return stats.map((entry) => ({
      day: entry.day,
      distance: entry.distance.toFixed(1),
      duration: entry.duration,
      calories: entry.calories,
      pace: entry.count > 0 ? (entry.pace / entry.count).toFixed(1) : "0.0",
    }));
  }, [activities]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-blue-700">Activity Analytics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calories Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Calories Burned</CardTitle>
              <CardDescription>Per day over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#4b5563" }}
                  itemStyle={{ color: "#16a34a" }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="distance"
                  fill="#8884d8"
                  barSize={19}
                  radius={[6, 6, 0, 0]}
                  activeBar={{ fill: "#ec21fbff" }}
                  background={{ fill: "transparent" }}
                />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stats Table */}
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle>Weekly Stats</CardTitle>
              <CardDescription>Detailed summary of your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-blue-700">
                    <th className="py-2">Day</th>
                    <th className="py-2">Distance (km)</th>
                    <th className="py-2">Duration (min)</th>
                    <th className="py-2">Calories</th>
                    <th className="py-2">Pace</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyStats.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
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
        <Card>
          <CardHeader>
            <CardTitle>Average Pace</CardTitle>
            <CardDescription>Minutes per kilometer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis unit=" min/km" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pace"
                  stroke="#82ca9d"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
