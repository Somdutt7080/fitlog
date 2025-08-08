// components/LiveMapTracker.tsx
"use client";

import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, {
        duration: 1.5, // 👈 smooth zoom transition
      });
    }
  }, [center, map]);

  return null;
}

export default function LiveMapTracker({
  tracking,
  route,
  setRoute,
}: {
  tracking: boolean;
  route: [number, number][];
  setRoute: React.Dispatch<React.SetStateAction<[number, number][]>>;
}) {
  const [position, setPosition] = useState<[number, number]>([28.6139, 77.2090]); // default to Delhi
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const latlng: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];

          // Update position for map center
          setPosition(latlng);

          // Update route with new location
          setRoute((prev) => [...prev, latlng]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [tracking, setRoute]);

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden">
      <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <ChangeView center={position} />
        {route.length > 1 && <Polyline positions={route} color="#e00126" weight={6} />}
      </MapContainer>
    </div>
  );
}
