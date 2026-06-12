"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, MapPin, Users, DollarSign, Loader2, X } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import { Trip } from "@/lib/types";

export default function EditTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: 0,
    description: "",
    imageUrl: "",
    status: "planning" as "planning" | "ongoing" | "completed" | "archived",
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await apiGet<{ success: boolean; data: Trip }>(`/api/trips/${tripId}`);
        if (res.success && res.data) {
          setTrip(res.data);
          setFormData({
            title: res.data.title || "",
            destination: res.data.destination || "",
            startDate: res.data.startDate || "",
            endDate: res.data.endDate || "",
            travelers: res.data.travelers || 1,
            budget: res.data.budget || 0,
            description: res.data.description || "",
            imageUrl: res.data.imageUrl || "",
            status: res.data.status || "planning",
          });
        }
      } catch (err) {
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "travelers" || name === "budget" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiPatch<{ success: boolean; data: Trip; message: string }>(
        `/api/trips/${tripId}`,
        formData
      );

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/trips/${tripId}`);
        }, 1500);
      } else {
        setError(res.message || "Failed to update trip");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update trip");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trip
          </button>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Edit Trip
          </h1>
          <p className="text-white/60">Update your trip details</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Trip Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              placeholder="Enter trip title"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                placeholder="Enter destination"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Travelers and Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Number of Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Budget (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Trip Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Add a description for your trip"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Cover Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
              <span>Trip updated successfully! Redirecting...</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
