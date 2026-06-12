"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

interface TripCardProps {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  image?: string;
  onClick?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  title,
  destination,
  startDate,
  endDate,
  travelers,
  image,
  onClick,
}) => {
  return (
    <GlassCard onClick={onClick} className="overflow-hidden h-full">
      {/* Image Placeholder */}
      {image ? (
        <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-cyan-400 opacity-20" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-purple-500/30 to-cyan-400/30 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Add Image</p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gradient mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            {destination}
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{travelers} travelers</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-medium text-sm"
        >
          View Trip
        </motion.button>
      </div>
    </GlassCard>
  );
};
