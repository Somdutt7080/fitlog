"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import LiveMapTracker from "@/components/ui/map";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface NewActivityPageProps {
  isModal?: boolean;
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

// Haversine utility
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NewActivityPage({
  isModal = false,
  onSuccess,
  onDirtyChange,
}: NewActivityPageProps) {
  const [type, setType] = useState("Run");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [pace, setPace] = useState("0:00");
  const [route, setRoute] = useState<[number, number][]>([]);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);


  const lastCoords = useRef<[number, number] | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedBeforePause = useRef(0);

  const isFormValid = type && distance > 0 && duration > 0 && route.length > 0;
  const isDirty = distance > 0 || duration > 0 || notes !== "" || route.length > 0;

  useEffect(() => {
  if (!("geolocation" in navigator)) {
    setHasLocationPermission(false);
    toast.error("❌ Your browser does not support GPS.");
    return;
  }

  // Ask browser for permission state
  navigator.permissions?.query({ name: "geolocation" as PermissionName })
    .then((result) => {
      if (result.state === "granted") {
        setHasLocationPermission(true);
      } else if (result.state === "denied") {
        setHasLocationPermission(false);
        toast.error("❌ Location permission denied. Enable it in your browser settings.");
      } else {
        // state is "prompt" (first-time)
        setHasLocationPermission(true); // allow start and handle errors later
      }
    }).catch(() => {
      setHasLocationPermission(false);
      toast.error("❌ Failed to check location permission.");
    });
}, []);


  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const updatePace = (duration: number, distance: number) => {
  if (distance > 0.01 && duration > 0) {
    const paceInMin = (duration / 60) / distance;
    const mins = Math.floor(paceInMin);
    const secs = Math.round((paceInMin - mins) * 60);
    setPace(`${mins}:${secs < 10 ? "0" + secs : secs}`);
  } else {
    setPace("0:00");
  }
};


useEffect(() => {
  if (isTracking && !isPaused) {
    intervalRef.current = setInterval(() => {
      setDuration((prevDuration) => {
        const updated = prevDuration + 1;
        updatePace(updated, distance); // ✅ only this call
       
        return updated;
      });
    }, 1000);
  }

  return () => {
    clearInterval(intervalRef.current!);
  };
}, [isTracking, isPaused, distance]);




  const resetForm = () => {
    setType("Run");
    setDistance(0);
    setDuration(0);
    setDate("");
    setNotes("");
    setPace("0:00");
    setRoute([]);
    setSteps(0);
    setCalories(0);
    setStartTime(null);
    setIsPaused(false);
    setIsTracking(false);
    setIsSubmitting(false);
    elapsedBeforePause.current = 0;
    lastCoords.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    let watchId: number;
    const MIN_DISTANCE_THRESHOLD_KM = 0.005;
    const STEP_CONVERSION = 1312.3;
    const CALORIES_PER_KM = 60;

    if (isTracking && !isPaused && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          if (accuracy > 50) return;

          if (!lastCoords.current) {
            lastCoords.current = [latitude, longitude];
            setRoute((prev) => [...prev, [latitude, longitude]]);
            return;
          }

          const dist = getDistanceFromLatLonInKm(
            lastCoords.current[0],
            lastCoords.current[1],
            latitude,
            longitude
          );

          if (dist < MIN_DISTANCE_THRESHOLD_KM) return;

          setDistance((prev) => {
          const newDistance = parseFloat((prev + dist).toFixed(4));
          return newDistance;
          });

          setSteps((prev) => prev + Math.floor(dist * STEP_CONVERSION));
          setCalories?.((prev) => Math.floor(prev + dist * CALORIES_PER_KM));

          setRoute((prev) => [...prev, [latitude, longitude]]);
          lastCoords.current = [latitude, longitude];
        },
       (err) => {
  console.error("WatchPosition error:", err);
  if (err.code === 1) {
    toast.error("❌ GPS permission denied.");
    setHasLocationPermission(false);
  } else if (err.code === 2) {
    toast.error("📡 Lost GPS signal.");
  } else if (err.code === 3) {
    toast.error("⌛ GPS timeout.");
  } else {
    toast.error("⚠️ GPS error occurred.");
  }
},

        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, isPaused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     console.log("handleSubmit triggered");
      setIsTracking(false);
  setIsPaused(false);

  console.log("✅ Step 1: before validity check");
    if (!isFormValid || isSubmitting) 
      return;
    setIsSubmitting(true);
    
    if (distance === 0 || duration === 0 || steps === 0 || route.length === 0) {
    toast.error("❌ Invalid activity. Please move around and try again.");
    return;
  }
    const activityData = {
      type,
      distance,
      duration,
      date,
      notes,
      pace,
      steps,
      calories,
      route,
    };
    console.log("📦 Data being sent:", activityData); 
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

      const result = await res.json();
      console.log("API response:", result); 
      if (!res.ok) {
        toast.error("Failed to save activity: " + (result.error || ""));
        setIsSubmitting(false);
        return;
      }

      resetForm();
      toast.success("✅ Activity added successfully!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while saving.");
    }
  };

  return (
    <div className={clsx(
      isModal ? "" : "min-h-screen p-6 flex items-center justify-center",
      "bg-gradient-to-br from-black via-[#0b0b0f] to-[#1c0d21] text-white"
    )}>
      <div className={clsx(
        "w-full p-6",
        isModal ? "bg-white/5 backdrop-blur-xl shadow-xl" : "bg-white text-black"
      )}>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <Label className="text-white font-medium">Activity Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-white/10 border border-white/20 text-white">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] text-white">
                <SelectItem value="Run">Run</SelectItem>
                <SelectItem value="Walk">Walk</SelectItem>
                <SelectItem value="Ride">Ride</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white font-medium">Distance (km)</Label>
              <Input readOnly value={distance.toFixed(2)} className="bg-white/10 border text-white" />
            </div>
            <div>
              <Label className="text-white font-medium">Duration (min)</Label>
              <Input readOnly value={(duration / 60).toFixed(1)} className="bg-white/10 border text-white" />
            </div>
          </div>

          <div>
            <Label className="text-white font-medium">Date</Label>
            <input
              type="text"
              readOnly
              value={date ? new Date(date).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              }) : ""}
              className="bg-white/10 border text-white w-full px-3 py-2 rounded"
            />
          </div>

          <div>
            <Label className="text-white font-medium">Optional Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-white/10 border text-white" />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <Label className="text-sm text-gray-300">Pace</Label>
              <p className="text-cyan-300 font-semibold text-lg">{pace}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-300">Steps</Label>
              <p className="text-cyan-300 font-semibold text-lg">{steps}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-300">Calories</Label>
              <p className="text-cyan-300 font-semibold text-lg">{calories}</p>
            </div>
          </div>

          <div>
            <Label className="text-white font-medium">Live Route</Label>
            <div className="rounded-xl overflow-hidden border bg-white/5 backdrop-blur">
              <LiveMapTracker tracking={isTracking} route={route} setRoute={setRoute} />
            </div>
            {route.length > 0 && (
              <p className="mt-2 text-sm text-green-300">
                ✅ Route captured with {route.length} points
              </p>
            )}
          </div>

         <div className="flex flex-wrap gap-3 w-full mt-4">
 {!isTracking ? (
  <div className="space-y-2">
    <Button
      type="button"
      className="flex-1 min-w-[120px] h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
      disabled={hasLocationPermission === false}
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setRoute([[latitude, longitude]]);
            setIsTracking(true);
            setStartTime(new Date());
            setDate(new Date().toISOString());
            toast.success("📍 Started tracking!");
          },
          (err) => {
  console.error("Location error:", err);
  if (err.code === 1) {
    toast.error("❌ Location access denied by user.");
    setHasLocationPermission(false);
  } else if (err.code === 2) {
    toast.error("📡 Location unavailable. Please enable GPS.");
  } else if (err.code === 3) {
    toast.error("⌛ Location request timed out.");
  } else {
    toast.error("⚠️ Unknown location error.");
  }
}

        );
      }}
    >
      Start
    </Button>

    {hasLocationPermission === false && (
      <p className="text-red-500 text-sm">
        ❌ Location permission denied. Please enable GPS to use tracking.
      </p>
    )}
  </div>
) : (
  <>
    <div className="space-y-2">
      <Button
        type="button"
        className="flex-1 min-w-[120px] h-11 rounded-xl bg-yellow-500 text-white"
        disabled={hasLocationPermission === false}
        onClick={() => {
          if (!isPaused) {
            elapsedBeforePause.current = duration;
            setIsPaused(true);
            toast.info("⏸️ Tracking paused");
          } else {
            setStartTime(new Date());
            setIsPaused(false);
            toast.success("▶️ Tracking resumed");
          }
        }}
      >
        {isPaused ? "Resume" : "Pause"}
      </Button>

      {hasLocationPermission === false && (
        <p className="text-red-500 text-sm">
          ❌ Location permission denied. Please enable GPS to use tracking.
        </p>
      )}
    </div>

    <Button
      type="submit"
      className="flex-1 min-w-[120px] h-11 rounded-xl bg-red-500 text-white"
      disabled={hasLocationPermission === false}
    >
      Stop & Save
    </Button>
  </>
)}

<Button
  type="button"
  className="flex-1 min-w-[120px] h-11 rounded-xl bg-white/10 text-white border border-white/20"
  onClick={resetForm}
>
  Reset
</Button>

</div>

        </form>
      </div>
    </div>
  );
}
