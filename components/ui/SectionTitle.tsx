"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = "center",
  size = "lg",
}) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizes = {
    sm: {
      title: "text-2xl md:text-3xl",
      subtitle: "text-sm md:text-base",
    },
    md: {
      title: "text-3xl md:text-4xl",
      subtitle: "text-base md:text-lg",
    },
    lg: {
      title: "text-4xl md:text-5xl",
      subtitle: "text-lg md:text-xl",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-3 ${alignClasses[align]}`}
    >
      <h2 className={`font-bold text-gradient ${sizes[size].title}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-muted-foreground ${sizes[size].subtitle}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
