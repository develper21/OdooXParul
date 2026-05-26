"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Mail, CheckCircle, XCircle, Calendar, MapPin, Users, AlertCircle, Loader2 } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { Invitation } from "@/lib/types";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"accept" | "decline" | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await apiGet<{ success: boolean; data: Invitation }>(`/api/invitations/${token}`);
        setInvitation(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load invitation");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const handleAction = async (actionType: "accept" | "decline") => {
    setProcessing(true);
    setAction(actionType);
    setError(null);

    try {
      if (actionType === "accept") {
        const userRes = await apiGet<{ success: boolean; data: any }>("/api/auth/me");
        const userId = userRes.data?.id;

        if (!userId) {
          localStorage.setItem("pendingInvitation", JSON.stringify({ token, action: "accept" }));
          router.push(`/login?redirect=${encodeURIComponent(`/invite/${token}`)}`);
          return;
        }

        const response = await apiPost(`/api/invitations/${token}`, {
          action: "accept",
          userId,
        });

        if (response.success) {
          setTimeout(() => {
            router.push(`/trips/${invitation?.tripId}`);
          }, 2000);
        }
      } else {
        await apiPost(`/api/invitations/${token}`, {
          action: "decline",
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${actionType} invitation`);
      setAction(null);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#1a1f3a] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#1a1f3a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {error?.includes("expired") ? "Invitation Expired" : "Invalid Invitation"}
            </h1>
            <p className="text-white/60 mb-6">
              {error || "This invitation is no longer valid."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              Go to Homepage
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isSuccess = action === "accept" || action === "decline";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#1a1f3a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                You're Invited! 🎉
              </h1>
              <p className="text-white/60">
                Join this amazing trip and start planning together
              </p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-6">
            <div className="bg-white/[0.03] rounded-xl p-4 mb-6">
              <h2 className="text-xl font-bold text-white mb-3">{invitation.tripTitle}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{invitation.tripDestination}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Invited by: {invitation.invitedBy}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  action === "accept"
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-orange-500/10 border border-orange-500/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {action === "accept" ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      action === "accept" ? "text-green-300" : "text-orange-300"
                    }`}>
                      {action === "accept" ? "Invitation Accepted!" : "Invitation Declined"}
                    </p>
                    <p className="text-sm text-white/60">
                      {action === "accept" 
                        ? "You'll be redirected to the trip page..."
                        : "You'll be redirected to the homepage..."
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isSuccess && (
              <div className="space-y-3">
                <button
                  onClick={() => handleAction("accept")}
                  disabled={processing}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing && action === "accept" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Accept Invitation
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleAction("decline")}
                  disabled={processing}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white/80 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing && action === "decline" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Declining...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Decline Invitation
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Note */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium mb-1">Note</p>
                  <p className="text-white/60">
                    {action === "accept" 
                      ? "You'll be added as a member to this trip and can start collaborating."
                      : "You can always ask for another invitation if you change your mind."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
