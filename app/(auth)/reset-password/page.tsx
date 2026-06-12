"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Plane, CheckCircle2 } from "lucide-react";

const BG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format";
const f = (d = 0) => ({ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: d } }});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const otpParam = params.get("otp");
    if (emailParam) setEmail(emailParam);
    if (otpParam) setOtp(otpParam);
    
    // If email or OTP is missing, redirect to forgot password
    if (!emailParam || !otpParam) {
      router.push("/forgot-password");
    }
  }, []);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error((result as any)?.error || (result as any)?.message || "Unable to reset password.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex overflow-hidden relative bg-[#050810]">
        {/* Global blurred background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center space-y-6 p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)] max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Password Reset!</h2>
              <p className="text-white/60 text-sm">Your password has been successfully reset. You can now sign in with your new password.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-[#050810]">
      {/* Global blurred background elements */}
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
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-white/70 text-xs uppercase tracking-widest font-medium">New Beginning</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Secure Your<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">Account</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                Create a strong new password to protect your travel memories and future adventures.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-[400px] space-y-6 p-6 sm:p-10 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>Traveloop</span>
          </div>

          {/* Back button */}
          <motion.button variants={f(0)} initial="hidden" animate="visible" onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </motion.button>

          <motion.div variants={f(0.1)} initial="hidden" animate="visible">
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Reset Password</h2>
            <p className="text-white/50 text-sm font-light">Create your new secure password</p>
          </motion.div>

          <motion.form variants={f(0.2)} initial="hidden" animate="visible" onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 18, height: 18 }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter new password" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" style={{ width: 18, height: 18 }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none" 
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          <motion.div variants={f(0.3)} initial="hidden" animate="visible" className="text-center text-white/40 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Sign in</Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
