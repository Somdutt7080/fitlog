"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import { routesData, Route } from "@/lib/data/dummyData";

const MapDisplay = dynamic(() => import("@/components/ui/map-display"), {
  ssr: false,
});

export default function MapViewPage() {
  const [selectedType, setSelectedType] = useState("Run");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredRoutes = routesData.filter((route) => {
    const matchType = selectedType ? route.type === selectedType : true;
    const routeDate = new Date(route.date).getTime();
    const matchStart = startDate ? routeDate >= new Date(startDate).getTime() : true;
    const matchEnd = endDate ? routeDate <= new Date(endDate).getTime() : true;
    return matchType && matchStart && matchEnd;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filter Routes</CardTitle>
            <CardDescription>View your past walk/run/ride activities on the map.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Activity Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Run">Run</SelectItem>
                  <SelectItem value="Walk">Walk</SelectItem>
                  <SelectItem value="Ride">Ride</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>Showing {filteredRoutes.length} route(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-xl overflow-hidden">
              <MapDisplay routes={filteredRoutes} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
