// components/MapView.tsx
"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

type LatLng = [number, number];

type Activity = {
  _id: string;
  type: string;
  route: LatLng[];
};

type Props = {
  activities: Activity[];
};

export default function MapView({ activities }: Props) {
  useEffect(() => {
    console.log("🟢 Activities to plot:", activities);
    activities.forEach((act) =>
      console.log(`🔹 ${act.type} route:`, act.route)
    );
  }, [activities]);

  return (
    <MapContainer
      center={[28.6139, 77.2090]} // Default: New Delhi
      zoom={12}
      scrollWheelZoom={true}
      className="h-[600px] w-full rounded-lg shadow"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {activities
        .filter((act) => act.route && act.route.length >= 2)
        .map((act) => (
          <Polyline
            key={act._id}
            positions={act.route.map((point) => [point[0], point[1]])}
            color={
              act.type === "Run"
                ? "blue"
                : act.type === "Walk"
                ? "green"
                : "orange"
            }
          />
        ))}
    </MapContainer>
  );
}
