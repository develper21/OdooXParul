"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Search, MapPin, Calendar, Users, ArrowRight, Plane, Compass, Sparkles, Shield } from "lucide-react";

const IMGS = {
  paris: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  morocco: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
  iceland: "https://images.unsplash.com/photo-1520695000570-8b654dc318ce?w=800&q=80",
  nz: "https://images.unsplash.com/photo-1469521669194-babbdf9aa981?w=800&q=80",
  header: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80",
  cta: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80",
};

const allTrips = [
  { id: 1, name: "European Summer", cities: ["Paris", "Amsterdam", "Berlin"], startDate: "Jun 15, 2026", endDate: "Jul 5, 2026", days: 21, travelers: 4, budget: "₹5,200", status: "planning", img: IMGS.paris, progress: 65 },
  { id: 2, name: "Asia Exploration", cities: ["Bangkok", "Bali", "Tokyo"], startDate: "Aug 1, 2026", endDate: "Aug 25, 2026", days: 25, travelers: 2, budget: "₹4,800", status: "ongoing", img: IMGS.tokyo, progress: 80 },
  { id: 3, name: "Bali Paradise", cities: ["Ubud", "Seminyak"], startDate: "Jul 10, 2026", endDate: "Jul 17, 2026", days: 7, travelers: 6, budget: "₹3,600", status: "planning", img: IMGS.bali, progress: 30 },
  { id: 4, name: "Morocco Discovery", cities: ["Marrakech", "Fes", "Chefchaouen"], startDate: "Mar 1, 2026", endDate: "Mar 12, 2026", days: 11, travelers: 2, budget: "₹2,200", status: "completed", img: IMGS.morocco, progress: 100 },
  { id: 5, name: "Iceland Aurora Hunt", cities: ["Reykjavik", "Akureyri"], startDate: "Dec 20, 2026", endDate: "Dec 30, 2026", days: 10, travelers: 3, budget: "₹4,100", status: "planning", img: IMGS.iceland, progress: 10 },
  { id: 6, name: "New Zealand Road Trip", cities: ["Auckland", "Queenstown"], startDate: "Sep 5, 2026", endDate: "Sep 22, 2026", days: 17, travelers: 2, budget: "₹5,800", status: "ongoing", img: IMGS.nz, progress: 55 },
];

export default function MyTripsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = allTrips.filter(t =>
    (filter === "all" || t.status === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.cities.join().toLowerCase().includes(search.toLowerCase()))
  );

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">

      {/* ── CINEMATIC HEADER ── */}
      <motion.div variants={item} className="relative w-full h-[280px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
        <img src={IMGS.header} alt="My Journeys" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent mix-blend-multiply" />
        
        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-xs font-semibold uppercase tracking-[0.2em]">Travel Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              My Journeys
            </h1>
            <p className="text-white/60 font-light text-sm leading-relaxed max-w-md tracking-wide">
              Your personal archive of {allTrips.length} extraordinary adventures. Revisit past memories or continue designing your upcoming escapes.
            </p>
          </div>
          
          <Link href="/trips/create">
            <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.95 }} 
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-black rounded-xl font-medium shrink-0 transition-all shadow-xl hover:bg-gray-100">
              <Plus className="w-4 h-4" /> Plan New Trip
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* ── SEARCH + FILTERS ── */}
      <motion.div variants={item} className="flex flex-col lg:flex-row items-center gap-4 justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations, trips..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/40 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none font-light text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap w-full lg:w-auto">
          {[
            { key: "all", label: "All Trips" },
            { key: "planning", label: "Planning" },
            { key: "ongoing", label: "Ongoing" },
            { key: "completed", label: "Completed" },
          ].map(tab => (
            <motion.button key={tab.key} whileHover={{ scale: 1.05 }} onClick={() => setFilter(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === tab.key ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] border border-purple-500/30' : 'bg-white/[0.03] border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.05]'}`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── TRIPS GRID ── */}
      <AnimatePresence mode="wait">
        <motion.div key={filter + search} variants={container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((trip, i) => (
            <motion.div key={trip.id} variants={item} whileHover={{ y: -8 }} className="group relative">
              <Link href={`/trips/${trip.id}`} className="block h-full">
                <div className="h-full flex flex-col rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-lg hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/10">
                  
                  {/* Cinematic Image Banner */}
                  <div className="relative h-60 overflow-hidden shrink-0 bg-[#050810]">
                    <img src={trip.img} alt={trip.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/30 to-transparent" />
                    
                    <div className="absolute top-5 right-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-xl`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors drop-shadow-lg tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                        {trip.name}
                      </h3>
                      <p className="text-white/70 text-sm flex items-center gap-2 mt-2 font-light tracking-wide drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" /> {trip.cities.join(" — ")}
                      </p>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-xs text-white/50 font-light tracking-wide">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/30" />{trip.startDate} - {trip.endDate}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-white/30" />{trip.travelers} guests</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs text-white/40 tracking-widest uppercase font-medium">Progress</span>
                          <span className="text-xs font-semibold text-purple-400">{trip.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]" initial={{ width: 0 }} animate={{ width: `${trip.progress}%` }} transition={{ duration: 1, delay: 0.3 }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1 font-semibold">Est. Budget</span>
                        <span className="text-lg font-bold text-white tracking-wide">{trip.budget}</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 transition-colors">
                        <ArrowRight className="w-4 h-4 text-purple-300" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white/[0.01] rounded-[2rem] border border-white/5">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.03] flex items-center justify-center mb-6 border border-white/10">
            <Plane className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>No journeys found</h3>
          <p className="text-white/40 mb-8 font-light tracking-wide">Try adjusting your filters or search terms.</p>
          <Link href="/trips/create">
            <button className="px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Plan a New Trip
            </button>
          </Link>
        </motion.div>
      )}

      {/* ── BOTTOM CINEMATIC CTA ── */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-16 shadow-2xl mt-12" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <img src={IMGS.cta} alt="CTA Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c16]/90 via-[#080c16]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent mix-blend-multiply" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-xs font-semibold uppercase tracking-widest">Next Adventure</span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
              Where to next?
            </h3>
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
              Explore our curated destinations or use our intelligent planner to design a completely unique itinerary tailored to your travel style.
            </p>
          </div>
          <Link href="/trips/create" className="shrink-0">
            <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(249,115,22,0.4)" }} whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-orange-500 to-pink-600 transition-all text-base shadow-[0_10px_30px_rgba(249,115,22,0.3)] border border-orange-500/30 flex items-center gap-2">
              Discover Destinations <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}
