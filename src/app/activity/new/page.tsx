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
import { calculatePace } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapDrawer = dynamic(() => import("@/components/ui/map"), { ssr: false });

interface NewActivityPageProps {
  isModal?: boolean;
  onSuccess?: () => void;
}

export default function NewActivityPage({ isModal = false, onSuccess }: NewActivityPageProps) {
  const [type, setType] = useState("Run");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [pace, setPace] = useState("0:00");
  const [route, setRoute] = useState<[number, number][]>([]);

  const distanceNum = parseFloat(distance);
  const durationNum = parseFloat(duration);

  // Form validity
  const isFormValid =
    type &&
    date &&
    !isNaN(distanceNum) &&
    !isNaN(durationNum) &&
    distanceNum > 0 &&
    durationNum > 0 &&
    route.length > 0;

  const resetForm = () => {
    setType("Run");
    setDistance("");
    setDuration("");
    setDate("");
    setNotes("");
    setPace("0:00");
    setRoute([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const activityData = {
      type,
      distance: distanceNum,
      duration: durationNum,
      date,
      notes,
      pace,
      route,
    };

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });
      const result = await res.json();

      if (!res.ok) {
        alert("❌ Failed to save activity: " + (result.error || "Unknown error"));
      } else {
        alert("✅ Activity saved successfully!");
        resetForm();
        onSuccess?.();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while saving.");
    }
  };

  return (
    <div className={isModal ? "" : "min-h-screen p-8 bg-gradient-to-br from-white via-blue-50 to-purple-50"}>
      <div className={isModal ? "" : "max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"}>
        {!isModal && (
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New Activity</h2>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          {/* Activity Type */}
          <div>
            <Label>Activity Type</Label>
            <Select value={type} onValueChange={(val) => setType(val)}>
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

          {/* Distance & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Distance (km)</Label>
              <Input
                type="number"
                min={0}
                value={distance}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value;
                  setDistance(val);
                  const d = parseFloat(val);
                  const t = parseFloat(duration);
                  if (!isNaN(d) && !isNaN(t)) setPace(calculatePace(d, t));
                }}
              />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input
                type="number"
                min={0}
                value={duration}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value;
                  setDuration(val);
                  const d = parseFloat(distance);
                  const t = parseFloat(val);
                  if (!isNaN(d) && !isNaN(t)) setPace(calculatePace(d, t));
                }}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Optional Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {/* Pace */}
          <div>
            <Label className="text-sm text-gray-600">Pace (auto calculated)</Label>
            <p className="text-blue-700 font-semibold text-lg">{pace}</p>
          </div>

          {/* Map */}
          <div>
            <Label>Draw Your Route</Label>
            <MapDrawer onRouteDrawn={(coords) => setRoute(coords)} />
            {route.length > 0 && (
              <p className="mt-2 text-sm text-green-700">
                ✅ Route captured with {route.length} points
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 mt-4"
            disabled={!isFormValid}
          >
            Submit Activity
          </Button>
        </form>
      </div>
    </div>
  );
}
