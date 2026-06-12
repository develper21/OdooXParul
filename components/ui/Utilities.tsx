"use client";

import React from "react";
import { motion } from "framer-motion";

export const SkeletonLoader: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = "",
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={idx}
          className={`glass rounded-lg ${className}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      ))}
    </>
  );
};

export const LoadingSpinner: React.FC = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full"
  />
);

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "error";
  className?: string;
}> = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    success: "bg-green-500/20 text-green-300 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    error: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const Tooltip: React.FC<{
  content: string;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50"
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 text-center"
  >
    {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
    )}
    {action}
  </motion.div>
);
