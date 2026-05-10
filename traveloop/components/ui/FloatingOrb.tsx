"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingOrbProps {
  color?: "purple" | "cyan" | "blue" | "pink";
  size?: "sm" | "md" | "lg" | "xl";
  delay?: number;
  className?: string;
}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  color = "purple",
  size = "md",
  delay = 0,
  className = "",
}) => {
  const colors = {
    purple: "from-purple-600 to-purple-400",
    cyan: "from-cyan-500 to-blue-500",
    blue: "from-blue-600 to-cyan-400",
    pink: "from-pink-500 to-purple-500",
  };

  const sizes = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[28rem] h-[28rem]",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none opacity-20 ${sizes[size]} bg-gradient-to-r ${colors[color]} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};
