"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Plane, MapPin, Github } from "lucide-react";

const BG = "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=80&auto=format";
const f = (d = 0) => ({ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: d } } });

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for invitation parameters
  useEffect(() => {
    const token = searchParams.get("token");
    const action = searchParams.get("action");
    const redirect = searchParams.get("redirect");

    if (token && action === "accept") {
      localStorage.setItem("pendingInvitation", JSON.stringify({ token, action }));
    } else if (redirect) {
      localStorage.setItem("pendingRedirect", redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || result?.message || "Unable to sign in.");
      }

      // Check for pending invitation after successful login
      const pendingInvitation = localStorage.getItem("pendingInvitation");
      const pendingRedirect = localStorage.getItem("pendingRedirect");

      if (pendingInvitation) {
        const { token, action } = JSON.parse(pendingInvitation);
        localStorage.removeItem("pendingInvitation");

        if (action === "accept") {
          try {
            const userRes = await fetch("/api/auth/me", {
              method: "GET",
              credentials: "include",
            });
            const userData = await userRes.json();
            const userId = userData?.data?.id;

            if (!userRes.ok || !userId) {
              throw new Error("Unable to determine current user");
            }

            const inviteRes = await fetch(`/api/invitations/${token}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ action: "accept", userId }),
            });
            const inviteData = await inviteRes.json();

            if (inviteRes.ok && inviteData?.data?.tripId) {
              router.push(`/trips/${inviteData.data.tripId}`);
            } else {
              router.push(`/invite/${token}`);
            }
          } catch (err) {
            console.error("Failed to accept invitation:", err);
            router.push("/dashboard");
          }
          return;
        }
      }

      if (pendingRedirect) {
        localStorage.removeItem("pendingRedirect");
        router.push(pendingRedirect);
        return;
      }

      const redirect = searchParams.get("redirect");
      if (redirect) {
        router.push(redirect);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-[#050810]">
      {/* Global blurred background element for cinematic blending */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* LEFT — Cinematic travel visual */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img src={BG} alt="Travel Destination" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#080c16]/80 via-purple-900/30 to-[#080c16]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050810]/60 to-[#050810]" />

        {/* Content */}
        <div className="relative flex flex-col h-full p-12 z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Traveloop</span>
          </Link>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-white/70 text-xs uppercase tracking-widest font-medium">Welcome Back</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Your World<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">Awaits.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                Continue crafting your extraordinary adventures with Traveloop's premium planning experience.
              </p>
            </motion.div>

            {/* Floating cards */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12 space-y-4">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/[0.05] transition-colors cursor-default">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-purple-600 to-pink-600 shadow-inner">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">European Summer Collection</p>
                  <p className="text-white/40 text-xs mt-0.5">Paris → Amsterdam → Berlin · 21 days</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT — Premium Login Form */}
      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-[400px] space-y-6 p-6 sm:p-10 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>Traveloop</span>
          </div>

          <motion.div variants={f(0)} initial="hidden" animate="visible">
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Sign In</h2>
            <p className="text-white/50 text-sm font-light">Access your curated itineraries</p>
          </motion.div>

          <motion.form variants={f(0.1)} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 18, height: 18 }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs text-white/50 uppercase tracking-widest font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">Recovery</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 18, height: 18 }} />
                <input 
                  type={show ? "text" : "password"} 
                  value={pass} 
                  onChange={e => setPass(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none" 
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {show ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center gap-3 pt-1">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" id="rem" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 checked:bg-purple-600 checked:border-purple-600 transition-all cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <label htmlFor="rem" className="text-sm text-white/50 cursor-pointer hover:text-white/80 transition-colors">Keep me signed in</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Enter Portal"} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          <motion.div variants={f(0.2)} initial="hidden" animate="visible" className="relative flex items-center gap-4 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-white/30 text-xs font-medium uppercase tracking-wider">Or Continue With</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          <motion.div variants={f(0.3)} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
            <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 text-sm font-medium transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </motion.button>
            <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 text-sm font-medium transition-all">
              <Github className="w-4 h-4" />
              GitHub
            </motion.button>
          </motion.div>

          <motion.p variants={f(0.4)} initial="hidden" animate="visible" className="text-center text-white/40 text-sm">
            Ready for your next journey?{" "}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Apply here</Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
