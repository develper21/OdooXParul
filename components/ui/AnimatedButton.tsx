"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  onClick,
  type = "button",
  disabled,
}) => {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    glass: "btn-secondary",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${variantClasses[variant]} ${sizeClasses[size]} font-semibold rounded-xl flex items-center gap-2 ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
};
