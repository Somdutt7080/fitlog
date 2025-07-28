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
    <div className="p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-6 h-6 text-blue-500" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Map View
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <Filters onFilter={handleFilter} />
      </div>

      {/* Map */}
      <div className="bg-white p-2 rounded-xl shadow-md">
        <MapView activities={filteredActivities} />
      </div>
    </div>
  );
}
