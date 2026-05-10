"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Settings, User } from "lucide-react";

export const DashboardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start justify-between mb-8 pb-6 border-b border-white/10"
    >
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-1">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
};

export const DashboardCard: React.FC<{
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, children, footer }) => {
  return (
    <GlassCard className="p-6">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-6 pt-4 border-t border-white/10">{footer}</div>}
    </GlassCard>
  );
};

export const UserCard: React.FC<{
  avatar?: string;
  name: string;
  email: string;
}> = ({ avatar, name, email }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold">
        {avatar ? <img src={avatar} alt={name} /> : name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white">{name}</h4>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </motion.div>
  );
};

export const NotificationCenter: React.FC = () => {
  const notifications = [
    { id: 1, message: "Your trip to Bali has been updated", time: "2 hours ago" },
    { id: 2, message: "New collaboration request for Paris trip", time: "5 hours ago" },
    { id: 3, message: "Budget alert: You're near your spending limit", time: "1 day ago" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Recent Notifications
        </h3>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-foreground">{notif.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const QuickStats: React.FC<{
  stats: Array<{ label: string; value: string | number; icon?: React.ReactNode }>;
}> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass p-4 rounded-lg text-center"
        >
          {stat.icon && <div className="mb-2 flex justify-center text-xl">{stat.icon}</div>}
          <p className="text-2xl font-bold text-gradient">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export const ProgressBar: React.FC<{
  label: string;
  value: number;
  max: number;
  color?: "purple" | "cyan" | "green" | "red";
}> = ({ label, value, max, color = "purple" }) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    purple: "from-purple-500 to-purple-400",
    cyan: "from-cyan-500 to-cyan-400",
    green: "from-green-500 to-green-400",
    red: "from-red-500 to-red-400",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-white font-semibold">
          {value} / {max}
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]}`}
        />
      </div>
    </div>
  );
};
