"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Route = {
  id: number;
  name: string;
  type: string;
  date: string;
  position: [number, number];
};

export default function MapDisplay({ routes }: { routes: Route[] }) {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {routes.map((route) => (
        <Marker key={route.id} position={route.position}>
          <Popup>
            <strong>{route.name}</strong><br />
            {route.type} | {route.date}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
