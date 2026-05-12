"use client";

import dynamic from "next/dynamic";

const TripMapInner = dynamic(() => import("./TripMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl border border-white/10 bg-[#0a0f1c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default TripMapInner;
