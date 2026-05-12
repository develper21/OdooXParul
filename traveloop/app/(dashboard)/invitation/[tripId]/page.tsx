"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Users, Calendar, MapPin, ArrowRight, Check, X, Loader2, Plane } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

interface TripInfo {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}

export default function InviteLandingPage({ params }: { params: Promise<{ tripId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tripId } = use(params);
  
  const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"accepted" | "declined" | null>(null);

  useEffect(() => {
    if (tripId) {
      fetchTripInfo();
    }
  }, [tripId]);

  const fetchTripInfo = async () => {
    try {
      const res = await apiGet<{ success: boolean; data: TripInfo }>(`/api/trips/${tripId}`);
      if (res.success) {
        setTripInfo(res.data);
      }
    } catch (err) {
      setError("Trip not found or invitation has expired");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!tripInfo) return;
    
    setAccepting(true);
    setError(null);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        // Store invitation info for after login/signup
        localStorage.setItem("pendingInvitation", JSON.stringify({ 
          tripId, 
          action: "accept" 
        }));
        router.push(`/login?redirect=${encodeURIComponent(`/invite/${tripId}`)}`);
        return;
      }
      
      // Get current user info
      const userRes = await apiGet<{ success: boolean; data: any }>("/api/auth/me");
      if (!userRes.success) {
        throw new Error("User not authenticated");
      }
      
      // Join the trip
      const res = await apiPost<{ success: boolean; message: string }>(`/api/trips/${tripId}/join`, {
        code: null, // Not using join code for invite links
        userId: userRes.data.id
      });
      
      if (res.success) {
        setAction("accepted");
        setTimeout(() => {
          router.push(`/trips/${tripId}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    setDeclining(true);
    setError(null);
    
    try {
      // Just redirect to dashboard
      setAction("declined");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to process response");
    } finally {
      setDeclining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !tripInfo) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Invitation Not Found</h1>
          <p className="text-white/60 mb-6">
            {error || "This invitation link is invalid or has expired"}
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  if (action === "accepted") {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-600/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">You're In!</h1>
          <p className="text-white/60 mb-2">
            Successfully joined "{tripInfo.title}"
          </p>
          <p className="text-white/40 text-sm">Redirecting to trip page...</p>
        </motion.div>
      </div>
    );
  }

  if (action === "declined") {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Thanks for Responding</h1>
          <p className="text-white/60">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            You're Invited!
          </h1>
          <p className="text-white/60">Join this amazing trip adventure</p>
        </div>

        <div className="glass-card p-6 space-y-6">
          {/* Trip Card */}
          <div className="relative overflow-hidden rounded-xl">
            {tripInfo.imageUrl ? (
              <img 
                src={tripInfo.imageUrl} 
                alt={tripInfo.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Plane className="w-12 h-12 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white mb-1">{tripInfo.title}</h2>
              <p className="text-white/80 text-sm">{tripInfo.destination}</p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/60">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{tripInfo.destination}</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(tripInfo.startDate).toLocaleDateString()} - {new Date(tripInfo.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {accepting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Accepting...</span>
                </div>
              ) : (
                "Accept Invitation"
              )}
            </button>
            
            <button
              onClick={handleDecline}
              disabled={declining}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl font-semibold transition-all disabled:opacity-50 border border-white/10"
            >
              {declining ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Decline"
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center py-4 border-t border-white/10">
            <p className="text-white/40 text-xs">
              By accepting, you'll become a member of this trip and can help plan the adventure
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
