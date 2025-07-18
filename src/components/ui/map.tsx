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
            color: "#3b82f6",
            weight: 4,
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
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs()[0].map((p: any) => [p.lat, p.lng]);
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
        center={[28.6139, 77.209]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapLogic onRouteDrawn={onRouteDrawn} />
      </MapContainer>
    </div>
  );
}
