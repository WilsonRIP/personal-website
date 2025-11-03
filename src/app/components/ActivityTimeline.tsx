"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function ActivityTimeline() {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Activity</span>
      </h2>

      <motion.div
        className="relative pl-10 sm:pl-14 space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Vertical line */}
        <div className="pointer-events-none absolute left-4 sm:left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-accent opacity-70" />

        {sampleTimelineData.map((item) => (
          <motion.div key={item.id} className="relative" variants={itemVariants}>
            {/* Dot */}
            <div className="absolute left-4 sm:left-6 -translate-x-1/2 top-2">
              <div className="relative w-4 h-4">
                <span className="absolute inset-0 rounded-full bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]" />
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
              </div>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {item.icon && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold tracking-wide text-primary">
                        {formatDate(item.date)}
                      </div>
                    </div>
                    <h3 className="mt-1 text-base sm:text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
