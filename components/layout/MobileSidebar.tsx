"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LayoutGrid, MapPin, PlusCircle, Map,
  WalletCards, Settings2, LogOut, Plane, Sparkles, Crown, LifeBuoy
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

export const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center border border-white/20"
        style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", boxShadow: "0 8px 32px rgba(124,58,237,0.5)" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-[#020510]/80 z-40 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like spring
            className="lg:hidden fixed left-0 top-0 h-screen w-[300px] z-50 flex flex-col border-r border-white/10"
            style={{
              background: "linear-gradient(180deg, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.98) 100%)",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* ── BACKGROUND AMBIENCE ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-indigo-500/10 to-transparent" />
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="World Map" className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-luminosity grayscale" />
            </div>

            <div className="relative z-10 flex flex-col h-full overflow-y-auto scrollbar-hide py-6 px-4 space-y-6">
              
              {/* ── BRAND HEADER ── */}
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(124,58,237,0.4)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                  <Plane className="w-5 h-5 text-white relative z-10" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                    Traveloop
                  </h1>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mt-0.5">
                    Luxury AI Platform
                  </p>
                </div>
              </Link>


              {/* ── MAIN NAVIGATION ── */}
              <div className="space-y-3">
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Core Navigation
                </p>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="block relative">
                        {active && (
                          <motion.div layoutId="mobileNavBeam" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                        )}
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ml-1 border ${
                          active 
                            ? "bg-white/[0.08] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md" 
                            : "bg-transparent border-transparent text-white/50"
                        }`}>
                          <item.icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-cyan-400" : ""}`} />
                          <span className={`text-sm tracking-wide transition-colors ${active ? "text-white font-semibold" : "font-light"}`}>
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* ── AI ASSISTANT MINI ── */}
              <div className="mt-auto space-y-3 pt-4">
                <div className="mx-1 p-3 rounded-xl relative overflow-hidden bg-purple-500/[0.05] border border-purple-500/20">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-bold text-cyan-300 tracking-[0.15em] uppercase">AI Assistant</span>
                  </div>
                  <p className="text-xs font-light text-white/70 relative z-10 leading-relaxed">
                    Flights to <span className="text-white font-medium">Tokyo</span> are 18% cheaper this week.
                  </p>
                </div>
              </div>

              {/* ── BOTTOM UTILITIES ── */}
              <div className="space-y-1 pt-4 border-t border-white/5">
                {bottomItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="block">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-white/40 border border-transparent ml-1">
                      <item.icon className={`w-4 h-4 shrink-0 transition-colors ${item.label === "Sign Out" ? "text-red-400" : ""}`} />
                      <span className={`text-xs tracking-wide transition-colors ${item.label === "Sign Out" ? "text-red-400" : ""}`}>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
