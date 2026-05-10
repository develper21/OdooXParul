"use client";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Check, X, ArrowLeft, ArrowRight, Search, Filter, Luggage, Shirt, Camera, Heart, Package, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

const packingCategories = [
  { name: "Clothing", icon: Shirt, color: "from-blue-600 to-cyan-600" },
  { name: "Electronics", icon: Camera, color: "from-purple-600 to-pink-600" },
  { name: "Toiletries", icon: Package, color: "from-orange-500 to-red-600" },
  { name: "Documents", icon: Package, color: "from-green-600 to-teal-600" },
  { name: "Essentials", icon: Heart, color: "from-indigo-600 to-purple-600" },
  { name: "Other", icon: MoreHorizontal, color: "from-gray-600 to-slate-600" },
];

const commonItems = {
  "Clothing": ["T-shirts", "Jeans", "Underwear", "Socks", "Jacket", "Shoes", "Swimwear"],
  "Electronics": ["Phone Charger", "Laptop", "Camera", "Power Bank", "Headphones", "Adapter"],
  "Toiletries": ["Toothbrush", "Shampoo", "Sunscreen", "Deodorant", "Medications", "Towel"],
  "Documents": ["Passport", "Tickets", "Insurance", "ID Card", "Visa", "Itinerary"],
  "Essentials": ["Wallet", "Keys", "Sunglasses", "Watch", "Water Bottle", "Snacks"],
  "Other": ["Books", "Games", "Gifts", "Souvenirs", "Equipment"],
};

export default function PackingPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [packingItems, setPackingItems] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [submittingItems, setSubmittingItems] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: "",
    category: "Clothing",
    quantity: "1",
    notes: "",
  });

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      apiGet<{ success: boolean; data: any[] }>(`/api/trips/${tripId}/packing`),
      apiGet<{ success: boolean; data: any }>(`/api/trips/${tripId}`),
    ])
      .then(([packingRes, tripRes]) => {
        if (!active) return;
        setPackingItems(packingRes.data || []);
        setTrip(tripRes.data || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load packing data.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tripId]);

  const filteredItems = packingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Clothing",
      quantity: "1",
      notes: "",
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity) || 1,
        notes: formData.notes,
      };

      if (editingItem) {
        await apiPatch(`/api/trips/${tripId}/packing/${editingItem._id}`, payload);
        setPackingItems(prev => prev.map(item => 
          item._id === editingItem._id ? { ...item, ...payload } : item
        ));
      } else {
        const res = await apiPost<{ success: boolean; data: any }>(`/api/trips/${tripId}/packing`, payload);
        if (res.data) {
          setPackingItems(prev => [...prev, res.data]);
        }
      }

      resetForm();
      setShowAddForm(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save packing item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      notes: item.notes || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this packing item?")) return;

    try {
      await apiDelete(`/api/trips/${tripId}/packing/${itemId}`);
      setPackingItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err: any) {
      setError(err?.message || "Failed to delete packing item.");
    }
  };

  const togglePacked = async (item: any) => {
    setSubmittingItems(prev => new Set(prev).add(item._id));
    
    try {
      await apiPatch(`/api/trips/${tripId}/packing/${item._id}`, { packed: !item.packed });
      setPackingItems(prev => prev.map(i => 
        i._id === item._id ? { ...i, packed: !i.packed } : i
      ));
    } catch (err: any) {
      setError(err?.message || "Failed to update packing status.");
    } finally {
      setSubmittingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item._id);
        return newSet;
      });
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const packedCount = packingItems.filter(item => item.packed).length;
  const totalCount = packingItems.length;
  const packingProgress = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const addCommonItem = (itemName: string, category: string) => {
    setFormData({
      name: itemName,
      category,
      quantity: "1",
      notes: "",
    });
    setShowAddForm(true);
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
              Packing Checklist
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {trip.title} • {packedCount}/{totalCount} items packed
            </p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all">
          <Plus className="w-4 h-4" /> Add Item
        </motion.button>
      </motion.div>

      {/* PACKING PROGRESS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Packing Progress</h3>
          <span className="text-purple-400 font-bold">{packingProgress}% Complete</span>
        </div>
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500" 
            initial={{ width: 0 }} 
            animate={{ width: `${packingProgress}%` }} 
            transition={{ duration: 1 }} 
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-white/50">
          <span>{packedCount} items packed</span>
          <span>{totalCount - packedCount} items remaining</span>
        </div>
      </motion.div>

      {/* SEARCH AND FILTERS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} 
        className="flex flex-col lg:flex-row items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search packing items..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/40 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none font-light text-sm" 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            ...packingCategories.map(cat => ({ key: cat.name, label: cat.name }))
          ].map(cat => (
            <motion.button key={cat.key} whileHover={{ scale: 1.05 }} onClick={() => setFilter(cat.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
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

      {/* ADD/EDIT ITEM FORM */}
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
                  {editingItem ? "Edit Item" : "Add New Item"}
                </h2>
                <button onClick={() => { setShowAddForm(false); resetForm(); }} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Item Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={update("name")} 
                      placeholder="e.g. Passport, T-shirt" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
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
                      {packingCategories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Quantity</label>
                  <input 
                    type="number" 
                    value={formData.quantity} 
                    onChange={update("quantity")} 
                    placeholder="1" 
                    min="1"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:bg-white/[0.05] focus:border-purple-500/50 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-medium mb-2 block">Notes</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={update("notes")} 
                    placeholder="Add any notes about this item..." 
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
                    {submitting ? "Saving..." : (editingItem ? "Update Item" : "Add Item")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMMON ITEMS SUGGESTIONS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-6">
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Quick Add Common Items</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packingCategories.map(category => (
            <div key={category.name} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <category.icon className={`w-5 h-5 text-white/60`} />
                <h4 className="text-white font-medium">{category.name}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonItems[category.name as keyof typeof commonItems]?.map(item => (
                  <motion.button
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => addCommonItem(item, category.name)}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* PACKING ITEMS LIST */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] rounded-2xl border border-white/5">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.03] flex items-center justify-center mb-6 border border-white/10">
              <Luggage className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>No packing items</h3>
            <p className="text-white/40 mb-8 font-light tracking-wide">Start building your packing list for {trip.title}.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" /> Add Your First Item
            </button>
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const category = packingCategories.find(cat => cat.name === item.category) || packingCategories[5];
            return (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
                className={`bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 group ${
                  item.packed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePacked(item)}
                      disabled={submittingItems.has(item._id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        item.packed 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white/10 border-white/20 hover:border-purple-500/50'
                      }`}
                    >
                      <Check className={`w-3 h-3 transition-colors ${item.packed ? 'text-white' : 'text-white/40'}`} />
                    </motion.button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shrink-0`}>
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className={`text-lg font-bold transition-colors ${item.packed ? 'text-white/50 line-through' : 'text-white'}`} style={{ fontFamily: "var(--font-playfair)" }}>
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                        <span className="flex items-center gap-1.5">
                          <span className="text-white/60">Category:</span> {item.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-white/60">Qty:</span> {item.quantity}
                        </span>
                        {item.notes && (
                          <span className="flex items-center gap-1.5">
                            <span className="text-white/60">Notes:</span> {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
