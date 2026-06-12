"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TripMapPoint } from "@/lib/types";
import { Trash2, Navigation } from "lucide-react";

const typeColors: Record<string, string> = {
  destination: "#9333ea",
  activity: "#2563eb",
  hotel: "#16a34a",
  restaurant: "#ea580c",
  custom: "#db2777",
};

const typeLabels: Record<string, string> = {
  destination: "Destination",
  activity: "Activity",
  hotel: "Hotel",
  restaurant: "Restaurant",
  custom: "Custom",
};

function getMarkerIcon(type: string, isSelected: boolean) {
  const color = typeColors[type] || "#6b7280";
  const size = isSelected ? 22 : 16;
  const anchor = isSelected ? 11 : 8;
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 2px 10px rgba(0,0,0,0.5);
      transition:all 0.3s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
}

function MapClickHandler({ active, onMapClick }: { active: boolean; onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (active) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function FlyToPoint({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      map.flyTo([lat, lng], 14, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

interface TripMapInnerProps {
  points: TripMapPoint[];
  selectedPointId: string | null;
  addMode: boolean;
  onSelectPoint: (id: string | null) => void;
  onMapClick: (lat: number, lng: number) => void;
  onDeletePoint: (id: string) => void;
}

export default function TripMapInner({
  points,
  selectedPointId,
  addMode,
  onSelectPoint,
  onMapClick,
  onDeletePoint,
}: TripMapInnerProps) {
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const sortedPoints = [...points].sort((a, b) => a.order - b.order);
  const routeCoords = sortedPoints.map((p) => [p.lat, p.lng] as L.LatLngExpression);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setMapKey((k) => k + 1);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (selectedPointId) {
      const p = points.find((pt) => pt.id === selectedPointId);
      if (p) {
        setFlyTarget({ lat: p.lat, lng: p.lng });
      }
    }
  }, [selectedPointId, points]);

  const defaultCenter: L.LatLngExpression = sortedPoints.length > 0
    ? [sortedPoints[0].lat, sortedPoints[0].lng]
    : [20, 0];

  if (!mounted) {
    return (
      <div className="w-full h-full rounded-2xl border border-white/10 bg-[#0a0f1c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
      {addMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg pointer-events-none">
          Click on the map to add a new point
        </div>
      )}
      <MapContainer
        key={mapKey}
        center={defaultCenter}
        zoom={sortedPoints.length > 0 ? 5 : 2}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler active={addMode} onMapClick={onMapClick} />
        {flyTarget && <FlyToPoint lat={flyTarget.lat} lng={flyTarget.lng} />}

        {sortedPoints.map((point) => {
          const isSelected = point.id === selectedPointId;
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={getMarkerIcon(point.type, isSelected)}
              eventHandlers={{
                click: () => onSelectPoint(point.id),
              }}
            >
              <Popup className="dark-popup">
                <div className="min-w-[200px] p-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: typeColors[point.type] || "#6b7280" }}
                    />
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      {typeLabels[point.type] || "Point"}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-base mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                    {point.name}
                  </h4>
                  {point.description && (
                    <p className="text-white/60 text-sm mb-2">{point.description}</p>
                  )}
                  {point.day && (
                    <p className="text-purple-300 text-xs font-medium mb-2">Day {point.day}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <Navigation className="w-3 h-3" />
                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                  </div>
                  <button
                    onClick={() => onDeletePoint(point.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-xs"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: "#9333ea",
              weight: 3,
              opacity: 0.6,
              dashArray: "8, 8",
              lineCap: "round",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
