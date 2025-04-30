"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
}

const STAR_COUNT = 5;
const RAY_COUNT = 8;

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync `dark` class on <html> for theme consistency
  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    const html = document.documentElement;
    if (resolvedTheme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [mounted, resolvedTheme]);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = useCallback(() => {
    if (typeof window === "undefined") return;
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: newTheme } }));
  }, [isDark, setTheme]);

  // Pre-generate star and ray data
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        size: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 60}%`,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 1,
      })),
    []
  );

  const rays = useMemo(
    () => Array.from({ length: RAY_COUNT }, (_, i) => i * (360 / RAY_COUNT)),
    []
  );

  if (!mounted) {
    return (
      <div
        className={`w-16 h-8 rounded-full bg-yellow-300 dark:bg-gray-700 ${className}`}
        suppressHydrationWarning
      />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={
        `relative inline-flex items-center w-16 h-8 rounded-full border
        bg-yellow-300 border-yellow-400
        dark:bg-gradient-to-r dark:from-blue-700 dark:to-indigo-800 dark:border-blue-500
        transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        ${className}`
      }
      suppressHydrationWarning
    >
      {/* Thumb */}
      <motion.div
        className="absolute top-1 left-1 z-10 w-6 h-6 rounded-full shadow-md bg-white dark:bg-gray-800 flex items-center justify-center"
        animate={{ x: isDark ? 32 : 0, rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {/* Stars for dark mode */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {stars.map((s, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              initial={false}
              animate={{
                opacity: isDark ? [0.2, 0.8, 0.2] : [0, 0, 0],
                scale: isDark ? [0.8, 1, 0.8] : 0.8,
              }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
              style={{ width: `${s.size}px`, height: `${s.size}px`, top: s.top, left: s.left }}
            />
          ))}
        </motion.div>

        {/* Sun rays for light mode */}
        <AnimatePresence>
          {!isDark && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {rays.map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-yellow-200 rounded-sm origin-center"
                  style={{
                    width: '2px',
                    height: i % 2 === 0 ? '12px' : '8px',
                    transform: `rotate(${angle}deg) translateY(-14px)`,
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{ scaleY: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-yellow-400"
    >
      <circle cx={12} cy={12} r={5} />
      <line x1={12} y1={1} x2={12} y2={3} />
      <line x1={12} y1={21} x2={12} y2={23} />
      <line x1={4.22} y1={4.22} x2={5.64} y2={5.64} />
      <line x1={18.36} y1={18.36} x2={19.78} y2={19.78} />
      <line x1={1} y1={12} x2={3} y2={12} />
      <line x1={21} y1={12} x2={23} y2={12} />
      <line x1={4.22} y1={19.78} x2={5.64} y2={18.36} />
      <line x1={18.36} y1={5.64} x2={19.78} y2={4.22} />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-white"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
