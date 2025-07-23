// Enhanced Dashboard with Styled and Rounded Modal
"use client";

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
import { useState } from "react";
import { Home, PlusCircle, BarChart3, Map, X } from "lucide-react";
import NewActivityPage from "@/app/activity/new/page";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";


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
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return <p>No session. Please log in.</p>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-purple-700 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">FitLog</h1>
          <nav className="space-y-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-white gap-4">
                <Home className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" className="w-full justify-start text-white gap-4">
                <BarChart3 className="w-4 h-4" /> Analytics
              </Button>
            </Link>
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
          <span className="text-sm">{session.user?.name}</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-700">Welcome back,{session.user?.name}!</h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white hover:bg-blue-700">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Activity
            </Button>
            <Button variant="outline"
                    onClick={() => signOut({ callbackUrl: "/login" })}>
                    Logout
            </Button>
          </div>
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

        {/* CTA */}
        <Card className="text-center bg-white/70 backdrop-blur p-6 mt-10">
          <CardTitle className="text-xl font-bold text-blue-700">
            Ready to log your next activity?
          </CardTitle>
          <CardContent className="mt-4">
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white hover:bg-blue-700">
              Add New Run
            </Button>
          </CardContent>
        </Card>

        {/* Modal Overlay */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out">
    <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-lg transform transition-all duration-300 ease-out scale-95 animate-fadeInUp">
      
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="text-2xl font-semibold text-blue-700 px-6 pt-4 pb-4">
        Add Your Activity
      </div>

      {/* Form */}
      <NewActivityPage isModal />
    </div>
  </div>
)}

  </main>
    </div>
  );
}