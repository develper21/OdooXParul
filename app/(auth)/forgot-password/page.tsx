"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, ArrowLeft, ArrowRight, Plane, Shield, CheckCircle2 } from "lucide-react";

const BG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format";
const f = (d = 0) => ({ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: d } } });

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: success
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || result?.message || "Unable to send OTP.");
      }

      setStep(2);
      setMessage(result.message);
      if (result.otp) {
        setMessage(`OTP sent! Development OTP: ${result.otp}`);
      }
    } catch (err: any) {
      setError(err?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || result?.message || "Unable to verify OTP.");
      }

      setStep(3);
      setMessage("OTP verified! You can now reset your password.");
    } catch (err: any) {
      setError(err?.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

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
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-white/70 text-xs uppercase tracking-widest font-medium">Secure Recovery</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Reset Your<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">Password</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                We'll help you regain access to your travel planning account with secure OTP verification.
              </p>
            </motion.div>

            {/* Process steps */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12 space-y-4">
              <div className={`flex items-center gap-4 p-4 rounded-2xl border ${step >= 1 ? 'bg-white/[0.05] border-cyan-500/30' : 'bg-white/[0.03] border-white/10'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/50'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Enter Email</p>
                  <p className="text-white/40 text-sm">Provide your account email</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 p-4 rounded-2xl border ${step >= 2 ? 'bg-white/[0.05] border-cyan-500/30' : 'bg-white/[0.03] border-white/10'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/50'}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Verify OTP</p>
                  <p className="text-white/40 text-sm">Check your email for 6-digit code</p>
                </div>
              </div>
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
          {step > 1 && (
            <motion.button variants={f(0)} initial="hidden" animate="visible" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </motion.button>
          )}

          {step === 1 && (
            <>
              <motion.div variants={f(0)} initial="hidden" animate="visible">
                <h2 className="text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Forgot Password</h2>
                <p className="text-white/50 text-sm font-light">Enter your email to receive a reset code</p>
              </motion.div>

              <motion.form variants={f(0.1)} initial="hidden" animate="visible" onSubmit={handleSendOtp} className="space-y-4">
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

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send OTP"} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            </>
          )}

          {step === 2 && (
            <>
              <motion.div variants={f(0)} initial="hidden" animate="visible">
                <h2 className="text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Verify OTP</h2>
                <p className="text-white/50 text-sm font-light">Enter the 6-digit code sent to your email</p>
              </motion.div>

              <motion.form variants={f(0.1)} initial="hidden" animate="visible" onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-medium ml-1">6-Digit Code</label>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="000000" 
                    maxLength={6}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none text-center text-2xl font-mono" 
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}
                {message && <p className="text-sm text-green-400">{message}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"} <CheckCircle2 className="w-4 h-4" />
                </button>
              </motion.form>
            </>
          )}

          {step === 3 && (
            <motion.div variants={f(0)} initial="hidden" animate="visible" className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>OTP Verified!</h2>
                <p className="text-white/60 text-sm">{message}</p>
              </div>
              <Link
                href={`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg text-sm"
              >
                Reset Password <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          <motion.div variants={f(0.3)} initial="hidden" animate="visible" className="text-center text-white/40 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Sign in</Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
