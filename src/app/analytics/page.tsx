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

const caloriesData = [
  { day: "Mon", calories: 250 },
  { day: "Tue", calories: 300 },
  { day: "Wed", calories: 200 },
  { day: "Thu", calories: 400 },
  { day: "Fri", calories: 350 },
  { day: "Sat", calories: 500 },
  { day: "Sun", calories: 450 },
];

const paceData = [
  { day: "Mon", pace: 6.2 },
  { day: "Tue", pace: 5.8 },
  { day: "Wed", pace: 6.5 },
  { day: "Thu", pace: 5.9 },
  { day: "Fri", pace: 6.1 },
  { day: "Sat", pace: 5.7 },
  { day: "Sun", pace: 6.3 },
];

const statTable = [
  { day: "Mon", distance: 4.5, duration: 28, calories: 250, pace: "6.2" },
  { day: "Tue", distance: 5.0, duration: 29, calories: 300, pace: "5.8" },
  { day: "Wed", distance: 3.8, duration: 25, calories: 200, pace: "6.5" },
  { day: "Thu", distance: 5.2, duration: 30, calories: 400, pace: "5.9" },
  { day: "Fri", distance: 5.6, duration: 34, calories: 350, pace: "6.1" },
  { day: "Sat", distance: 6.0, duration: 33, calories: 500, pace: "5.7" },
  { day: "Sun", distance: 5.3, duration: 32, calories: 450, pace: "6.3" },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-blue-700">Activity Analytics</h2>

        {/* Graph + Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calories Burned</CardTitle>
              <CardDescription>Per day over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={caloriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Table Card */}
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
                  {statTable.map((row, idx) => (
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

        {/* Pace LineChart */}
        <Card>
          <CardHeader>
            <CardTitle>Average Pace</CardTitle>
            <CardDescription>Minutes per kilometer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paceData}>
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
