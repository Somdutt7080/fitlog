"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Home, PlusCircle, BarChart3, Map} from "lucide-react";

const weeklyData = [
  { day: "Mon", km: 4 },
  { day: "Tue", km: 6 },
  { day: "Wed", km: 3.5 },
  { day: "Thu", km: 5 },
  { day: "Fri", km: 7 },
  { day: "Sat", km: 6.5 },
  { day: "Sun", km: 5.5 },
];

const monthlyData = [
  { month: "Jan", distance: 75 },
  { month: "Feb", distance: 52 },
  { month: "Mar", distance: 68 },
  { month: "Apr", distance: 60 },
  { month: "May", distance: 70 },
  { month: "Jun", distance: 85 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
     <aside className="w-64 bg-gradient-to-b from-blue-700 to-purple-700 text-white p-6 flex flex-col justify-between">
  <div>
    <h1 className="text-2xl font-bold mb-8">FitLog</h1>
    <nav className="space-y-8">
      {/* Dashboard */}
      <Link href="/dashboard">
        <Button variant="ghost" className="w-full justify-start text-white gap-4">
          <Home className="w-4 h-4" /> Dashboard
        </Button>
      </Link>

      {/* Add Activity */}
      <Link href="/activity/new">
        <Button variant="ghost" className="w-full justify-start text-white gap-4">
          <PlusCircle className="w-4 h-4" /> Add Activity
        </Button>
      </Link>

      {/* Analytics */}
      <Link href="/analytics">
        <Button variant="ghost" className="w-full justify-start text-white gap-4">
          <BarChart3 className="w-4 h-4" /> Analytics
        </Button>
      </Link>

      {/* Map View */}
      <Link href="/mapView">
        <Button variant="ghost" className="w-full justify-start text-white gap-4">
          <Map className="w-4 h-4" /> Map View
        </Button>
      </Link>
    </nav>
  </div>

  <div className="flex items-center gap-2">
    <Avatar>
      <AvatarImage src="/user.jpg" />
      <AvatarFallback>FL</AvatarFallback>
    </Avatar>
    <span className="text-sm">John Doe</span>
  </div>
</aside>


      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-700">Welcome back, John!</h2>
          <Button variant="outline">Logout</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Last Run</CardTitle>
              <CardDescription>5.45 km | 28:15</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Total</CardTitle>
              <CardDescription>42.5 km</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Goal</CardTitle>
              <CardDescription>60% complete</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={60} />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trend</CardTitle>
              <CardDescription>Distance over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis unit=" km" />
                  <Tooltip />
                  <Line type="monotone" dataKey="km" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>Total distance per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis unit=" km" />
                  <Tooltip />
                  <Bar dataKey="distance" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* CTA Card */}
        <Card className="text-center bg-white/70 backdrop-blur p-6 mt-10">
          <CardTitle className="text-xl font-bold text-blue-700">
            Ready to log your next activity?
          </CardTitle>
          <CardContent className="mt-4">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Add New Run
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}