"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Plus,
  X,
  Trash2,
  Search,
  ArrowRightLeft,
  Globe,
  RefreshCw,
  Check,
  Layers,
} from "lucide-react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
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

const typeLabels: Record<string, string> = {
  destination: "Destination",
  activity: "Activity",
  hotel: "Hotel",
  restaurant: "Restaurant",
  custom: "Custom",
};

export default function TripMapPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [points, setPoints] = useState<TripMapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
    type: "custom",
    day: "",
  });

  const [searchLocation, setSearchLocation] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      apiGet<{ success: boolean; data: Trip }>(`/api/trips/${tripId}`),
      apiGet<{ success: boolean; data: TripMapPoint[] }>(`/api/trips/${tripId}/map`),
    ])
      .then(([tripRes, mapRes]) => {
        if (!active) return;
        setTrip(tripRes.data || null);
        setPoints(mapRes.data || []);
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
  }, [tripId]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await apiPost<{ success: boolean; data: TripMapPoint[] }>(`/api/trips/${tripId}/map/sync`, {});
      setPoints(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setForm((f) => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    setAddMode(false);
    setShowAddForm(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        lat: Number(form.lat),
        lng: Number(form.lng),
        type: form.type,
        day: form.day ? Number(form.day) : null,
        order: points.length,
      };
      const res = await apiPost<{ success: boolean; data: TripMapPoint }>(`/api/trips/${tripId}/map`, payload);
      if (res.data) {
        setPoints((p) => [...p, res.data]);
        setShowAddForm(false);
        setForm({ name: "", description: "", lat: "", lng: "", type: "custom", day: "" });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to add point.");
    }
  };

  const handleDeletePoint = async (id: string) => {
    if (!confirm("Delete this map point?")) return;
    try {
      await apiDelete(`/api/trips/${tripId}/map/${id}`);
      setPoints((p) => p.filter((pt) => pt.id !== id));
      if (selectedPointId === id) setSelectedPointId(null);
    } catch (err: any) {
      setError(err?.message || "Failed to delete point.");
    }
  };

  const handleSearchLocation = async () => {
    if (!searchLocation.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=5`
      );
      const data = await res.json();
      setSearchResults(
        data.map((item: any) => ({
          name: item.display_name,
          lat: Number(item.lat),
          lng: Number(item.lon),
        }))
      );
    } catch (err) {
      console.error("Geocode error:", err);
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = (result: { name: string; lat: number; lng: number }) => {
    setForm((f) => ({ ...f, name: result.name.split(",")[0], lat: result.lat.toFixed(6), lng: result.lng.toFixed(6) }));
    setSearchResults([]);
    setSearchLocation("");
  };

  const filteredPoints = points.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || p.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedFiltered = [...filteredPoints].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Trip Map Unavailable</h3>
          <p className="text-white/40 mb-8">{error || "Trip not found."}</p>
          <Link href="/trips">
            <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg">
              View All Trips
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
              <Globe className="w-5 h-5 text-purple-400" /> {trip.title}
            </h1>
            <p className="text-white/40 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {trip.destination}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} /> Sync Destinations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setAddMode((m) => !m);
              setShowAddForm(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              addMode
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {addMode ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {addMode ? "Cancel" : "Add Point"}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Area */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 min-h-0">
          <TripMapInner
            points={points}
            selectedPointId={selectedPointId}
            addMode={addMode}
            onSelectPoint={setSelectedPointId}
            onMapClick={handleMapClick}
            onDeletePoint={handleDeletePoint}
          />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[340px] shrink-0 flex flex-col gap-4 overflow-hidden"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-white/40 text-xs">Stops</span>
              </div>
              <p className="text-2xl font-bold text-white">{points.length}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                <span className="text-white/40 text-xs">Route</span>
              </div>
              <p className="text-2xl font-bold text-white">{points.length > 1 ? `${points.length - 1} segments` : "—"}</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 shrink-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stops..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white text-sm placeholder-white/30 focus:border-purple-500/50 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  !activeFilter ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-white/40 border border-white/10 hover:text-white/60"
                }`}
              >
                All
              </button>
              {["destination", "activity", "hotel", "restaurant", "custom"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveFilter(activeFilter === t ? null : t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    activeFilter === t ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-white/40 border border-white/10 hover:text-white/60"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${typeColors[t]}`} />
                  {typeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Points List */}
          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="p-3 border-b border-white/5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-white/40" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Trip Stops</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sortedFiltered.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">No stops found</p>
                </div>
              ) : (
                sortedFiltered.map((point, i) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedPointId(point.id === selectedPointId ? null : point.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      point.id === selectedPointId
                        ? "bg-purple-500/10 border-purple-500/30"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${typeColors[point.type] || "bg-gray-500"}`} />
                        {i < sortedFiltered.length - 1 && (
                          <div className="w-px h-6 bg-white/10" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-white text-sm font-medium truncate">{point.name}</h4>
                          <span className="text-[10px] text-white/30 shrink-0">#{point.order + 1}</span>
                        </div>
                        <p className="text-white/40 text-xs truncate">{typeLabels[point.type] || "Point"}</p>
                        {point.day && <p className="text-purple-300/60 text-[10px] mt-0.5">Day {point.day}</p>}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePoint(point.id);
                        }}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Point Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-[#050810] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  Add Map Point
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Geocode Search */}
              <div className="mb-4">
                <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Search Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
                    placeholder="e.g. Eiffel Tower, Paris"
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm placeholder-white/20 focus:border-purple-500/50 outline-none"
                  />
                  <button
                    onClick={handleSearchLocation}
                    disabled={searching}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
                  >
                    {searching ? "..." : "Search"}
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                    {searchResults.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => selectSearchResult(r)}
                        className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Point name"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm placeholder-white/20 focus:border-purple-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Optional description"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm placeholder-white/20 focus:border-purple-500/50 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={form.lat}
                      onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm placeholder-white/20 focus:border-purple-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={form.lng}
                      onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm placeholder-white/20 focus:border-purple-500/50 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:border-purple-500/50 outline-none appearance-none cursor-pointer"
                    >
                      <option value="custom">Custom</option>
                      <option value="destination">Destination</option>
                      <option value="activity">Activity</option>
                      <option value="hotel">Hotel</option>
                      <option value="restaurant">Restaurant</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Day</label>
                    <input
                      type="number"
                      value={form.day}
                      onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                      placeholder="Optional"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm placeholder-white/20 focus:border-purple-500/50 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Add Point
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
