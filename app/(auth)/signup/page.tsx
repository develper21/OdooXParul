"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Plane, Globe, Github } from "lucide-react";

const BG = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80&auto=format";
const f = (d = 0) => ({ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: d } } });

const destinations = ["Bali", "Paris", "Kyoto", "Alps", "Maldives", "Machu Picchu"];

export default function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", pass: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (form.pass !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.pass }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || result?.message || "Unable to create account.");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-[#050810]">
      {/* Global blurred background elements */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* LEFT — Premium Form */}
      <div className="flex-1 lg:max-w-[540px] flex items-center justify-center p-4 sm:p-8 overflow-y-auto relative z-10">
        <div className="w-full max-w-[420px] space-y-5 py-4">

          <Link href="/" className="flex items-center gap-3 mb-2 w-fit group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
              <img src="/favicon.png" alt="Traveloop" className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Traveloop</span>
          </Link>

          <motion.div variants={f(0)} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Start Your Journey</h2>
            <p className="text-white/50 text-sm font-light">Create an account to curate your adventures.</p>
          </motion.div>

          <motion.form variants={f(0.1)} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 16, height: 16 }} />
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={u("name")} 
                  placeholder="Alex Johnson" 
                  suppressHydrationWarning
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 16, height: 16 }} />
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={u("email")} 
                  placeholder="name@example.com" 
                  suppressHydrationWarning
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 14, height: 14 }} />
                  <input 
                    type={show ? "text" : "password"} 
                    value={form.pass} 
                    onChange={u("pass")} 
                    placeholder="••••••••" 
                    suppressHydrationWarning
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-8 pr-8 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none text-sm" 
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {show ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 14, height: 14 }} />
                  <input 
                    type={showC ? "text" : "password"} 
                    value={form.confirm} 
                    onChange={u("confirm")} 
                    placeholder="••••••••" 
                    suppressHydrationWarning
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-8 pr-8 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none text-sm" 
                  />
                  <button type="button" onClick={() => setShowC(!showC)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showC ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 pb-1">
              <div className="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" id="terms" className="peer appearance-none w-3.5 h-3.5 border border-white/20 rounded bg-white/5 checked:bg-purple-600 checked:border-purple-600 transition-all cursor-pointer" />
                <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <label htmlFor="terms" className="text-[11px] text-white/50 leading-relaxed cursor-pointer hover:text-white/70 transition-colors">
                I agree to the <span className="text-white hover:text-purple-400 transition-colors underline decoration-white/20 underline-offset-2">Terms of Service</span> and <span className="text-white hover:text-purple-400 transition-colors underline decoration-white/20 underline-offset-2">Privacy Policy</span>
              </label>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create Account"} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          <motion.p variants={f(0.4)} initial="hidden" animate="visible" className="text-center text-white/40 text-xs mt-2">
            Already a member?{" "}
            <Link href="/login" className="text-white hover:text-purple-400 font-medium transition-colors">Sign in here</Link>
          </motion.p>
        </div>
      </div>

      {/* RIGHT — Cinematic Bali visual */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img src={BG} alt="Bali Tropical Resort" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#050810]/40 to-[#050810]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050810]" />

        <div className="relative flex flex-col h-full p-16 z-10">
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white/80 text-xs uppercase tracking-widest font-medium">Join 100K+ Travelers</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-xl leading-[1.1]" style={{ fontFamily: "var(--font-playfair)" }}>
                The World is<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-rose-300">Calling You.</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed font-light">
                Plan extraordinary journeys, discover hidden gems, and travel smarter than ever before with our intuitive platform.
              </p>
            </motion.div>

            {/* Destination pills */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
              <div className="text-white/40 text-xs uppercase tracking-widest font-medium mb-4 flex items-center gap-2">
                Trending Destinations <div className="h-px bg-white/20 flex-1 ml-2" />
              </div>
              <div className="flex flex-wrap gap-2.5">
                {destinations.map((d, i) => (
                  <motion.span key={d} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.05 }}
                    className="px-4 py-2 rounded-lg text-sm text-white/80 font-medium tracking-wide bg-white/[0.08] border border-white/[0.15] backdrop-blur-md shadow-lg cursor-default">
                    {d}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-white/30 text-sm italic font-serif">"Not all those who wander are lost." — J.R.R. Tolkien</p>
        </div>
      </div>
    </div>
  );
}
