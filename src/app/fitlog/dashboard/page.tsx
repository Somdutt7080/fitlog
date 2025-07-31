// fitlog-app/src/app/fitlog/dashboard/page.tsx
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
import useActivityStore from "@/store/activityStore";
import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "@/lib/fetchActivities";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ConfirmCloseModal from "@/components/ConfirmCloseModal";
import dynamic from "next/dynamic";
import type { NewActivityPageProps } from "@/types/activity";
const NewActivityPage = dynamic(() => import("@/components/NewActivity"), {
  ssr: false,
}) as unknown as React.FC<NewActivityPageProps>;

export default function Dashboard() {
  
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
const [formDirty, setFormDirty] = useState(false);
  
  const setActivities = useActivityStore((state) => state.setActivities);
  const activities = useActivityStore((state) => state.activities);

  const tryCloseModal = () => {
  if (formDirty) {
    setConfirmCloseOpen(true);
  } else {
    setShowModal(false);
  }
};

  const query = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
    enabled: !!session,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      setActivities(query.data);
      console.log("✅ Store updated with:", query.data);
    }
  }, [query.data]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>No session. Please log in.</p>;

  const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
    const totalKm = activities
      .filter((act) => new Date(act.date).toLocaleDateString("en-US", { weekday: "short" }) === day)
      .reduce((sum, act) => sum + act.distance, 0);
    return { day, km: Number(totalKm.toFixed(2)) };
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("en-US", { month: "short" });
    const totalDistance = activities
      .filter((act) => new Date(act.date).getMonth() === i)
      .reduce((sum, act) => sum + act.distance, 0);
    return { month, distance: Number(totalDistance.toFixed(2)) };
  });

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">Welcome back, {session.user?.name}!</h2>
        <div className="flex gap-4">
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Activity
          </Button>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer">
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Last Run</CardTitle>
            <CardDescription>
              {activities.length > 0
                ? `${activities[activities.length - 1].distance} km | ${activities[activities.length - 1].duration} min`
                : "No data yet"}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Total</CardTitle>
            <CardDescription>
              {weeklyData.reduce((sum, item) => sum + item.km, 0).toFixed(2)} km
            </CardDescription>
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
      </div>

      {/* CTA */}
      <Card className="text-center bg-white/70 backdrop-blur p-6 mt-10">
        <CardTitle className="text-xl font-bold text-blue-700">
          Ready to log your next activity?
        </CardTitle>
        <CardContent className="mt-4">
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            Add New Run
          </Button>
          
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-lg scale-95 animate-fadeInUp">
      <button
        onClick={tryCloseModal}
        className="absolute top-2 right-2 text-gray-500 hover:text-black" >
        <X className="w-5 h-5" />
      </button>
      <div className="text-2xl font-semibold text-blue-700 px-6 pt-4 pb-4">
        Add Your Activity
      </div>
      <NewActivityPage
        isModal= {true}
        onSuccess={() => {
        setFormDirty(false);
        setShowModal(false);
        }}
        onDirtyChange={(dirty) => setFormDirty(dirty)}
      />
    </div>
  </div>
)}
<ConfirmCloseModal
  open={confirmCloseOpen}
  onCancel={() => setConfirmCloseOpen(false)}
  onConfirm={() => {
    setConfirmCloseOpen(false);
    setFormDirty(false);
    setShowModal(false);
  }}
/>
    </div>
  );
}
