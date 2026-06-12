"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Users, Calendar, TrendingUp, Plus, Compass, ArrowRight, Plane, Globe, DollarSign, Clock, Map, Star, Shield } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Trip } from "@/lib/types";

const IMGS = {
  header: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80",
  paris: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  cta: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
};

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

const getDestinationCount = (trips: Trip[]) => new Set(trips.flatMap((trip) => trip.destination.split(",").map((city) => city.trim()))).size;

const getDaysPlanned = (trips: Trip[]) => trips.reduce((sum, trip) => {
  const start = new Date(trip.startDate).getTime();
  const end = new Date(trip.endDate).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return sum;
  return sum + Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}, 0);

const getTripProgress = (trip: Trip) => {
  const start = new Date(trip.startDate).getTime();
  const end = new Date(trip.endDate).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) {
    return trip.status === "completed" ? 100 : trip.status === "ongoing" ? 60 : 25;
  }
  const now = Date.now();
  if (now <= start) return 10;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
};

const trending = [
  { name: "Maldives", type: "Luxury Resort", rating: "4.9", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" },
  { name: "Santorini", type: "Culture & Views", rating: "4.8", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
  { name: "Swiss Alps", type: "Adventure", rating: "4.9", img: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=400&q=80" },
];

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<{ tempC: number; tempF: number; condition: string; icon: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    apiGet<{ success: boolean; data: Trip[] }>("/api/trips")
      .then((res) => {
        if (!active) return;
        setTrips(res.data || []);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load dashboard data.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Fetch location and weather data
  useEffect(() => {
    let active = true;
    setLocationLoading(true);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!active) return;
          const { latitude, longitude } = position.coords;

          // Get location name using reverse geocoding
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            
            if (!geoRes.ok) {
              throw new Error(`Geocoding API failed: ${geoRes.status}`);
            }
            
            const geoData = await geoRes.json();
            const locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || geoData.address?.state || "Unknown Location";

            if (active) {
              setLocation({ name: locationName, lat: latitude, lon: longitude });

              // Get weather data using Open-Meteo
              try {
                const weatherRes = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
                );
                
                if (!weatherRes.ok) {
                  throw new Error(`Weather API failed: ${weatherRes.status}`);
                }
                
                const weatherData = await weatherRes.json();
                
                if (active && weatherData.current) {
                  const tempCelsius = Math.round(weatherData.current.temperature_2m);
                  const tempFahrenheit = Math.round((tempCelsius * 9/5) + 32);
                  const weatherCode = weatherData.current.weather_code;
                  const condition = getWeatherCondition(weatherCode);
                  const icon = getWeatherIcon(weatherCode);
                  
                  setWeather({ tempC: tempCelsius, tempF: tempFahrenheit, condition, icon });
                }
              } catch (weatherErr) {
                // Set default weather if weather API fails
                if (active) {
                  setWeather({ tempC: 22, tempF: 72, condition: "Clear sky", icon: "☀" });
                }
              }
            }
          } catch (err) {
            if (active) {
              setLocation({ name: "Your Location", lat: latitude, lon: longitude });
              setWeather({ tempC: 22, tempF: 72, condition: "Clear sky", icon: "☀" });
            }
          } finally {
            if (active) setLocationLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          if (active) {
            setLocationLoading(false);
            setLocation(null);
            // Set default weather as fallback
            setWeather({ tempC: 22, tempF: 72, condition: "Clear sky", icon: "☀" });
          }
        }
      );
    } else {
      setLocationLoading(false);
      // Set default data as fallback
      setLocation({ name: "Location unavailable", lat: 0, lon: 0 });
      setWeather({ tempC: 22, tempF: 72, condition: "Clear sky", icon: "☀" });
    }

    return () => {
      active = false;
    };
  }, []);

  // Helper function to get weather condition from WMO code
  const getWeatherCondition = (code: number): string => {
    const conditions: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Depositing rime fog",
      51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
      61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
      80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
      95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail"
    };
    return conditions[code] || "Unknown";
  };

  // Helper function to get weather icon emoji
  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "☀";
    if (code >= 1 && code <= 3) return "⛅";
    if (code >= 45 && code <= 48) return "🌫";
    if (code >= 51 && code <= 55) return "🌧";
    if (code >= 61 && code <= 65) return "🌧";
    if (code >= 71 && code <= 75) return "❄";
    if (code >= 80 && code <= 82) return "🌧";
    if (code >= 95) return "⛈";
    return "☀";
  };

  const activeTrips = useMemo(() => trips.filter((trip) => trip.status !== "completed").length, [trips]);
  const destinations = useMemo(() => getDestinationCount(trips), [trips]);
  const daysPlanned = useMemo(() => getDaysPlanned(trips), [trips]);
  const totalBudget = useMemo(() => trips.reduce((sum, trip) => sum + (trip.budget || 0), 0), [trips]);

  const stats = [
    { icon: Plane, label: "Active Trips", value: loading ? "..." : activeTrips.toString(), sub: "+1 this month", bg: IMGS.paris, tint: "rgba(124,58,237,0.4)" },
    { icon: Globe, label: "Destinations", value: loading ? "..." : destinations.toString(), sub: "Distinct locations", bg: IMGS.tokyo, tint: "rgba(6,182,212,0.4)" },
    { icon: Calendar, label: "Days Planned", value: loading ? "..." : daysPlanned.toString(), sub: "Across all trips", bg: IMGS.bali, tint: "rgba(219,39,119,0.4)" },
    { icon: DollarSign, label: "Total Budget", value: loading ? "..." : formatCurrency(totalBudget), sub: "Planned spend", bg: IMGS.header, tint: "rgba(249,115,22,0.4)" },
  ];

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">

      {/* ── HEADER (CINEMATIC) ── */}
      <motion.div variants={item} className="relative w-full h-[280px] rounded-[2rem] overflow-hidden shadow-2xl">
        <img src={IMGS.header} alt="Dashboard Header" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent mix-blend-multiply" />
        
        {/* Weather Widget / Top Right Info */}
        <div className="absolute top-6 right-6 hidden md:flex items-center gap-4">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
            <MapPin className="w-4 h-4 text-white/70" />
            <span className="text-white text-sm font-medium tracking-wide">
              {locationLoading ? "Locating..." : location ? `Current Location: ${location.name}` : "Location unavailable"}
            </span>
          </div>
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
            <span className="text-yellow-400">{weather ? weather.icon : "☀"}</span>
            <span className="text-white text-sm font-medium">
              {locationLoading ? "..." : weather ? `${weather.tempC}°C/${weather.tempF}°F` : "--"}
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-purple-300 text-xs font-medium uppercase tracking-[0.2em]">Travel Workspace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Welcome back, <span className="italic text-purple-300">Explorer</span>
            </h1>
            <p className="text-white/60 font-light max-w-xl text-sm leading-relaxed">
              Your next extraordinary journey is just around the corner. You have {loading ? "..." : trips.length} upcoming trips and {loading ? "..." : daysPlanned} days of adventures planned.
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

      {/* ── STATS CARDS ── */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }} 
            className="relative h-[160px] rounded-2xl overflow-hidden group cursor-default shadow-lg border border-white/5">
            <img src={s.bg} alt={s.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/80 to-transparent" />
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(to top, ${s.tint}, transparent)` }} />
            
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <s.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-white/30 group-hover:text-white/80 transition-colors" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{s.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs font-medium text-white/50 tracking-wide uppercase">{s.label}</p>
                  <p className="text-[10px] text-white/30">{s.sub}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── MAIN GRID ── */}
      <motion.div variants={item} className="grid lg:grid-cols-12 gap-8">

        {/* UPCOMING TRIPS (Left: 8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
              <Compass className="w-5 h-5 text-purple-400" /> Itinerary Previews
            </h2>
            <Link href="/trips">
              <motion.span whileHover={{ x: 4 }} className="text-white/40 hover:text-white text-sm flex items-center gap-1 cursor-pointer transition-colors font-light">
                View Collection <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </div>

          {trips.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={`/trips/${trip.id}`}>
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white/[0.02] border border-white/5 group cursor-pointer shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
                  <div className="flex flex-col sm:flex-row">
                    {/* Trip Image Banner */}
                    <div className="relative w-full sm:w-[240px] h-[160px] sm:h-auto shrink-0 overflow-hidden">
                      <img src={trip.imageUrl || IMGS.paris} alt={trip.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050810] hidden sm:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050810] to-transparent sm:hidden" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md border border-white/20 text-white">
                          {trip.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Trip Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="font-bold text-2xl text-white tracking-tight group-hover:text-purple-300 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                            {trip.title}
                          </h3>
                        </div>
                        <p className="text-sm text-white/50 flex items-center gap-2 font-light tracking-wide mb-6">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" /> {trip.destination.split(",").slice(0, 3).join(" — ")}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-5 text-xs text-white/40 font-light">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/30" />{new Date(trip.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-white/30" />{trip.travelers} guests</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-white/30" />{Math.max(1, Math.round((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)))} days</span>
                          </div>
                          <span className="text-xs font-medium text-purple-300">{getTripProgress(trip)}% Planned</span>
                        </div>
                        
                        {/* Elegant Progress Bar */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" initial={{ width: 0 }} animate={{ width: `${getTripProgress(trip)}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 1 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN (Right: 4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Trending Destinations */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
              <Globe className="w-4 h-4 text-purple-400" /> Curated Spots
            </h3>
            <div className="space-y-3">
              {trending.map((dest, i) => (
                <motion.div key={i} whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }} 
                  className="group p-3 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-4 cursor-pointer transition-all hover:border-white/10">
                  <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0">
                    <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white tracking-wide group-hover:text-purple-300 transition-colors">{dest.name}</p>
                    <p className="text-xs text-white/40 font-light">{dest.type}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-white/80 text-xs font-medium">{dest.rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM CINEMATIC CTA ── */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-16 shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <img src={IMGS.cta} alt="CTA Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c16]/90 via-[#080c16]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent mix-blend-multiply" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 text-xs font-semibold uppercase tracking-widest">Traveloop AI Planner</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
              Design your perfect escape
            </h3>
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
              Experience the future of travel planning. Our intelligent engine curates personalized day-by-day itineraries tailored specifically to your unique tastes.
            </p>
          </div>
          <Link href="/trips/create" className="shrink-0">
            <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(124,58,237,0.4)" }} whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 transition-all text-base shadow-[0_10px_30px_rgba(124,58,237,0.3)] border border-purple-500/30 flex items-center gap-2">
              Generate Itinerary <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}
