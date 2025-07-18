"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, TimerIcon, FootprintsIcon } from "lucide-react";
import { calculatePace } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapDrawer = dynamic(() => import("@/components/ui/map"), { ssr: false });

export default function NewActivityPage() {
  const [type, setType] = useState("Run");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [pace, setPace] = useState("0:00");
  const [route, setRoute] = useState<[number, number][]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Activity Data:", {
      type,
      distance,
      duration,
      date,
      notes,
      pace,
      route,
    });
    alert("✅ Activity Submitted! (backend baad me)");
  };

  const handleDistanceChange = (val: number) => {
    setDistance(val);
    setPace(calculatePace(val, duration));
  };

  const handleDurationChange = (val: number) => {
    setDuration(val);
    setPace(calculatePace(distance, val));
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New Activity</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Activity Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Run">Run</SelectItem>
                <SelectItem value="Walk">Walk</SelectItem>
                <SelectItem value="Ride">Ride</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Distance (km)</Label>
              <Input
                type="number"
                min={0}
                step="0.1"
                value={distance}
                onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
                icon={<FootprintsIcon className="w-4 h-4" />}
              />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
                icon={<TimerIcon className="w-4 h-4" />}
              />
            </div>
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              icon={<CalendarIcon className="w-4 h-4" />}
            />
          </div>

          <div>
            <Label>Optional Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div>
            <Label className="text-sm text-gray-600">Pace (auto calculated)</Label>
            <p className="text-blue-700 font-semibold text-lg">{pace} /km</p>
          </div>

          <div>
            <Label>Draw Your Route</Label>
            <MapDrawer onRouteDrawn={(coords) => setRoute(coords)} />
            {route.length > 0 && (
              <p className="mt-2 text-sm text-green-700">✅ Route captured with {route.length} points</p>
            )}
          </div>

          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 mt-4">
            Submit Activity
          </Button>
        </form>
      </div>
    </div>
  );
}
