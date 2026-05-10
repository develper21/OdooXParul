"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Globe, Sparkles, Plane, Star, ChevronDown, Instagram, Twitter, Linkedin, MapPin, Users, Calendar, CheckCircle, Map, Wallet, User, Compass, Navigation, Shield } from "lucide-react";

const IMGS = {
  hero: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80&auto=format",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=80&auto=format",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80&auto=format",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80&auto=format",
  maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&q=80&auto=format",
  alps: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=900&q=80&auto=format",
  itinerary: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80&auto=format",
  budget: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80&auto=format",
  collab: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80&auto=format",
  timeline: "https://images.unsplash.com/photo-1499591934245-40b55745b905?w=800&q=80&auto=format",
  cta: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80&auto=format",
};

const slides = [
  { city: "Santorini", country: "Greece", tagline: "Cliffside paradise over the Aegean", img: IMGS.santorini, trips: "1.8K+" },
  { city: "Kyoto", country: "Japan", tagline: "Ancient temples & cherry blossoms", img: IMGS.kyoto, trips: "2.1K+" },
  { city: "Bali", country: "Indonesia", tagline: "Jungle temples & sacred rice terraces", img: IMGS.bali, trips: "2.4K+" },
  { city: "Maldives", country: "Maldives", tagline: "Crystal waters & overwater villas", img: IMGS.maldives, trips: "1.2K+" },
  { city: "Swiss Alps", country: "Switzerland", tagline: "Glaciers, peaks & alpine villages", img: IMGS.alps, trips: "1.5K+" },
];

const features = [
  { img: IMGS.itinerary, Icon: Compass, title: "AI Itinerary Builder", desc: "Generate personalized day-by-day plans in seconds." },
  { img: IMGS.budget, Icon: Wallet, title: "Smart Budget Tracking", desc: "Monitor expenses with real-time analytics." },
  { img: IMGS.collab, Icon: Users, title: "Collaborative Planning", desc: "Invite travel companions and plan together." },
  { img: IMGS.timeline, Icon: Calendar, title: "Visual Timeline", desc: "See your entire journey at a beautiful glance." },
];

const destinations = [
  { img: IMGS.santorini, city: "Santorini", country: "Greece", trips: "1.8K+", rating: "4.9" },
  { img: IMGS.kyoto, city: "Kyoto", country: "Japan", trips: "2.1K+", rating: "4.9" },
  { img: IMGS.bali, city: "Bali", country: "Indonesia", trips: "2.4K+", rating: "4.8" },
];

const stats = [
  { value: "50K+", label: "Trips Planned", Icon: Navigation },
  { value: "100K+", label: "Travelers", Icon: User },
  { value: "195", label: "Countries", Icon: Globe },
  { value: "4.9", label: "Avg. Rating", Icon: Star },
];

const fade = { hidden: { opacity: 0, y: 28 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12 } }) };

export default function LandingPage() {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const t = setInterval(() => setSlide(p => (p + 1) % slides.length), 4500); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#050810]">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto flex items-center justify-between"
          style={{ background: "rgba(5,8,16,0.7)", backdropFilter: "blur(20px)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", padding: "10px 24px" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 shadow-inner">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Traveloop</span>
          </div>
          <div className="hidden md:flex gap-8">
            {["Features", "Destinations", "About"].map(i => (
              <button key={i} className="text-sm font-medium text-white/50 hover:text-white transition-colors tracking-wide">{i}</button>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href="/login"><button className="text-white hover:text-purple-300 transition-colors text-sm font-medium py-2 px-3">Sign In</button></Link>
            <Link href="/signup"><button className="bg-white text-black hover:bg-gray-100 transition-colors font-medium rounded-full text-sm py-2 px-6 shadow-lg">Get Started</button></Link>
          </div>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center">
        {/* Full bg image */}
        <div className="absolute inset-0">
          <img src={IMGS.hero} alt="Travel" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.7) 50%, rgba(5,8,16,0.9) 100%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div className="space-y-8">
            <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <Sparkles className="w-3 h-3 text-orange-300" />
                <span className="text-white/80 text-xs uppercase tracking-widest font-medium">AI-Powered Planning</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold leading-[0.95] tracking-tight text-white drop-shadow-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Travel<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">Beyond</span><br />Ordinary.
              </h1>
            </motion.div>
            <motion.p custom={1} variants={fade} initial="hidden" animate="visible" className="text-lg text-white/60 max-w-md leading-relaxed font-light">
              Plan cinematic journeys, manage budgets intelligently, and collaborate with fellow travelers on a platform built for modern explorers.
            </motion.p>
            <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="flex gap-4 flex-wrap">
              <Link href="/dashboard">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_10px_30px_rgba(124,58,237,0.3)] transition-all">
                  Start Planning Free <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right — cinematic destination showcase */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7 }} className="relative h-[520px] rounded-[2.5rem] overflow-hidden"
                style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
                <img src={slides[slide].img} alt={slides[slide].city} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
                
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                    <Globe className="w-3.5 h-3.5 text-white/80" /> 
                    <span className="text-white text-xs font-medium tracking-wide">{slides[slide].trips} trips</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-medium mb-1.5">{slides[slide].country}</p>
                    <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>{slides[slide].city}</h2>
                    <p className="text-white/70 text-sm mb-5 font-light leading-relaxed">{slides[slide].tagline}</p>
                    <Link href="/trips/create">
                      <motion.button whileHover={{ scale: 1.02 }} className="w-full py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-100 transition-colors">
                        Plan This Journey
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 justify-center mt-6">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
                  style={{ width: i === slide ? 32 : 8, height: 8, background: i === slide ? "#c084fc" : "rgba(255,255,255,0.15)" }} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-widest font-medium">Explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-32 px-6 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-purple-400 text-xs font-medium uppercase tracking-widest mb-3">The Experience</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Elevated Travel <span className="italic text-purple-300">Intelligence</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] cursor-default bg-white/[0.02] border border-white/5" style={{ height: 360 }}
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.15)" }}>
                <img src={f.img} alt={f.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <f.Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-3 tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-orange-400 text-xs font-medium uppercase tracking-widest mb-3">Curated Collection</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Destinations of a Lifetime</h2>
            </div>
            <Link href="/trips/create">
              <button className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide">
                View Collection <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {destinations.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer" style={{ height: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                whileHover={{ y: -10, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
                <img src={d.img} alt={d.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
                
                {/* Rating badge */}
                <div className="absolute top-6 right-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md border border-white/20 text-white">
                    <Star className="w-3.5 h-3.5 fill-white" /> {d.rating}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-medium mb-2">{d.country}</p>
                  <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>{d.city}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm font-light flex items-center gap-2">
                      <Globe className="w-4 h-4 text-white/40" /> {d.trips} planned
                    </span>
                    <motion.button whileHover={{ scale: 1.05 }} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LUXURY STATS ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[2.5rem] p-16 md:p-20"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
            
            {/* Map/Travel texture background */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
            
            {/* Glowing lines & Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] bg-gradient-to-r from-purple-900/30 to-indigo-900/30 pointer-events-none" />

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 z-10">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative group">
                  {/* Divider line between stats on desktop */}
                  {i !== 0 && <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-px h-16 bg-white/10" />}
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-white/[0.04] border border-white/10 group-hover:bg-white/[0.08] group-hover:border-purple-500/30 transition-all duration-500 shadow-lg">
                      <s.Icon className="w-6 h-6 text-purple-300" />
                    </div>
                    <div className="relative">
                      <p className="text-5xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{s.value}</p>
                      {/* Glow behind value */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <p className="text-white/40 text-sm tracking-widest uppercase font-medium mt-1">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CINEMATIC CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[3rem]" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}>
            <img src={IMGS.cta} alt="Luxury Resort" className="absolute inset-0 w-full h-full object-cover scale-105" />
            
            {/* Multi-layered cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <div className="relative p-12 md:p-24 text-center flex flex-col items-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <Compass className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-[1.1]" style={{ fontFamily: "var(--font-playfair)" }}>
                Begin Your <span className="italic text-purple-300">Extraordinary</span> Journey
              </h2>
              <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Join our exclusive community of modern explorers. Elevate the way you plan, experience, and remember your travels around the globe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12 w-full max-w-md mx-auto">
                <Link href="/signup" className="flex-1">
                  <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_10px_40px_rgba(124,58,237,0.3)] transition-all text-base flex items-center justify-center gap-2">
                    Start Exploring <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/login" className="flex-1">
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="w-full px-8 py-4 rounded-xl font-medium border border-white/20 text-white backdrop-blur-md transition-all text-base bg-white/[0.05]">
                    Member Access
                  </motion.button>
                </Link>
              </div>
              
              <div className="flex justify-center gap-x-8 gap-y-4 flex-wrap">
                {["Curated Destinations", "Smart Itineraries", "Premium Experience"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-white/50 text-sm tracking-wide font-medium">
                    <Shield className="w-4 h-4 text-purple-400/70" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LUXURY FOOTER ── */}
      <footer className="relative pt-16 pb-12 px-6 overflow-hidden bg-[#050810]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Subtle map texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-16 mb-20">
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center gap-3 w-fit group mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 shadow-[0_4px_20px_rgba(124,58,237,0.4)]">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Traveloop</span>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs font-light">
                The ultimate platform for luxury travel planning. Curating extraordinary experiences for the modern explorer.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <motion.a key={i} href="#" whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all shadow-lg">
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { title: "Platform", items: ["Destinations", "Itinerary Builder", "Budget Tracker", "Collaborate"] },
                { title: "Company", items: ["Our Story", "Journal", "Careers", "Contact"] },
                { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Cookie Settings", "Accessibility"] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="text-white/80 font-medium tracking-widest uppercase text-xs mb-6">{col.title}</h4>
                  <ul className="space-y-4">
                    {col.items.map(item => (
                      <li key={item}>
                        <Link href="#" className="text-white/40 hover:text-purple-300 text-sm transition-colors duration-300 font-light">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/30 text-xs tracking-wide">© 2026 Traveloop Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-white/30 text-xs font-light">
              <span>Designed with precision</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Built for explorers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
