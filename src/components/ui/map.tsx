"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

interface MapDrawerProps {
  onRouteDrawn?: (coords: [number, number][]) => void;
}

function MapLogic({ onRouteDrawn }: MapDrawerProps) {
  const map = useMap();
  const drawnItems = useRef(new L.FeatureGroup()).current;

  useEffect(() => {
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        circle: false,
        rectangle: false,
        circlemarker: false,
        marker: false,
        polyline: {
          shapeOptions: {
            color: "#e00126ff",
            weight: 9,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;

      // Clear previous layers (only one route allowed)
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      // ✅ FIXED: For polylines, getLatLngs() returns a flat array
      const latlngs: [number, number][] = layer
        .getLatLngs()
        .map((point: L.LatLng) => [point.lat, point.lng]);

      console.log("✅ Route drawn:", latlngs);
      onRouteDrawn?.(latlngs);
    });

    return () => {
      map.off();
      map.removeControl(drawControl);
    };
  }, [map, onRouteDrawn]);

  return null;
}

export default function MapDrawer({ onRouteDrawn }: MapDrawerProps) {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden">
      <MapContainer
        center={[28.6139, 77.209]} // Default to New Delhi
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapLogic onRouteDrawn={onRouteDrawn} />
      </MapContainer>

      {/* Optional helper text for user */}
      <p className="text-xs text-gray-500 mt-2">
        ✍️ Click on the map to draw your route. Double-click or press <kbd>Esc</kbd> to finish.
      </p>
    </div>
  );
}
