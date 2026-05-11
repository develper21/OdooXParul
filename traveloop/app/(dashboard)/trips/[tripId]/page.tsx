"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, DollarSign, MapPin, ArrowRight, Clock, TrendingUp, Plane, Share2, Edit2, Heart, MessageSquare, UserPlus, Crown, Shield } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Trip, Activity, BudgetSummary, TripMemberWithUser } from "@/lib/types";
import InviteMemberModal from "@/components/InviteMemberModal";

export default function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [members, setMembers] = useState<TripMemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      apiGet<{ success: boolean; data: Trip }>(`/api/trips/${tripId}`),
      apiGet<{ success: boolean; data: Activity[] }>(`/api/trips/${tripId}/activities`),
      apiGet<{ success: boolean; data: { summary: BudgetSummary } }>(`/api/trips/${tripId}/budget`),
      apiGet<{ success: boolean; data: TripMemberWithUser[] }>(`/api/trips/${tripId}/members`),
    ])
      .then(([tripRes, activityRes, budgetRes, membersRes]) => {
        if (!active) return;
        setTrip(tripRes.data || null);
        setActivities(activityRes.data || []);
        setBudget(budgetRes.data?.summary || null);
        setMembers(membersRes.data || []);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load trip details.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tripId]);

  const tripDays = trip ? Math.max(1, Math.round((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const totalSpent = budget?.totalSpent ?? 0;
  const budgetProgress = trip?.budget ? Math.min(100, Math.round((totalSpent / trip.budget) * 100)) : 0;

  const refreshMembers = async () => {
    try {
      const response = await apiGet<{ success: boolean; data: TripMemberWithUser[] }>(`/api/trips/${tripId}/members`);
      setMembers(response.data || []);
    } catch (err) {
      console.error("Failed to refresh members:", err);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case "organizer":
        return <Shield className="w-3 h-3 text-blue-400" />;
      default:
        return <Users className="w-3 h-3 text-gray-400" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Trip Owner";
      case "organizer":
        return "Organizer";
      default:
        return "Member";
    }
  };

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    const isInvalidId = error?.includes("Invalid trip id");
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            {isInvalidId ? "Invalid Trip ID" : "Trip Not Found"}
          </h3>
          <p className="text-white/40 mb-8 font-light tracking-wide max-w-md">
            {isInvalidId 
              ? "The trip ID you entered is not valid. Please access trips from your dashboard."
              : "This trip doesn't exist or has been deleted. Please check your available trips."}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/trips">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all">
                View All Trips
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
                Back to Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* CINEMATIC HERO BANNER */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl h-72">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 30%, #7c3aed 60%, #db2777 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(10,14,26,0.85) 100%)" }} />

        {/* Floating orbs */}
        <div className="absolute top-8 right-16 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Plane icon */}
        <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-8 right-8 opacity-20">
          <Plane className="w-24 h-24 text-white" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="badge-planning mb-3 inline-flex">{trip.status}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{trip.title}</h1>
              <p className="text-white/60 flex items-center gap-2"><MapPin className="w-4 h-4" />{trip.destination}</p>
            </div>
            <div className="hidden md:flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary py-2.5 px-4 text-sm"><Share2 className="w-4 h-4" />Share</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary py-2.5 px-4 text-sm"><Edit2 className="w-4 h-4" />Edit</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary py-2.5 px-4 text-sm"><Heart className="w-4 h-4" /></motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS ROW */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: "Duration", value: `${tripDays} Days`, color: "text-purple-400" },
          { icon: Users, label: "Travelers", value: trip.travelers, color: "text-cyan-400" },
          { icon: DollarSign, label: "Budget", value: `₹${trip.budget.toLocaleString()}`, color: "text-green-400" },
          { icon: TrendingUp, label: "Activities", value: activities.length, color: "text-orange-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-3`} />
            <p className="text-xs text-white/40 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* PROGRESS + DESCRIPTION */}
      <motion.div variants={item} className="glass-card p-7 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Trip Progress</h2>
          <span className="text-purple-400 font-bold">{budgetProgress}% Complete</span>
        </div>
        <div className="progress-bar">
          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${budgetProgress}%` }} transition={{ duration: 1 }} />
        </div>
        <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <p className="text-white/60 leading-relaxed">{trip.description || "No description yet."}</p>
      </motion.div>

      {/* THREE COLUMN */}
      <motion.div variants={item} className="grid md:grid-cols-3 gap-6">

        {/* Itinerary */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Itinerary</h3>
            <span className="text-3xl font-bold text-purple-400">{tripDays}</span>
          </div>
          <p className="text-white/50 text-sm">{activities.length} activities across {trip.destination.split(",").length} cities</p>
          <div className="space-y-2">
            {trip.destination.split(",").slice(0, 3).map((city, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }} />
                <span className="text-white/60">{city.trim()}</span>
              </div>
            ))}
          </div>
          <Link href={`/trips/${tripId}/activities`}>
            <motion.button whileHover={{ scale: 1.03 }} className="w-full btn-primary justify-center py-3 text-sm">
              Manage Activities <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Budget */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Budget Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Spent</span>
              <span className="text-white font-semibold">₹{totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Total</span>
              <span className="text-cyan-400 font-bold">₹{trip.budget.toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" style={{ background: "linear-gradient(90deg, #06b6d4, #7c3aed)" }}
                initial={{ width: 0 }} animate={{ width: `${budgetProgress}%` }} transition={{ duration: 1 }} />
            </div>
            <p className="text-xs text-white/30">{budgetProgress}% of budget used</p>
          </div>
          <div className="space-y-4">
            <Link href={`/trips/${tripId}/packing`}>
              <motion.button whileHover={{ scale: 1.03 }} className="w-full btn-secondary justify-center py-3 text-sm">
                Packing List <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href={`/trips/${tripId}/budget`}>
              <motion.button whileHover={{ scale: 1.03 }} className="w-full btn-secondary justify-center py-3 text-sm">
                Budget Details <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Collaborators */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Travel Crew</h3>
            <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-lg">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {members.length === 0 ? (
              <div className="text-center py-4">
                <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/40">No members yet</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {member.user?.name?.charAt(0).toUpperCase() || member.user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium">
                        {member.user?.name || member.user?.email || 'Unknown User'}
                      </p>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-xs text-white/40">{getRoleLabel(member.role)}</p>
                  </div>
                  {member.status === "pending" && (
                    <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg">
                      Pending
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
          <motion.button 
            whileHover={{ scale: 1.03 }} 
            onClick={() => setShowInviteModal(true)}
            className="w-full btn-secondary justify-center py-3 text-sm mt-auto"
          >
            <UserPlus className="w-4 h-4" /> Invite Member
          </motion.button>
        </div>
      </motion.div>

      {/* HIGHLIGHTS */}
      <motion.div variants={item} className="glass-card p-7">
        <h3 className="font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>Trip Highlights</h3>
        <div className="flex flex-wrap gap-3">
          {activities.slice(0, 6).map((act, i) => (
            <span key={i} className="px-4 py-2 rounded-xl text-sm text-purple-300 flex items-center gap-2"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
              ✦ {act.title}
            </span>
          ))}
          {activities.length === 0 && <p className="text-white/40 text-sm">No activities yet. Plan your itinerary to see highlights here.</p>}
        </div>
      </motion.div>

      {/* QUICK ACTIONS */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/trips/${tripId}/packing`}>
          <motion.div whileHover={{ y: -4 }} className="glass-card p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🧳</span>
            </div>
            <h4 className="text-white font-bold mb-1">Packing List</h4>
            <p className="text-white/50 text-sm">Track what to pack</p>
          </motion.div>
        </Link>
        <Link href={`/trips/${tripId}/notes`}>
          <motion.div whileHover={{ y: -4 }} className="glass-card p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-bold mb-1">Trip Notes</h4>
            <p className="text-white/50 text-sm">Document memories</p>
          </motion.div>
        </Link>
        <Link href={`/trips/${tripId}/activities`}>
          <motion.div whileHover={{ y: -4 }} className="glass-card p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-white font-bold mb-1">Activities</h4>
            <p className="text-white/50 text-sm">Manage itinerary</p>
          </motion.div>
        </Link>
      </motion.div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        tripId={tripId}
        tripTitle={trip?.title || ""}
        tripDestination={trip?.destination || ""}
        onInviteSent={refreshMembers}
      />
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        tripId={tripId}
        tripTitle={trip?.title || ""}
        tripDestination={trip?.destination || ""}
        onInviteSent={refreshMembers}
      />
    </motion.div>
  );
}
