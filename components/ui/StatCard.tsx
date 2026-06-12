"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { motion } from "framer-motion";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  className = "",
}) => {
  return (
    <GlassCard className={`p-6 space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-gradient">{value}</p>
        </div>
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20"
          >
            {icon}
          </motion.div>
        )}
      </div>
      {change && (
        <div className={`text-sm font-medium ${change.isPositive ? "text-green-400" : "text-red-400"}`}>
          {change.isPositive ? "↑" : "↓"} {change.value}% from last month
        </div>
      )}
    </GlassCard>
  );
};
