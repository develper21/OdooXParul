"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowRight, Globe, Plane, Compass } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Trip, TripMapPoint } from "@/lib/types";
import dynamic from "next/dynamic";

const TripMapInner = dynamic(() => import("@/components/map/TripMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl border border-white/10 bg-[#0a0f1c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

const typeColors: Record<string, string> = {
  destination: "bg-purple-500",
  activity: "bg-blue-500",
  hotel: "bg-green-500",
  restaurant: "bg-orange-500",
  custom: "bg-pink-500",
};

export default function GlobalMapPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [allPoints, setAllPoints] = useState<TripMapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    apiGet<{ success: boolean; data: Trip[] }>("/api/trips")
      .then(async (res) => {
        if (!active) return;
        const tripList = res.data || [];
        setTrips(tripList);

        // Fetch map points for all trips
        const pointArrays = await Promise.all(
          tripList.map(async (trip) => {
            try {
              const mapRes = await apiGet<{ success: boolean; data: TripMapPoint[] }>(`/api/trips/${trip.id}/map`);
              return mapRes.data || [];
            } catch {
              return [];
            }
          })
        );

        if (!active) return;
        const combined = pointArrays.flat();
        setAllPoints(combined);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load map data.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayedPoints = selectedTripId
    ? allPoints.filter((p) => p.tripId === selectedTripId)
    : allPoints;

  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
              <Globe className="w-5 h-5 text-purple-400" /> Explore Map
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Visualize all your trips and destinations around the world
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">{trips.length}</span>
              <span className="text-white/40 text-xs">trips</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-medium">{allPoints.length}</span>
              <span className="text-white/40 text-xs">stops</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 min-h-0">
          <TripMapInner
            points={displayedPoints}
            selectedPointId={null}
            addMode={false}
            onSelectPoint={() => {}}
            onMapClick={() => {}}
            onDeletePoint={() => {}}
          />
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-[340px] shrink-0 flex flex-col gap-4 overflow-hidden">
          {/* Trip Filter */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-white/40" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Your Trips</span>
            </div>
            <button
              onClick={() => setSelectedTripId(null)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all mb-1 ${
                !selectedTripId
                  ? "bg-purple-500/10 border border-purple-500/30 text-white"
                  : "bg-white/[0.02] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">All Trips</span>
                <span className="text-white/30 text-xs">{allPoints.length} stops</span>
              </div>
            </button>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {trips.map((trip) => {
                const tripPoints = allPoints.filter((p) => p.tripId === trip.id);
                const isActive = selectedTripId === trip.id;
                return (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(isActive ? null : trip.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-purple-500/10 border border-purple-500/30 text-white"
                        : "bg-white/[0.02] border border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{trip.title}</span>
                      <span className="text-white/30 text-xs shrink-0">{tripPoints.length} stops</span>
                    </div>
                    <p className="text-white/30 text-xs mt-0.5 truncate">{trip.destination}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip Detail Card */}
          {selectedTrip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-4 shrink-0"
            >
              <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedTrip.title}
              </h3>
              <p className="text-white/40 text-xs mb-3">{selectedTrip.destination}</p>
              <Link href={`/trips/${selectedTrip.id}/map`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  View Trip Map <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Legend */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 shrink-0">
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 block">Legend</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: "destination", label: "Destination" },
                { type: "activity", label: "Activity" },
                { type: "hotel", label: "Hotel" },
                { type: "restaurant", label: "Restaurant" },
                { type: "custom", label: "Custom" },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${typeColors[item.type]}`} />
                  <span className="text-white/50 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
