"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Globe, Shield, LogOut, Trash2, ChevronRight, Settings, Camera, CheckCircle2, Crown, Sparkles, Smartphone, Laptop, CreditCard, Apple, Fingerprint, Activity, MapPin, Moon, Sun, Palette, Plane, Hotel, UtensilsCrossed, AlertTriangle, Eye, Lock, Zap } from "lucide-react";

const IMGS = {
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  mapBg: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80",
};

const tabs = [
  { id: "Profile", icon: User },
  { id: "Personalization", icon: Sparkles },
  { id: "Membership", icon: Crown },
  { id: "Payment", icon: CreditCard },
  { id: "Security", icon: Shield },
  { id: "Notifications", icon: Bell },
  { id: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaved, setIsSaved] = useState(false);
  
  // Toggles state
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Trip Alerts": true,
    "Visa & Document Reminders": true,
    "Flight Status Updates": true,
    "AI Travel Suggestions": true,
    "Smart Budget Alerts": true,
    "Two-Factor Authentication (2FA)": true,
    "Biometric Login (Face ID / Touch ID)": false,
    "AI Fraud Detection": true,
    "Dark Mode": true,
    "Immersive UI Motion": true,
  });

  const toggle = (key: string) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* ── AMBIENT LUXURY BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#020510]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <img src={IMGS.mapBg} alt="World Map" className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-luminosity grayscale" />
        
        {/* Cinematic Lighting */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32 space-y-10">

        {/* ── PREMIUM PROFILE HEADER ── */}
        <motion.div variants={item} className="relative rounded-[2rem] p-8 overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#020510] to-purple-900/30" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-8">
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar Upload */}
              <div className="relative group/avatar cursor-pointer shrink-0">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                  <img src={IMGS.avatar} alt="User" className="w-full h-full rounded-full object-cover border-4 border-[#020510]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm m-1">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left space-y-1">
                <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Alex Johnson</h1>
                <p className="text-white/60 font-light tracking-wide flex items-center justify-center md:justify-start gap-2">
                  alex.johnson@example.com
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Elite Tier
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Stats / Status Right Side */}
            <div className="flex flex-row gap-6 md:gap-10 shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-[#050810]">
                  <span className="text-lg font-bold text-emerald-400">85%</span>
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-2">Profile</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-white">14</span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-1">Countries</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── PREMIUM NAVIGATION TABS ── */}
        <motion.div variants={item} className="flex overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 z-10 shrink-0
                  ${activeTab === tab.id ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? "text-indigo-400" : ""}`} />
                <span className="relative z-10 tracking-wide">{tab.id}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── ACTIVE CONTENT AREA ── */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* ── PROFILE SECTION ── */}
            {activeTab === "Profile" && (
              <motion.div key="Profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6">Personal Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Full Name</label>
                      <input type="text" defaultValue="Alex Johnson" className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-indigo-500/50 transition-all outline-none font-light" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Email Address</label>
                      <input type="email" defaultValue="alex.johnson@example.com" className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-indigo-500/50 transition-all outline-none font-light" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Phone Number</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-indigo-500/50 transition-all outline-none font-light" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Date of Birth</label>
                      <input type="date" defaultValue="1990-05-15" className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-indigo-500/50 transition-all outline-none font-light [color-scheme:dark]" />
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6">Travel Identity</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Nationality</label>
                      <select className="w-full bg-[#050810] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-indigo-500/50 transition-all outline-none font-light appearance-none cursor-pointer">
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Home Airport</label>
                      <input type="text" defaultValue="JFK - John F. Kennedy International" className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-indigo-500/50 transition-all outline-none font-light" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Passport Status</label>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20 max-w-md">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-green-100 font-medium tracking-wide">Verified & Active</span>
                        </div>
                        <span className="text-xs text-green-400/50 font-semibold tracking-wide">Exp: 08/2032</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PERSONALIZATION (AI PREFERENCES) ── */}
            {activeTab === "Personalization" && (
              <motion.div key="Personalization" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                
                <div className="relative rounded-[1.5rem] p-8 overflow-hidden border border-purple-500/20 shadow-[0_15px_40px_rgba(124,58,237,0.1)] group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#020510] to-purple-950/40" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] transition-colors duration-700" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>AI Travel Preferences</h2>
                        <p className="text-white/50 text-sm font-light mt-1">Our AI uses these signals to curate the perfect luxury itineraries.</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-purple-300 tracking-widest uppercase">
                      AI Learning: Active
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Flight Preferences */}
                  <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                      <Plane className="w-5 h-5 text-cyan-400" /> Transit Preferences
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-3 block">Preferred Cabin Class</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Economy", "Business", "First"].map(cls => (
                            <button key={cls} className={`py-2.5 rounded-lg text-sm font-medium transition-all ${cls === "Business" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white"}`}>
                              {cls}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-3 block">Seat Preference</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Window", "Aisle"].map(seat => (
                            <button key={seat} className={`py-2.5 rounded-lg text-sm font-medium transition-all ${seat === "Window" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white"}`}>
                              {seat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accommodation Preferences */}
                  <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                      <Hotel className="w-5 h-5 text-purple-400" /> Stay Preferences
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-3 block">Property Style</label>
                        <div className="flex flex-wrap gap-2">
                          {["Luxury Resort", "Boutique Hotel", "Private Villa", "Modern Apartment"].map(style => (
                            <button key={style} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${["Boutique Hotel", "Private Villa"].includes(style) ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white"}`}>
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-3 block">Vibe</label>
                        <div className="flex flex-wrap gap-2">
                          {["Quiet & Secluded", "City Center", "Beachfront", "Historic"].map(vibe => (
                            <button key={vibe} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${["Quiet & Secluded", "Historic"].includes(vibe) ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white"}`}>
                              {vibe}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dining Preferences */}
                  <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl md:col-span-2">
                    <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-orange-400" /> Dining & Cuisine
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {["Michelin Star", "Local Street Food", "Fine Dining", "Vegan / Vegetarian", "Seafood", "Wine Tasting"].map(food => (
                        <button key={food} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${["Michelin Star", "Fine Dining", "Wine Tasting"].includes(food) ? "bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]" : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"}`}>
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECURITY SECTION ── */}
            {activeTab === "Security" && (
              <motion.div key="Security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                
                {/* Security Score */}
                <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle cx="56" cy="56" r="48" fill="transparent" stroke="url(#emeraldGradient)" strokeWidth="8" strokeDasharray="301" strokeDashoffset="30" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-white tracking-tighter">90</span>
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Score</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Excellent Security Status</h2>
                    <p className="text-white/60 font-light leading-relaxed max-w-xl text-sm">Your account is highly secure. You have enabled core protections like 2FA and active AI fraud detection.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Settings Toggles */}
                  <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6">Security Features</h3>
                    <div className="space-y-4">
                      {["Two-Factor Authentication (2FA)", "Biometric Login (Face ID / Touch ID)", "AI Fraud Detection"].map(item => (
                        <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                          <span className="text-sm font-medium text-white/80">{item}</span>
                          <button onClick={() => toggle(item)} className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${toggles[item] ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-white/10"}`}>
                            <motion.div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow" animate={{ x: toggles[item] ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Devices */}
                  <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4 mb-6">Connected Devices</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <Laptop className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white tracking-wide">MacBook Pro 16"</p>
                          <p className="text-xs text-emerald-400/80 mt-0.5">Current Session • New York</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-white/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/80 tracking-wide">iPhone 14 Pro Max</p>
                          <p className="text-xs text-white/40 mt-0.5">Last active 2 hrs ago</p>
                        </div>
                        <button className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors shrink-0 bg-red-500/10 px-3 py-1.5 rounded-full">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-[1.5rem] p-8 border border-red-500/20 bg-red-500/[0.03] shadow-xl">
                  <h3 className="text-lg font-bold text-red-400 tracking-wide mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm">
                      <LogOut className="w-4 h-4" /> Sign Out of All Devices
                    </button>
                    <button className="flex-1 px-6 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ── NOTIFICATIONS SECTION ── */}
            {activeTab === "Notifications" && (
              <motion.div key="Notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                  <h2 className="text-2xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Communication Preferences</h2>
                  <p className="text-white/50 text-sm font-light mb-8">Control how Traveloop informs you about your journeys, payments, and AI recommendations.</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {["Trip Alerts", "Visa & Document Reminders", "Flight Status Updates", "AI Travel Suggestions", "Smart Budget Alerts"].map(item => {
                      const isOn = toggles[item];
                      return (
                        <div key={item} className={`p-5 rounded-xl border transition-all duration-300 flex items-start justify-between gap-4 cursor-pointer ${isOn ? "bg-white/[0.04] border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.1)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"}`} onClick={() => toggle(item)}>
                          <div>
                            <p className={`text-sm font-semibold tracking-wide ${isOn ? "text-white" : "text-white/60"}`}>{item}</p>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-semibold">Push & Email</p>
                          </div>
                          <button className={`shrink-0 w-12 h-6 rounded-full transition-all duration-300 relative ${isOn ? "bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]" : "bg-white/10"}`}>
                            <motion.div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow" animate={{ x: isOn ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── APPEARANCE SECTION ── */}
            {activeTab === "Appearance" && (
              <motion.div key="Appearance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="glass rounded-[1.5rem] p-8 border border-white/5 shadow-xl">
                  <h2 className="text-2xl font-bold text-white tracking-tight mb-8" style={{ fontFamily: "var(--font-playfair)" }}>Theme & Display</h2>
                  
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-4 block">Color Mode</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-6 rounded-2xl border flex flex-col items-center gap-3 cursor-pointer transition-all ${toggles["Dark Mode"] ? "bg-[#020510] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "bg-[#050810] border-white/5 opacity-50 hover:opacity-100"}`} onClick={() => !toggles["Dark Mode"] && toggle("Dark Mode")}>
                          <Moon className={`w-8 h-8 ${toggles["Dark Mode"] ? "text-indigo-400" : "text-white/50"}`} />
                          <span className={`text-sm font-semibold tracking-wide ${toggles["Dark Mode"] ? "text-white" : "text-white/50"}`}>Dark (Cinematic)</span>
                        </div>
                        <div className={`p-6 rounded-2xl border flex flex-col items-center gap-3 cursor-pointer transition-all ${!toggles["Dark Mode"] ? "bg-white border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "bg-[#050810] border-white/5 opacity-50 hover:opacity-100"}`} onClick={() => toggles["Dark Mode"] && toggle("Dark Mode")}>
                          <Sun className={`w-8 h-8 ${!toggles["Dark Mode"] ? "text-indigo-500" : "text-white/50"}`} />
                          <span className={`text-sm font-semibold tracking-wide ${!toggles["Dark Mode"] ? "text-gray-900" : "text-white/50"}`}>Light (Clean)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-4 block">Experience</label>
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div>
                          <span className="text-sm font-semibold text-white/80 block mb-1 tracking-wide">Immersive UI Motion</span>
                          <span className="text-xs text-white/40 font-light">Enable cinematic page transitions and hover effects.</span>
                        </div>
                        <button onClick={() => toggle("Immersive UI Motion")} className={`shrink-0 w-12 h-6 rounded-full transition-all duration-300 relative ${toggles["Immersive UI Motion"] ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "bg-white/10"}`}>
                          <motion.div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow" animate={{ x: toggles["Immersive UI Motion"] ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder for Membership / Payment */}
            {["Membership", "Payment"].includes(activeTab) && (
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 glass rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center text-white/50 shadow-xl">
                {activeTab === "Membership" ? <Crown className="w-12 h-12 mb-4 opacity-20" /> : <CreditCard className="w-12 h-12 mb-4 opacity-20" />}
                <p className="text-lg font-light tracking-wide">Premium {activeTab} integration coming soon.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.div>

      {/* ── STICKY BOTTOM SAVE BAR ── */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-6 flex justify-center pointer-events-none">
        <div className="glass rounded-2xl p-4 flex items-center gap-4 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-auto">
          <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }} className="px-6 py-2.5 rounded-xl bg-transparent text-white/60 hover:text-white font-medium tracking-wide transition-all text-sm">
            Discard Changes
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold tracking-wide shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-400/30 transition-all text-sm flex items-center gap-2">
            Save Preferences
            <AnimatePresence>
              {isSaved && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}>
                  <CheckCircle2 className="w-4 h-4 ml-1" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
}
