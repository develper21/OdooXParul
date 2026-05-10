"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`page-container ${className}`}
    >
      {children}
    </motion.div>
  );
};
