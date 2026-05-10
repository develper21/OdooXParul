"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "About", href: "#" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass bg-background/50 border-b border-white/10"
    >
      <div className="container-gutter max-w-7xl mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 20 }}
            className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400"
          >
            <Plane className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Traveloop
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ color: "rgb(100, 200, 255)" }}
              className="text-muted-foreground hover:text-cyan-300 transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </button>
          <Link href="/dashboard">
            <AnimatedButton size="sm">Get Started</AnimatedButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden border-t border-white/10"
      >
        <div className="container-gutter py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-muted-foreground hover:text-cyan-300 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <button className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5 transition-colors">
              Sign In
            </button>
            <Link href="/dashboard" className="flex-1">
              <AnimatedButton className="w-full" size="sm">
                Get Started
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};
