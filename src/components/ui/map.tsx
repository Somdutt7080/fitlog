"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapUploader() {
  return (
    <div className="h-64 w-full rounded-md overflow-hidden">
      <MapContainer center={[28.6139, 77.209]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[28.6139, 77.209]}>
          <Popup>Your activity starts here!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
