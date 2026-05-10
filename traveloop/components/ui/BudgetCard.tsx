"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { motion } from "framer-motion";

interface BudgetCardProps {
  title: string;
  spent: number;
  budget: number;
  currency?: string;
  items?: {
    name: string;
    amount: number;
  }[];
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  title,
  spent,
  budget,
  currency = "₹",
  items,
}) => {
  const percentage = (spent / budget) * 100;
  const remaining = budget - spent;

  return (
    <GlassCard className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-white mb-4">{title}</h3>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="text-white font-semibold">
              {currency}
              {spent}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Budget: {currency}{budget}</span>
            <span className={percentage > 100 ? "text-red-400" : "text-green-400"}>
              Remaining: {currency}{Math.max(remaining, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {items && items.length > 0 && (
        <div className="border-t border-white/10 pt-4 space-y-2">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">{item.name}</span>
              <span className="text-white font-medium">
                {currency}
                {item.amount}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
