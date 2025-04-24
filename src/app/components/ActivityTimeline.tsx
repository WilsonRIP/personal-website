"use client";

import React from "react";
import { motion } from "framer-motion";

// Define the structure for a timeline item
interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode; // Optional icon
}

// Sample data - replace with dynamic data later
const sampleTimelineData: TimelineItem[] = [
  {
    id: 1,
    date: "2024-07-28",
    title: "Launched New Portfolio",
    description:
      "Successfully deployed the updated personal website built with Next.js and Tailwind.",
    icon: "🚀", // Example emoji icon
  },
  {
    id: 2,
    date: "2024-07-15",
    title: "Started Learning Go",
    description:
      "Began exploring the Go programming language for backend development.",
    icon: "💡",
  },
  {
    id: 3,
    date: "2024-06-30",
    title: "Published Blog Post",
    description: "Wrote an article about Framer Motion animations in React.",
    icon: "✍️",
  },
  {
    id: 4,
    date: "2024-06-01",
    title: "Contributed to Open Source",
    description: "Made a small contribution to a popular UI library on GitHub.",
    icon: "🤝",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function ActivityTimeline() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-4">
      <h2 className="text-2xl font-bold mb-8 text-center text-theme-primary">
        Recent Activity
      </h2>
      <motion.div
        className="relative border-l-2 border-teal-500 dark:border-teal-400 pl-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sampleTimelineData.map((item) => (
          <motion.div
            key={item.id}
            className="relative flex items-start"
            variants={itemVariants}
          >
            {/* Dot on the timeline */}
            <div className="absolute -left-[34px] top-1 w-4 h-4 bg-teal-500 dark:bg-teal-400 rounded-full border-4 border-theme-gradient-start dark:border-theme-gradient-end"></div>

            {/* Icon (optional) */}
            {item.icon && (
              <div className="mr-4 text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {item.icon}
              </div>
            )}

            {/* Content */}
            <div className={`flex-grow ${!item.icon ? "ml-10" : ""}`}>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-300 uppercase tracking-wider mb-1">
                {item.date}
              </p>
              <h3 className="text-lg font-semibold text-theme-primary mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-theme-secondary">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
