"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Copy, Check, Loader2 } from "lucide-react";

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  tripDestination: string;
}

export default function ShareTripModal({ 
  isOpen, 
  onClose, 
  tripId, 
  tripTitle, 
  tripDestination 
}: ShareTripModalProps) {
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateShareLink = () => {
    setLoading(true);
    // Generate shareable link
    const url = `${window.location.origin}/trips/${tripId}`;
    setShareLink(url);
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (!shareLink) {
      generateShareLink();
      return;
    }
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareToTwitter = () => {
    const text = `Check out my trip to ${tripDestination}: ${tripTitle}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`;
    window.open(url, "_blank");
  };

  const shareToWhatsApp = () => {
    const text = `Check out my trip to ${tripDestination}: ${tripTitle}\n\n${shareLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct share URL, so we copy the link
    copyToClipboard();
    alert("Link copied! You can now paste it in your Instagram story or post.");
  };

  const shareToTelegram = () => {
    const text = `Check out my trip to ${tripDestination}: ${tripTitle}\n\n${shareLink}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareToEmail = () => {
    const subject = `Check out my trip: ${tripTitle}`;
    const body = `I'm planning a trip to ${tripDestination} and thought you might be interested!\n\nTrip: ${tripTitle}\n\nView details: ${shareLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0f1c] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Share Trip</h2>
                  <p className="text-white/60 text-sm">{tripTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Share Link */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink || `${window.location.origin}/trips/${tripId}`}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  disabled={loading}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Social Media Sharing */}
            <div>
              <label className="block text-white/60 text-sm mb-3">Share on Social Media</label>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={shareToTwitter}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-xs text-white/60">X</span>
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-xs text-white/60">WhatsApp</span>
                </button>
                <button
                  onClick={shareToInstagram}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-xs text-white/60">Instagram</span>
                </button>
                <button
                  onClick={shareToTelegram}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-xs text-white/60">Telegram</span>
                </button>
              </div>
            </div>

            {/* Trip Info */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/40 text-xs mb-2">Trip Details</p>
              <p className="text-white font-medium">{tripTitle}</p>
              <p className="text-white/60 text-sm">{tripDestination}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
