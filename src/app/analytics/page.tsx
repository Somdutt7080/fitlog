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

import { caloriesData, paceData, statTable } from "@/lib/data/dummyData"; // ✅ imported

export default function AnalyticsPage() {
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

        {/* Pace Line Chart */}
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
