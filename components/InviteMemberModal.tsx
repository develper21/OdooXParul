"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, User, Calendar, MapPin } from "lucide-react";
import { apiPost } from "@/lib/api";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  tripDestination: string;
  onInviteSent: () => void;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  tripDestination,
  onInviteSent,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiPost("/api/invitations", {
        tripId,
        invitedEmail: email.trim(),
        invitedBy: "Current User", // This should come from user context
      });

      setSuccess(true);
      setEmail("");
      setMessage("");
      
      // Notify parent component
      onInviteSent();
      
      // Close modal after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      setEmail("");
      setMessage("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Invite to Trip
                </h2>
                <p className="text-white/60 text-sm">
                  Send an invitation to join this trip
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Trip Info */}
          <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{tripTitle}</h3>
                  <p className="text-sm text-white/60">{tripDestination}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/[0.08] focus:border-purple-500/50 outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Personal Message (Optional) */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your invitation..."
                rows={3}
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/[0.08] focus:border-purple-500/50 outline-none transition-all resize-none"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-300 text-sm">
                  ✅ Invitation sent successfully!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white/80 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
