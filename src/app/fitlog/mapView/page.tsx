"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useActivityStore from "@/store/activityStore";
import Filters from "@/components/MapFilters";
import { MapPin } from "lucide-react"; // for icon

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapViewPage() {
  const { activities } = useActivityStore();
  const [filteredActivities, setFilteredActivities] = useState(activities);

  const normalizeDate = (date: Date) => date.toISOString().split("T")[0];

  const handleFilter = (type: string, from: string, to: string) => {
    const fromDate = from ? normalizeDate(new Date(from)) : null;
    const toDate = to ? normalizeDate(new Date(to)) : null;

    const filtered = activities.filter((act) => {
      const actDate = normalizeDate(new Date(act.date));
      const typeMatch = type === "All" || act.type === type;
      const dateMatch =
        (!fromDate || actDate >= fromDate) &&
        (!toDate || actDate <= toDate);
      return typeMatch && dateMatch;
    });

    setFilteredActivities(filtered);
  };

  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  return (
   <div className="bg-gradient-to-br from-[#050505] via-[#0b0b0f] to-[#1c0d21] min-h-screen p-6 text-white">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-cyan-400 drop-shadow-glow" />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
          Map View
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg mb-8">
        <Filters onFilter={handleFilter} />
      </div>

      {/* Map Container */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden h-[600px] ring-1 ring-white/10">
        <MapView activities={filteredActivities} />
      </div>
    </div>
  );
}
