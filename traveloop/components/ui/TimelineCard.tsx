"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimelineCardProps {
  date: string;
  title: string;
  description?: string;
  status?: "completed" | "current" | "upcoming";
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  date,
  title,
  description,
  status = "upcoming",
}) => {
  const statusColors = {
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    current: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    upcoming: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 pb-8 relative"
    >
      {/* Timeline Dot and Line */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`w-4 h-4 rounded-full border-2 ${statusColors[status]} z-10`}
          whileHover={{ scale: 1.3 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
        <div className="w-0.5 h-20 bg-gradient-to-b from-purple-500/50 to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <p className="text-sm font-semibold text-cyan-400">{date}</p>
        <h4 className="font-semibold text-white mt-1">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
};
