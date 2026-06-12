"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid, MapPin, PlusCircle, Map,
  WalletCards, Settings2, LogOut, Plane,
  Compass, Users, ArrowRight,
} from "lucide-react";

const menuItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  { icon: MapPin, label: "My Journeys", href: "/trips" },
  { icon: PlusCircle, label: "Plan Trip", href: "/trips/create" },
  { icon: Map, label: "Itinerary", href: "/trips/1/itinerary" },
  { icon: WalletCards, label: "Treasury", href: "/trips/1/budget" },
];

const bottomItems = [
  { icon: Settings2, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Sign Out", href: "/" },
];

const quickActions = [
  { icon: Compass, label: "AI Planner", desc: "Generate smart itinerary", href: "/trips/create" },
  { icon: Users, label: "Collaborate", desc: "Join or invite friends", href: "/join" },
  { icon: Map, label: "Explore Map", desc: "Discover destinations", href: "/map" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const isActive = (href: string) => {
  if (href === "/dashboard") return pathname === href;
  if (pathname === href) return true;
  if (href === "/trips") return pathname === "/trips";

  return pathname.startsWith(href);
};

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-[320px] h-screen top-0 shrink-0 z-40 relative border-r border-white/5"
      style={{
        background: "linear-gradient(180deg, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.98) 100%)",
        backdropFilter: "blur(40px)",
      }}
    >
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-r-3xl">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-purple-500/10 to-transparent" />
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="World Map" className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-luminosity grayscale" />
        {/* Animated edge glow */}
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col h-full overflow-y-auto scrollbar-hide py-6 px-5 space-y-8">
        
        {/* ── BRAND HEADER ── */}
        <Link href="/" className="flex flex-col gap-2 group px-2">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 180, scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(124,58,237,0.4)] relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
              <img src="/favicon.png" alt="Traveloop" className="w-6 h-6 relative z-10" />
            </motion.div>
            <div>
              <h1 className="font-bold text-2xl text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Traveloop
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mt-0.5">
                Luxury AI Platform
              </p>
            </div>
          </div>
        </Link>


        {/* ── MAIN NAVIGATION ── */}
        <div className="flex-1 space-y-4">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Core Navigation
          </p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.label} href={item.href} className="block relative group">
                  {/* Active Beam Indicator */}
                  {active && (
                    <motion.div layoutId="activeNavBeam" className="absolute left-0 top-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                  )}
                  <motion.div
                    whileHover={{ x: active ? 0 : 4, backgroundColor: active ? "" : "rgba(255,255,255,0.03)" }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ml-2 border ${
                      active 
                        ? "bg-white/[0.08] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md" 
                        : "bg-transparent border-transparent text-white/50"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-cyan-400" : "group-hover:text-white/80"}`} />
                    <span className={`text-sm tracking-wide transition-colors ${active ? "text-white font-semibold" : "font-light group-hover:text-white"}`}>
                      {item.label}
                    </span>
                    {active && (
                      <motion.div layoutId="activeNavGlow" className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-50" />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* ── QUICK ACTIONS ── */}
          <div className="pt-4">
            <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
              Quick Actions
            </p>
            <div>
              {quickActions.map((a, i) => (
                <Link key={i} href={a.href}>
                  <motion.div whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }} 
                    className="group p-3 rounded-xl bg-white/[0.01] border border-white/5 flex items-center gap-3 cursor-pointer transition-all hover:border-white/10 ml-2 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg`}>
                      <a.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white tracking-wide group-hover:text-purple-300 transition-colors">{a.label}</p>
                      <p className="text-[10px] text-white/40 font-light">{a.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM UTILITIES ── */}
        <div className="space-y-1.5 pt-4 border-t border-white/5">
          {bottomItems.map((item) => (
            <Link key={item.label} href={item.href} className="block group">
              <motion.div whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-white/40 hover:text-white/80 border border-transparent hover:border-white/5 ml-2">
                <item.icon className={`w-4 h-4 shrink-0 transition-colors ${item.label === "Sign Out" ? "group-hover:text-red-400" : ""}`} />
                <span className={`text-xs tracking-wide transition-colors ${item.label === "Sign Out" ? "group-hover:text-red-400" : ""}`}>{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};
