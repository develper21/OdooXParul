"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hash, Users, Calendar, MapPin, ArrowRight, Check, X, Loader2 } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

interface TripInfo {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  joinCode: string;
  imageUrl?: string;
}

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const handleLookupTrip = async () => {
    if (code.length !== 6) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await apiGet<{ success: boolean; data: TripInfo }>(`/api/trips/by-code/${code}`);
      if (res.success) {
        setTripInfo(res.data);
      }
    } catch (err) {
      setError("Invalid join code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    if (!tripInfo) return;
    
    setJoining(true);
    setError(null);
    
    try {
      // Get current user ID (this would come from auth context)
      const currentUserId = localStorage.getItem('userId') || 'demo-user';
      
      const res = await apiPost<{ success: boolean; message: string; data: any }>(`/api/trips/${tripInfo.id}/join`, {
        code,
        userId: currentUserId
      });
      
      if (res.success) {
        setJoined(true);
        setTimeout(() => {
          router.push(`/login?redirect=${encodeURIComponent(`/invitation/${tripInfo.id}`)}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to join trip");
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      handleLookupTrip();
    } else {
      setTripInfo(null);
      setError(null);
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Join Trip
          </h1>
          <p className="text-white/60">Enter the 6-digit code to join your friend's trip</p>
        </div>

        <div className="glass-card p-6 space-y-6">
          {/* Code Input */}
          <div>
            <label className="block text-white/60 text-sm mb-3">Join Code</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={code[index] || ""}
                  onChange={(e) => {
                    const newCode = code.split('');
                    newCode[index] = e.target.value.toUpperCase();
                    const updatedCode = newCode.join('').slice(0, 6);
                    setCode(updatedCode);
                    
                    // Focus next input
                    if (e.target.value && index < 5) {
                      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !code[index] && index > 0) {
                      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  id={`code-${index}`}
                  className="w-full aspect-square text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-purple-500 focus:bg-purple-500/10 transition-all"
                  placeholder="0"
                />
              ))}
            </div>
            {loading && (
              <div className="flex items-center justify-center mt-3">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-white/40 text-sm ml-2">Looking up trip...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
                <X className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Trip Info */}
          {tripInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  {tripInfo.imageUrl ? (
                    <img 
                      src={tripInfo.imageUrl} 
                      alt={tripInfo.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{tripInfo.title}</h3>
                    <p className="text-white/60 text-sm">{tripInfo.destination}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(tripInfo.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Join Code: {tripInfo.joinCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!joined ? (
                <button
                  onClick={handleJoinTrip}
                  disabled={joining}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {joining ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </div>
                  ) : (
                    "Join This Trip"
                  )}
                </button>
              ) : (
                <div className="w-full py-3 bg-green-600/20 border border-green-500/50 text-green-400 rounded-xl font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Successfully joined! Redirecting...</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Help Text */}
          {!tripInfo && (
            <div className="text-center py-4">
              <p className="text-white/40 text-sm">
                Ask your friend for the 6-digit join code from their trip
              </p>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mt-3 transition-colors"
              >
                <ArrowRight className="w-3 h-3 rotate-180" />
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
