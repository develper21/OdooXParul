"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, MapPin, Calendar, Users, DollarSign, Plane, Sparkles, Plus, X, Map, Landmark, Utensils, Building, Mountain, Compass } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Trip } from "@/lib/types";

const popularDestinations = [
  { name: "Paris", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80" },
  { name: "Tokyo", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&q=80" },
  { name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80" },
  { name: "Santorini", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=200&q=80" },
  { name: "Maldives", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=200&q=80" },
  { name: "Iceland", img: "https://images.unsplash.com/photo-1520695000570-8b654dc318ce?w=200&q=80" }
];

const travelStyles = [
  { icon: Map, label: "Beach & Relaxation", bg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { icon: Mountain, label: "Adventure & Hiking", bg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { icon: Landmark, label: "Culture & History", bg: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=400&q=80" },
  { icon: Utensils, label: "Food & Gastronomy", bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  { icon: Sparkles, label: "Wellness & Spa", bg: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80" },
  { icon: Building, label: "City Exploration", bg: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&q=80" },
];

const stepIcons = [MapPin, Calendar, DollarSign];
const stepLabels = ["Destinations", "Dates & Travelers", "Budget & Style"];

export default function CreateTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "", travelers: "2", budget: "", currency: "USD", style: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const addCity = (city: string) => { if (city && !cities.includes(city)) { setCities(p => [...p, city]); setCityInput(""); setShowCitySuggestions(false); } };
  const removeCity = (city: string) => setCities(p => p.filter(c => c !== city));

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      return;
    }

    try {
      const res = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setCitySuggestions(data.data.slice(0, 5));
        setShowCitySuggestions(true);
      }
    } catch (err) {
      console.error("City search error:", err);
    }
  };

  const totalSteps = 3;
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  const handleCreateTrip = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: form.name,
        destination: cities.join(", ") || "Unknown",
        startDate: form.startDate || new Date().toISOString().split("T")[0],
        endDate: form.endDate || new Date().toISOString().split("T")[0],
        travelers: Number(form.travelers.replace("+", "")) || 2,
        budget: Number(form.budget) || 0,
        currency: form.currency,
        status: "planning",
        description: form.style ? `A ${form.style} trip.` : "",
        imageUrl: "",
      };
      const res = await apiPost<{ success: boolean; data: Trip }>("/api/trips", payload);
      if (res.data?.id) {
        router.push(`/trips/${res.data.id}`);
      } else {
        setError("Trip created but no ID returned.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create trip.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

      {/* ── HERO BANNER (CINEMATIC) ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] h-[280px] shadow-2xl border border-white/5">
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80" alt="Plan Trip" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-transparent mix-blend-multiply" />
        
        <div className="absolute bottom-8 left-8 right-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span className="text-purple-300 text-xs font-semibold uppercase tracking-[0.2em]">Trip Concierge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Design Your Next Escape
          </h1>
          <p className="text-white/70 font-light text-sm max-w-lg leading-relaxed">
            Let's craft the perfect luxury itinerary. Follow our cinematic guide to customize every aspect of your journey.
          </p>
        </div>
      </motion.div>

      {/* ── CINEMATIC JOURNEY TRACKER ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="relative px-4">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/[0.05] -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.7, ease: "easeInOut" }} 
            style={{ boxShadow: "0 0 20px rgba(219,39,119,0.8)" }} />
        </div>

        <div className="relative flex justify-between">
          {stepLabels.map((label, i) => {
            const Icon = stepIcons[i];
            const isCompleted = step > i + 1;
            const isActive = step === i + 1;
            return (
              <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                <motion.div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-2
                    ${isActive ? "bg-[#050810] border-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.4)]" 
                    : isCompleted ? "bg-gradient-to-br from-purple-600 to-pink-600 border-transparent text-white" 
                    : "bg-[#050810] border-white/10 text-white/20"}`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 2, ease: "easeInOut" }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-purple-400" : isCompleted ? "text-white" : "text-white/20"}`} />
                </motion.div>
                <span className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 hidden sm:block
                  ${isActive ? "text-purple-300" : isCompleted ? "text-white/80" : "text-white/20"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── FORM CONTAINER (GLASS WORKSPACE) ── */}
      <div className="relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: DESTINATIONS */}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-10">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Where will you explore?</h2>
                  <p className="text-white/50 font-light tracking-wide">Enter your dream destinations to begin mapping your journey.</p>
                </div>

                <div className="space-y-6">
                  {/* Trip Name */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 block">Journey Title</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                      <input suppressHydrationWarning type="text" value={form.name} onChange={update("name")} placeholder="e.g. European Summer Escapade"
                        className="relative w-full bg-[#050810]/50 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-white/30 focus:border-purple-500/50 transition-all outline-none font-light text-lg" />
                    </div>
                  </div>

                  {/* Destinations Input */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 block">Destinations</label>
                    <div className="flex gap-3 relative">
                      <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5 z-10" />
                        <input 
                          suppressHydrationWarning 
                          type="text" 
                          value={cityInput} 
                          onChange={e => { setCityInput(e.target.value); searchCities(e.target.value); }}
                          onKeyDown={e => e.key === "Enter" && addCity(cityInput)}
                          onFocus={() => cityInput.length >= 2 && searchCities(cityInput)}
                          placeholder="Search for a city, region, or country..." 
                          className="relative w-full bg-[#050810]/50 border border-white/10 rounded-xl py-4 pl-14 pr-5 text-white placeholder-white/30 focus:border-purple-500/50 transition-all outline-none font-light text-lg" 
                        />
                        
                        {/* City Suggestions Dropdown */}
                        {showCitySuggestions && citySuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#050810] border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                            {citySuggestions.map((city, index) => (
                              <button
                                key={city.name}
                                type="button"
                                onClick={() => { addCity(city.name); setShowCitySuggestions(false); setCityInput(""); }}
                                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3"
                              >
                                <span className="text-white font-medium">{city.name}</span>
                                <span className="text-white/50 text-sm">{city.country}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addCity(cityInput)} 
                        className="bg-white text-black px-6 rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                        <Plus className="w-6 h-6" />
                      </motion.button>
                    </div>

                    {/* Added Cities (Premium Pills) */}
                    <AnimatePresence>
                      {cities.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {cities.map((city, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-sm font-medium text-white shadow-lg bg-white/5 border border-white/10 backdrop-blur-md">
                              <MapPin className="w-3.5 h-3.5 text-purple-400" /> {city}
                              <button onClick={() => removeCity(city)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition-colors ml-1">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Popular Destinations Showcase */}
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">Curated Suggestions</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {popularDestinations.map(dest => (
                      <motion.button key={dest.name} whileHover={{ scale: 1.03, y: -2 }} onClick={() => addCity(dest.name)}
                        className="relative h-16 rounded-xl overflow-hidden group border border-white/5 shadow-md flex items-center">
                        <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/90 to-transparent" />
                        <div className="relative z-10 pl-4 flex items-center gap-2">
                          <Plus className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0" />
                          <span className="text-white font-medium tracking-wide">{dest.name}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATES & TRAVELERS */}
            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-10">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>When & Who?</h2>
                  <p className="text-white/50 font-light tracking-wide">Define your timeline and travel companions.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Departure Date */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 block">Departure</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />
                      <input suppressHydrationWarning type="date" value={form.startDate} onChange={update("startDate")} 
                        className="relative w-full bg-[#050810]/50 border border-white/10 rounded-xl py-4 pl-14 pr-5 text-white placeholder-white/30 focus:border-cyan-500/50 transition-all outline-none font-light text-lg [color-scheme:dark]" />
                    </div>
                  </div>
                  {/* Return Date */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 block">Return</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />
                      <input suppressHydrationWarning type="date" value={form.endDate} onChange={update("endDate")} 
                        className="relative w-full bg-[#050810]/50 border border-white/10 rounded-xl py-4 pl-14 pr-5 text-white placeholder-white/30 focus:border-cyan-500/50 transition-all outline-none font-light text-lg [color-scheme:dark]" />
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-4 block">Travel Party Size</label>
                  <div className="flex flex-wrap gap-4">
                    {["1", "2", "3", "4", "5", "6", "7+"].map(n => (
                      <motion.button key={n} whileHover={{ scale: 1.05, y: -2 }} onClick={() => setForm(f => ({ ...f, travelers: n }))}
                        className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 font-bold text-lg
                          ${form.travelers === n 
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] border-transparent" 
                            : "bg-[#050810]/50 border border-white/10 text-white/40 hover:text-white hover:border-white/30"}`}
                      >
                        <Users className={`w-4 h-4 ${form.travelers === n ? "text-white" : "text-white/20"}`} />
                        {n}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: BUDGET & STYLE */}
            {step === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-10">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Preferences & Style</h2>
                  <p className="text-white/50 font-light tracking-wide">Shape the luxury experience of your journey.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Budget */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 block">Estimated Budget</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5 z-10" />
                      <input suppressHydrationWarning type="number" value={form.budget} onChange={update("budget")} placeholder="15000" 
                        className="relative w-full bg-[#050810]/50 border border-white/10 rounded-xl py-4 pl-14 pr-5 text-white placeholder-white/30 focus:border-orange-500/50 transition-all outline-none font-light text-lg" />
                    </div>
                  </div>
                  {/* Currency */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3 block">Currency</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
                      <select suppressHydrationWarning value={form.currency} onChange={update("currency")} 
                        className="relative w-full bg-[#050810] border border-white/10 rounded-xl py-4 px-5 text-white focus:border-orange-500/50 transition-all outline-none font-light text-lg appearance-none cursor-pointer">
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="INR">INR - Indian Rupee</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Travel Style (Cinematic Cards) */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-4 block">Preferred Travel Experience</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {travelStyles.map(s => {
                      const isActive = form.style === s.label;
                      return (
                        <motion.button key={s.label} whileHover={{ scale: 1.03, y: -4 }} onClick={() => setForm(f => ({ ...f, style: s.label }))}
                          className={`relative h-28 rounded-2xl overflow-hidden group flex flex-col items-start justify-end p-4 transition-all duration-300 border
                            ${isActive ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" : "border-white/5 hover:border-white/20 shadow-lg"}`}>
                          <img src={s.bg} alt={s.label} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isActive ? "opacity-60" : "opacity-30 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-50"}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />
                          <div className="relative z-10 flex flex-col items-start gap-2">
                            <s.icon className={`w-5 h-5 ${isActive ? "text-orange-400" : "text-white/50 group-hover:text-white"}`} />
                            <span className={`text-sm font-medium tracking-wide text-left ${isActive ? "text-white drop-shadow-md" : "text-white/60 group-hover:text-white"}`}>{s.label}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Cinematic Callout */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="relative rounded-2xl p-6 overflow-hidden border border-purple-500/30 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-indigo-900/40" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative z-10 flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                      <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold tracking-wide mb-1 flex items-center gap-2">
                        AI Concierge Magic
                      </h4>
                      <p className="text-white/60 text-sm font-light leading-relaxed">
                        Once you finalize these details, our AI engine will generate a stunning, comprehensive day-by-day itinerary complete with luxury recommendations, dining reservations, and curated experiences perfectly matching your style.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 bg-red-500/[0.03] rounded-2xl border border-red-500/10">
          <p className="text-red-300 text-sm">{error}</p>
        </motion.div>
      )}

      {/* ── NAVIGATION BUTTONS ── */}
      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <motion.button whileHover={{ scale: 1.05, x: -4 }} onClick={() => setStep(s => s - 1)} 
            className="px-6 py-3.5 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 font-medium tracking-wide">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </motion.button>
        ) : (
          <Link href="/trips">
            <motion.button whileHover={{ scale: 1.05 }} 
              className="px-6 py-3.5 rounded-xl text-white/40 hover:text-white/80 transition-all font-medium tracking-wide">
              Cancel
            </motion.button>
          </Link>
        )}

        {step < totalSteps ? (
          <motion.button whileHover={{ scale: 1.05, x: 4, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }} whileTap={{ scale: 0.95 }} onClick={() => setStep(s => s + 1)}
            className="px-8 py-3.5 rounded-xl bg-white text-black font-semibold tracking-wide transition-all flex items-center gap-2 shadow-xl hover:bg-gray-100">
            Continue Journey <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.95 }} onClick={handleCreateTrip} disabled={submitting}
            className="px-8 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(124,58,237,0.3)] bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-500/30 disabled:opacity-50">
            <Sparkles className="w-4 h-4" /> {submitting ? "Creating..." : "Generate Itinerary"}
          </motion.button>
        )}
      </div>

    </div>
  );
}
