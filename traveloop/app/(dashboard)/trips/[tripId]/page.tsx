"use client";
import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Users, DollarSign, MapPin, Share2, Edit, ArrowRight, Clock, MessageSquare, Heart, Plane, TrendingUp } from "lucide-react";

export default function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const trip = {
    title: "European Summer Adventure",
    subtitle: "Paris · Amsterdam · Berlin",
    startDate: "Jun 15, 2026", endDate: "Jul 5, 2026",
    days: 21, travelers: 4, budget: "₹5,200", spent: "₹3,450",
    description: "An unforgettable 21-day journey through Europe's most iconic cities — from the romance of Paris to the canals of Amsterdam and the vibrant history of Berlin. Every day promises stunning landscapes, culinary masterpieces, and unforgettable memories.",
    activities: 42, status: "Planning", progress: 65,
    highlights: ["Eiffel Tower Sunset", "Amsterdam Canal Cruise", "Berlin Wall Memorial", "Louvre Museum Tour", "Rhine Valley Wine Tasting"],
    collaborators: [
      { name: "Sarah Chen", role: "Trip Lead", color: "from-pink-500 to-rose-600" },
      { name: "Alex Rodriguez", role: "Transport", color: "from-blue-500 to-cyan-600" },
      { name: "Maya Patel", role: "Hotels", color: "from-purple-500 to-violet-600" },
      { name: "John Smith", role: "Activities", color: "from-orange-500 to-amber-600" },
    ],
    comments: [
      { author: "Sarah Chen", time: "2h ago", msg: "Can't wait for Paris! I've booked us dinner at Café de Flore.", avatar: "from-pink-500 to-rose-600" },
      { author: "Alex Rodriguez", time: "5h ago", msg: "I'll handle the Eurostar tickets for London → Paris leg.", avatar: "from-blue-500 to-cyan-600" },
    ],
  };

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* CINEMATIC HERO BANNER */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl h-72">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 30%, #7c3aed 60%, #db2777 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(10,14,26,0.85) 100%)" }} />

        {/* Floating orbs */}
        <div className="absolute top-8 right-16 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Plane icon */}
        <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-8 right-8 opacity-20">
          <Plane className="w-24 h-24 text-white" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="badge-planning mb-3 inline-flex">{trip.status}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{trip.title}</h1>
              <p className="text-white/60 flex items-center gap-2"><MapPin className="w-4 h-4" />{trip.subtitle}</p>
            </div>
            <div className="hidden md:flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary py-2.5 px-4 text-sm"><Share2 className="w-4 h-4" />Share</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary py-2.5 px-4 text-sm"><Edit className="w-4 h-4" />Edit</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary py-2.5 px-4 text-sm"><Heart className="w-4 h-4" /></motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS ROW */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: "Duration", value: `${trip.days} Days`, color: "text-purple-400" },
          { icon: Users, label: "Travelers", value: trip.travelers, color: "text-cyan-400" },
          { icon: DollarSign, label: "Budget", value: trip.budget, color: "text-green-400" },
          { icon: TrendingUp, label: "Activities", value: trip.activities, color: "text-orange-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-3`} />
            <p className="text-xs text-white/40 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* PROGRESS + DESCRIPTION */}
      <motion.div variants={item} className="glass-card p-7 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Trip Progress</h2>
          <span className="text-purple-400 font-bold">{trip.progress}% Complete</span>
        </div>
        <div className="progress-bar">
          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${trip.progress}%` }} transition={{ duration: 1 }} />
        </div>
        <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <p className="text-white/60 leading-relaxed">{trip.description}</p>
      </motion.div>

      {/* THREE COLUMN */}
      <motion.div variants={item} className="grid md:grid-cols-3 gap-6">

        {/* Itinerary */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Itinerary</h3>
            <span className="text-3xl font-bold text-purple-400">{trip.days}</span>
          </div>
          <p className="text-white/50 text-sm">{trip.activities} activities across {trip.subtitle.split(" · ").length} cities</p>
          <div className="space-y-2">
            {["Day 1–6: Paris", "Day 7–13: Amsterdam", "Day 14–21: Berlin"].map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }} />
                <span className="text-white/60">{d}</span>
              </div>
            ))}
          </div>
          <Link href={`/trips/${tripId}/itinerary`}>
            <motion.button whileHover={{ scale: 1.03 }} className="w-full btn-primary justify-center py-3 text-sm">
              View Itinerary <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Budget */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Budget Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Spent</span>
              <span className="text-white font-semibold">{trip.spent}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Total</span>
              <span className="text-cyan-400 font-bold">{trip.budget}</span>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" style={{ background: "linear-gradient(90deg, #06b6d4, #7c3aed)" }}
                initial={{ width: 0 }} animate={{ width: "66%" }} transition={{ duration: 1 }} />
            </div>
            <p className="text-xs text-white/30">66% of budget used</p>
          </div>
          <Link href={`/trips/${tripId}/budget`}>
            <motion.button whileHover={{ scale: 1.03 }} className="w-full btn-secondary justify-center py-3 text-sm">
              Budget Details <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Collaborators */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Travel Crew</h3>
          <div className="space-y-3">
            {trip.collaborators.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xs font-bold text-white`}>
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{c.name}</p>
                  <p className="text-xs text-white/40">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.03 }} className="w-full btn-secondary justify-center py-3 text-sm mt-auto">
            <Users className="w-4 h-4" /> Invite Member
          </motion.button>
        </div>
      </motion.div>

      {/* HIGHLIGHTS */}
      <motion.div variants={item} className="glass-card p-7">
        <h3 className="font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>Trip Highlights</h3>
        <div className="flex flex-wrap gap-3">
          {trip.highlights.map((h, i) => (
            <span key={i} className="px-4 py-2 rounded-xl text-sm text-purple-300 flex items-center gap-2"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
              ✦ {h}
            </span>
          ))}
        </div>
      </motion.div>

      {/* DISCUSSION */}
      <motion.div variants={item} className="glass-card p-7 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
          <MessageSquare className="w-5 h-5 text-purple-400" /> Discussion
        </h3>
        <div className="space-y-4">
          {trip.comments.map((c, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.avatar} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                {c.author.charAt(0)}
              </div>
              <div className="flex-1 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{c.author}</span>
                  <span className="text-xs text-white/30">{c.time}</span>
                </div>
                <p className="text-sm text-white/60">{c.msg}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Add a comment..." className="input-glass flex-1" />
          <motion.button whileHover={{ scale: 1.05 }} className="btn-primary px-5 py-3 text-sm">Send</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
