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
    <div className="bg-gradient-to-br from-black via-[#0b0b0f] to-[#1c0d21] min-h-screen p-6 space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
          Welcome back, {session.user?.name}!!
        </h2>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg hover:opacity-70 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Add Activity
          </Button>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold cursor-pointer">
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            title: "Last Run",
            value:
              activities.length > 0
                ? `${activities[activities.length - 1].distance} km | ${activities[activities.length - 1].duration} min`
                : "No data yet",
          },
          {
            title: "Weekly Total",
            value: `${weeklyData.reduce((sum, item) => sum + item.km, 0).toFixed(2)} km`,
          },
          {
            title: "Monthly Goal",
            value: "60% complete",
            progress: 60,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-lg font-bold text-cyan-300">
                {stat.title}
              </CardTitle>
              <CardDescription className="text-sm text-white/80">
                {stat.value}
              </CardDescription>
            </CardHeader>
            {stat.progress && (
              <CardContent>
                <Progress value={stat.progress} className="bg-white/20 h-2 rounded-full" />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-cyan-300">Weekly Trend</CardTitle>
            <CardDescription>Distance over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis unit=" km" stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white", borderRadius: "10px" }} />
                <Line type="monotone" dataKey="km" stroke="#22d3ee" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-pink-400">Monthly Summary</CardTitle>
            <CardDescription>Total distance per month</CardDescription>
          </CardHeader>
          <CardContent>
           <ResponsiveContainer width="100%" height={300}>
  <BarChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
    <XAxis dataKey="month"  />
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
      fill="url(#barGradient)" // gradient for normal state
      barSize={20}
      radius={[6, 6, 0, 0]}
      background={{ fill: "transparent" }}
      activeBar={{
        fill: "url(#barHoverGradient)", // gradient on hover
        style: {
          filter: "drop-shadow(0 0 8px rgba(255, 0, 255, 0.6))", // custom glow
        }
      }}
    />

    {/* Gradients */}
    <defs>
      {/* Normal bar gradient */}
      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ec21fb" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#ec21fb" stopOpacity={0.4} />
      </linearGradient>

      {/* Hover bar gradient */}
      <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#ec21fb" stopOpacity={0.6} />
      </linearGradient>
    </defs>
  </BarChart>
</ResponsiveContainer>

          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="text-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg p-6 mt-10">
        <CardTitle className="text-xl font-bold text-cyan-400">
          Ready to log your next activity?
        </CardTitle>
        <CardContent className="mt-4">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-70 cursor-pointer"
          >
            Add New Run
          </Button>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
       <div className="fixed inset-0 z-50 flex items-center justify-center  border border-white/10 bg-black/50 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl rounded-2xl border border-white/10  backdrop-blur-xl shadow-2xl shadow-pink-500/10 scale-95 animate-fadeInUp">
            <button
              onClick={tryCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 px-6 pt-4 pb-2">
  Add Your Activity
</div>

            <NewActivityPage
              isModal={true}
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
