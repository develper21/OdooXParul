"use client";
import { use } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DollarSign, Plus, TrendingUp, TrendingDown, ArrowLeft, Plane, Hotel, UtensilsCrossed, Camera, ShoppingBag, AlertCircle, Sparkles, PieChart, Activity, Wallet, CreditCard, ChevronRight, Zap, Target, Receipt } from "lucide-react";

const categories = [
  { icon: Plane, label: "Flights & Transit", budget: 1800, spent: 1650, color: "text-cyan-400", bg: "bg-cyan-500/20", gradient: "from-cyan-400 to-blue-600", glow: "rgba(6,182,212,0.5)" },
  { icon: Hotel, label: "Accommodation", budget: 1500, spent: 980, color: "text-purple-400", bg: "bg-purple-500/20", gradient: "from-purple-400 to-indigo-600", glow: "rgba(168,85,247,0.5)" },
  { icon: UtensilsCrossed, label: "Food & Dining", budget: 800, spent: 420, color: "text-orange-400", bg: "bg-orange-500/20", gradient: "from-orange-400 to-rose-500", glow: "rgba(249,115,22,0.5)" },
  { icon: Camera, label: "Experiences", budget: 600, spent: 280, color: "text-pink-400", bg: "bg-pink-500/20", gradient: "from-pink-400 to-fuchsia-600", glow: "rgba(236,72,153,0.5)" },
  { icon: ShoppingBag, label: "Luxury & Retail", budget: 400, spent: 120, color: "text-emerald-400", bg: "bg-emerald-500/20", gradient: "from-emerald-400 to-teal-600", glow: "rgba(16,185,129,0.5)" },
  { icon: Wallet, label: "Misc & Reserves", budget: 100, spent: 0, color: "text-amber-400", bg: "bg-amber-500/20", gradient: "from-amber-400 to-yellow-600", glow: "rgba(245,158,11,0.5)" },
];

const expenses = [
  { title: "Eurostar Premium Class", category: "Flights & Transit", amount: 285, date: "Jun 14 • 14:30", icon: Plane, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
  { title: "Hôtel Le Marais — Deposit", category: "Accommodation", amount: 420, date: "Jun 15 • 09:00", icon: Hotel, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
  { title: "Eiffel Tower VIP Access", category: "Experiences", amount: 128, date: "Jun 15 • 11:15", icon: Camera, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30" },
  { title: "Café de Flore — Dinner", category: "Food & Dining", amount: 96, date: "Jun 15 • 20:45", icon: UtensilsCrossed, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
  { title: "Louvre Private Tour", category: "Experiences", amount: 72, date: "Jun 16 • 09:30", icon: Camera, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30" },
  { title: "Seine River Cruise", category: "Experiences", amount: 80, date: "Jun 16 • 18:00", icon: Camera, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30" },
];

const totalBudget = 5200;
const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
const remaining = totalBudget - totalSpent;
const percentSpent = Math.round((totalSpent / totalBudget) * 100);

export default function BudgetPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", category: "Flights & Transit" });

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  return (
    <div className="relative min-h-screen">
      {/* ── AMBIENT FINANCIAL BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        {/* Glowing financial orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 space-y-12 pb-24">

        {/* ── CINEMATIC FINANCE HERO ── */}
        <motion.div variants={item} className="space-y-6">
          <Link href={`/trips/${tripId}`}>
            <motion.button whileHover={{ x: -4 }} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors font-medium tracking-wide">
              <ArrowLeft className="w-4 h-4" /> Back to Journey Overview
            </motion.button>
          </Link>

          <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-emerald-500/20 group">
            {/* Dark luxury background */}
            <div className="absolute inset-0 bg-[#020810]" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#020810] to-cyan-900/30" />
            
            {/* Animated wave/grid lines */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            
            {/* Glowing accents */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/30 rounded-full blur-[100px] group-hover:bg-emerald-400/40 transition-colors duration-1000" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] group-hover:bg-cyan-400/30 transition-colors duration-1000" />

            <div className="relative p-10 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="z-10 relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.2em]">Travel Treasury</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                  ₹{remaining.toLocaleString()}
                </h1>
                <p className="text-white/60 mt-3 font-light tracking-wide text-lg flex items-center gap-3">
                  <span>Available Balance</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-medium">Healthy</span>
                </p>
              </div>

              {/* Quick Stats Right Side */}
              <div className="grid grid-cols-2 gap-6 w-full md:w-auto relative z-10">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Total Budget</p>
                  <p className="text-2xl font-bold text-white">₹{totalBudget.toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Total Spent</p>
                  <p className="text-2xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {/* Animated Progress Bar at bottom of Hero */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5">
              <motion.div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                initial={{ width: 0 }} animate={{ width: `${percentSpent}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} />
            </div>
          </div>
        </motion.div>

        {/* ── PREMIUM WIDGETS & INSIGHTS ── */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Financial Analytics (2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Spending Progress Panel */}
            <motion.div variants={item} className="glass rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Spending Velocity</h2>
                  <p className="text-white/50 text-sm mt-1 font-light tracking-wide">Your current burn rate vs. trip timeline</p>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-bold tracking-tight ${percentSpent > 80 ? "text-red-400" : "text-emerald-400"}`}>{percentSpent}%</span>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mt-1">Utilized</p>
                </div>
              </div>
              
              <div className="h-4 bg-[#050810] rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div className="h-full rounded-full relative" 
                  initial={{ width: 0 }} animate={{ width: `${percentSpent}%` }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  style={{ background: percentSpent > 80 ? "linear-gradient(90deg, #ef4444, #f97316)" : "linear-gradient(90deg, #0ea5e9, #10b981)" }}>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_2s_linear_infinite]" />
                </motion.div>
              </div>

              {percentSpent > 75 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-orange-300 font-semibold text-sm">Budget Warning</p>
                    <p className="text-orange-400/70 text-xs mt-1">You have utilized over 75% of your allocated funds. Consider reviewing remaining experiences.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Category Tracking Panels */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Category Analytics</h2>
                <span className="text-white/40 text-sm font-medium hover:text-white transition-colors cursor-pointer flex items-center gap-1">View Full Report <ChevronRight className="w-4 h-4" /></span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  const pct = Math.round((cat.spent / cat.budget) * 100);
                  const isOver = pct > 90;
                  
                  return (
                    <motion.div key={i} whileHover={{ y: -4, scale: 1.01 }} className="group relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-300 p-5 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-default">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10 flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center shrink-0 border border-white/10 transition-transform duration-300 group-hover:scale-110`}
                          style={{ boxShadow: `0 0 20px ${cat.glow}` }}>
                          <Icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        
                        {/* Data */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-white font-medium text-sm tracking-wide">{cat.label}</span>
                            <span className={`text-xs font-bold ${isOver ? "text-red-400" : "text-white/60"}`}>{pct}%</span>
                          </div>
                          
                          <div className="h-1.5 w-full bg-[#050810] rounded-full overflow-hidden border border-white/5">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                              style={{ background: isOver ? "linear-gradient(90deg, #ef4444, #f97316)" : `linear-gradient(90deg, var(--tw-gradient-stops))` }}
                              className={`h-full rounded-full bg-gradient-to-r ${cat.gradient}`} />
                          </div>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">₹{cat.spent} Spent</span>
                            <span className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">₹{cat.budget} Limit</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Side Panel (AI Insights & Transactions) */}
          <div className="space-y-8">
            
            {/* AI Advisor Panel */}
            <motion.div variants={item} className="relative rounded-[2rem] p-8 overflow-hidden border border-emerald-500/20 shadow-[0_15px_40px_rgba(16,185,129,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#020810] to-emerald-950/40" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Smart Insights</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-1 flex items-center gap-2"><Target className="w-3 h-3" /> Projection</p>
                    <p className="text-white/80 text-sm font-light leading-relaxed">At your current daily burn rate, you will finish the trip under budget by <span className="text-emerald-300 font-semibold">₹340</span>.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-1 flex items-center gap-2"><Zap className="w-3 h-3" /> Opportunity</p>
                    <p className="text-white/80 text-sm font-light leading-relaxed">You have unused reserves. Consider upgrading your Amsterdam Canal Tour to a private dining experience.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Action Button */}
            <motion.div variants={item}>
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(16,185,129,0.3)" }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-xl border border-emerald-400/30">
                <Plus className="w-5 h-5" /> Log New Expense
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── EXPENSE LOG (MERCHANT STYLE) ── */}
        <motion.div variants={item} className="pt-8">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Recent Transactions</h2>
          
          <AnimatePresence>
            {showAddForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                <div className="glass rounded-[2rem] p-8 border border-emerald-500/20 shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
                  <h3 className="text-lg font-bold text-white mb-4 tracking-wide">Record New Transaction</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Merchant / Title</label>
                      <input type="text" suppressHydrationWarning placeholder="e.g. Uber, Gucci..." value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})}
                        className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-white/20 focus:border-emerald-500/50 transition-all outline-none font-light" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Amount (₹)</label>
                      <input type="number" suppressHydrationWarning placeholder="0.00" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                        className="w-full bg-[#050810]/50 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-white/20 focus:border-emerald-500/50 transition-all outline-none font-light" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-2 block">Category</label>
                      <select suppressHydrationWarning value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                        className="w-full bg-[#050810] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:border-emerald-500/50 transition-all outline-none font-light appearance-none cursor-pointer">
                        {categories.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                    <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium tracking-wide transition-colors shadow-lg">Save Transaction</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowAddForm(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl font-medium tracking-wide transition-colors">Cancel</motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-xl">
            {expenses.map((exp, i) => {
              const Icon = exp.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="group relative flex items-center justify-between p-6 hover:bg-white/[0.03] border-b border-white/5 last:border-0 transition-colors cursor-pointer">
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`w-12 h-12 rounded-xl ${exp.bg} ${exp.border} border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
                      <Icon className={`w-5 h-5 ${exp.color}`} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white tracking-wide">{exp.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/50">{exp.category}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs text-white/40 tracking-wide">{exp.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <span className="text-lg font-bold text-white tracking-tight">₹{exp.amount.toFixed(2)}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10">
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtle hover glow line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-white/40 hover:text-white transition-colors font-medium tracking-wide">View All Transactions</button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
