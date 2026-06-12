"use client";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Plus, ChevronDown, Clock, ArrowLeft, Plane, Camera, UtensilsCrossed, Hotel, Train, Star, Edit2, Shield, Navigation, Map, Sparkles, Landmark, Info } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Trip, Activity } from "@/lib/types";

const IMGS = {
  header: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
  paris: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
};

const ACTIVITY_META: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  "Transportation": { icon: Plane, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  "Activities": { icon: Star, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
  "Sightseeing": { icon: Camera, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30" },
  "Food": { icon: UtensilsCrossed, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30" },
  "Hotel": { icon: Hotel, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
  "General": { icon: MapPin, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
};

function getActivityMeta(category: string) {
  return ACTIVITY_META[category] || ACTIVITY_META["General"];
}

function groupActivitiesByDate(activities: Activity[]) {
  const map: Record<string, Activity[]> = {};
  activities.forEach((act) => {
    const d = act.date || "Unknown";
    if (!map[d]) map[d] = [];
    map[d].push(act);
  });
  return Object.entries(map)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, acts], idx) => ({
      day: idx + 1,
      date,
      activities: acts.sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    }));
}

export default function ItineraryPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<number[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      apiGet<{ success: boolean; data: Trip }>(`/api/trips/${tripId}`),
      apiGet<{ success: boolean; data: Activity[] }>(`/api/trips/${tripId}/activities`),
    ])
      .then(([tripRes, actRes]) => {
        if (!active) return;
        setTrip(tripRes.data || null);
        setActivities(actRes.data || []);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load itinerary.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => { active = false; };
  }, [tripId]);

  const days = groupActivitiesByDate(activities);
  const tripDays = trip ? Math.max(1, Math.round((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const toggleDay = (day: number) => setExpandedDays((p) => (p.includes(day) ? p.filter((d) => d !== day) : [...p, day]));

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !activities.length) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-300 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white text-sm transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-12 pb-24">

      {/* ── CINEMATIC HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
        <Link href={`/trips/${tripId}`}>
          <motion.button whileHover={{ x: -4 }} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors mb-2 font-medium tracking-wide">
            <ArrowLeft className="w-4 h-4" /> Back to Journey Overview
          </motion.button>
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] h-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
          <img src={IMGS.header} alt="Itinerary" className="absolute inset-0 w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent mix-blend-multiply" />

          <motion.div animate={{ x: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute right-12 top-10 opacity-10">
            <Plane className="w-32 h-32 text-white" />
          </motion.div>

          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-purple-300 text-xs font-semibold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Luxury Travel Timeline
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Your Itinerary</h1>
              <p className="text-white/70 mt-3 font-light tracking-wide flex items-center gap-3">
                <span>{trip?.title || "Trip"}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{tripDays} Days</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{trip?.travelers || 0} Travelers</span>
              </p>
            </div>

            <div className="flex gap-4">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm font-medium tracking-wide">Fully Protected</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CINEMATIC VERTICAL TIMELINE ── */}
      <motion.div variants={container} initial="hidden" animate="visible" className="relative space-y-12 pt-6">
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[2px] rounded-full overflow-hidden bg-white/5">
          <motion.div className="w-full bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 shadow-[0_0_15px_rgba(219,39,119,0.8)]"
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} />
        </div>

        {days.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm">No activities planned yet. Start building your itinerary!</p>
          </div>
        )}

        {days.map((dayData) => {
          const isExpanded = expandedDays.includes(dayData.day);
          return (
            <motion.div key={dayData.day} variants={item} className="relative pl-24 md:pl-32">

              <div className="absolute left-0 md:left-4 top-4 w-16 md:w-20">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#050810] border-2 border-purple-500/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] flex flex-col items-center justify-center text-white z-10 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-[10px] md:text-xs font-semibold text-purple-300 tracking-widest uppercase mb-0.5">Day</span>
                    <span className="text-lg md:text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{dayData.day}</span>
                  </div>
                  <span className="text-xs text-white/40 font-medium tracking-wide mt-1">{dayData.date}</span>
                </div>
              </div>

              <div className="rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-xl transition-all duration-500 group">
                <button onClick={() => toggleDay(dayData.day)} className="w-full relative h-32 md:h-40 text-left overflow-hidden block">
                  <img src={IMGS.header} alt="Day" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/80 to-transparent" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest">{trip?.destination?.split(",")[0]?.trim() || "Location"}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>Day {dayData.day}</h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end text-right">
                          <span className="text-xs text-white/50 tracking-wide font-medium uppercase">Activities</span>
                          <span className="text-white font-semibold">{dayData.activities.length} planned</span>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.4 }}
                          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                      <div className="p-6 pt-2 space-y-4 bg-[#050810]/40 backdrop-blur-md">
                        {dayData.activities.map((act: any, i: number) => {
                          const meta = getActivityMeta(act.category);
                          const Icon = meta.icon;
                          return (
                            <motion.div key={act.id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                              className="group/act relative p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:items-center cursor-pointer overflow-hidden shadow-sm hover:shadow-lg">

                              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover/act:opacity-100 transition-opacity duration-300" />

                              <div className="sm:w-24 shrink-0 flex flex-col gap-1 relative z-10">
                                <span className="text-sm font-semibold text-white tracking-wide">{act.time || "TBD"}</span>
                                <span className="text-[10px] text-white/40 tracking-widest uppercase flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration ? `${act.duration}h` : "TBD"}</span>
                              </div>

                              <div className={`w-12 h-12 rounded-xl ${meta.bg} ${meta.border} border flex items-center justify-center shrink-0 relative z-10 transition-transform duration-300 group-hover/act:scale-110 shadow-inner`}>
                                <Icon className={`w-5 h-5 ${meta.color}`} />
                              </div>

                              <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-base font-medium tracking-wide text-white">{act.title}</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                  <p className="text-xs font-light text-white/50">{act.notes || act.location || act.category}</p>
                                </div>
                              </div>

                              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/act:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                                <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}

                        <motion.button whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                          className="w-full mt-2 py-4 rounded-2xl text-sm font-medium tracking-wide text-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
                          style={{ border: "1px dashed rgba(255,255,255,0.15)" }}>
                          <Plus className="w-4 h-4" /> Add Experience to Day {dayData.day}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(124,58,237,0.15)] border border-purple-500/20 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-indigo-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-[0_0_30px_rgba(124,58,237,0.4)] shrink-0">
              <div className="w-full h-full bg-[#050810] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>AI Concierge Recommendations</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed max-w-xl">
                Enhance your itinerary. Our intelligent engine has analyzed your route and can suggest hidden local gems, optimal transit schedules, and exclusive reservations to elevate your journey.
              </p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(124,58,237,0.4)" }} whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 transition-all shadow-lg border border-purple-500/30 shrink-0">
            Optimize Timeline
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
}
