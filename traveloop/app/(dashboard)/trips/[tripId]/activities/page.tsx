"use client";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Calendar, MapPin, Clock, DollarSign, Edit2, Trash2, ArrowLeft, ArrowRight, Search, Filter, X, Plane, Sparkles } from "lucide-react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { Activity } from "@/lib/types";

const activityCategories = [
  { icon: Plane, label: "Transport", color: "from-blue-600 to-cyan-600" },
  { icon: MapPin, label: "Sightseeing", color: "from-purple-600 to-pink-600" },
  { icon: DollarSign, label: "Dining", color: "from-orange-500 to-red-600" },
  { icon: Calendar, label: "Entertainment", color: "from-green-600 to-teal-600" },
];

export default function ActivitiesPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    category: "sightseeing",
    cost: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      apiGet<{ success: boolean; data: Activity[] }>(`/api/trips/${tripId}/activities`),
      apiGet<{ success: boolean; data: any }>(`/api/trips/${tripId}`),
    ])
      .then(([activitiesRes, tripRes]) => {
        if (!active) return;
        setActivities(activitiesRes.data || []);
        setTrip(tripRes.data || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load activities.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tripId]);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase()) ||
                         activity.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || activity.category === filter;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      date: "",
      time: "",
      category: "sightseeing",
      cost: "",
      duration: "",
      description: "",
    });
    setEditingActivity(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        category: formData.category,
        cost: Number(formData.cost || "0") || 0,
        duration: Number(formData.duration || "1") || 1,
        description: formData.description,
      };

      if (editingActivity) {
        await apiPatch(`/api/trips/${tripId}/activities/${editingActivity.id}`, payload);
        setActivities(prev => prev.map(act => 
          act.id === editingActivity.id ? { ...act, ...payload } : act
        ));
      } else {
        const res = await apiPost<{ success: boolean; data: Activity }>(`/api/trips/${tripId}/activities`, payload);
        if (res.data) {
          setActivities(prev => [...prev, res.data]);
        }
      }

      resetForm();
      setShowAddForm(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save activity.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      location: activity.location,
      date: activity.date,
      time: activity.time,
      category: activity.category,
      cost: (activity.cost || 0).toString(),
      duration: (activity.duration || 1).toString(),
      description: activity.description || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      await apiDelete(`/api/trips/${tripId}/activities/${activityId}`);
      setActivities(prev => prev.filter(act => act.id !== activityId));
    } catch (err: any) {
      setError(err?.message || "Failed to delete activity.");
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Trip</span>
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
              Activities
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {trip.title} • {activities.length} activities planned
            </p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all">
          <Plus className="w-4 h-4" /> Add Activity
        </motion.button>
      </motion.div>

      {/* SEARCH AND FILTERS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} 
        className="flex flex-col lg:flex-row items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search activities..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/40 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none font-light text-sm" 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "transport", label: "Transport" },
            { key: "sightseeing", label: "Sightseeing" },
            { key: "dining", label: "Dining" },
            { key: "entertainment", label: "Entertainment" },
          ].map(cat => (
            <motion.button key={cat.key} whileHover={{ scale: 1.05 }} onClick={() => setFilter(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === cat.key 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] border border-purple-500/30' 
                  : 'bg-white/[0.03] border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ADD/EDIT ACTIVITY FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#050810] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {editingActivity ? "Edit Activity" : "Add New Activity"}
                </h2>
                <button onClick={() => { setShowAddForm(false); resetForm(); }} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Activity Title</label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={update("title")} 
                      placeholder="e.g. Visit Eiffel Tower" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Location</label>
                    <input 
                      type="text" 
                      value={formData.location} 
                      onChange={update("location")} 
                      placeholder="e.g. Paris, France" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Date</label>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={update("date")} 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Time</label>
                    <input 
                      type="time" 
                      value={formData.time} 
                      onChange={update("time")} 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={update("category")} 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none cursor-pointer" 
                    >
                      <option value="transport">Transport</option>
                      <option value="sightseeing">Sightseeing</option>
                      <option value="dining">Dining</option>
                      <option value="entertainment">Entertainment</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Cost (₹)</label>
                    <input 
                      type="number" 
                      value={formData.cost} 
                      onChange={update("cost")} 
                      placeholder="0" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Duration (hours)</label>
                    <input 
                      type="number" 
                      value={formData.duration} 
                      onChange={update("duration")} 
                      placeholder="1" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={update("description")} 
                    placeholder="Add details about this activity..." 
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none resize-none" 
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-4 justify-end">
                  <button 
                    type="button" 
                    onClick={() => { setShowAddForm(false); resetForm(); }}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? "Saving..." : (editingActivity ? "Update Activity" : "Add Activity")}
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVITIES LIST */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] rounded-2xl border border-white/5">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.03] flex items-center justify-center mb-6 border border-white/10">
              <Calendar className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>No activities found</h3>
            <p className="text-white/40 mb-8 font-light tracking-wide">Start planning your itinerary by adding your first activity.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" /> Add Your First Activity
            </button>
          </div>
        ) : (
          filteredActivities.map((activity, index) => {
            const category = activityCategories.find(cat => cat.label.toLowerCase() === activity.category) || activityCategories[1];
            return (
              <motion.div 
                key={activity.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shrink-0`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                          {activity.title}
                        </h3>
                        <p className="text-white/60 text-sm flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> {activity.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {activity.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" /> ₹{activity.cost || 0}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {activity.duration || 1}h
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      onClick={() => handleEdit(activity)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {activity.description && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-sm leading-relaxed">{activity.description}</p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
