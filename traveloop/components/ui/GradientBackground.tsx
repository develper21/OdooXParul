"use client";

import React from "react";
import { motion } from "framer-motion";

export const GradientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-background">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(100, 200, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 200, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 blur-3xl opacity-15"
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "-10%", left: "-10%" }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-3xl opacity-15"
        animate={{
          x: [0, -50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "-10%", right: "-10%" }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-3xl opacity-10"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      {/* Static Radial Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(100, 200, 255, 0.1) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};
