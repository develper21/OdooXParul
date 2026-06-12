"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { Clock, MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityCardProps {
  title: string;
  location: string;
  time: string;
  cost?: number;
  category?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  location,
  time,
  cost,
  category,
  description,
  icon,
}) => {
  return (
    <GlassCard className="p-5">
      <div className="flex gap-4">
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex-shrink-0"
          >
            {icon}
          </motion.div>
        )}

        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            {category && (
              <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                {category}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {time}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
            {cost && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ₹{cost}
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
