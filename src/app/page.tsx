"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEBSITE_NAME } from "@/lib/types";
import { useTheme } from "@/lib/ThemeContext";
import { heroVariants, sectionVariants, cardVariants } from "@/lib/animations";
import Link from "next/link";

// Featured sections for homepage
const featuredSections = [
  {
    title: "Projects",
    description: "Check out my latest work and personal projects",
    link: "/projects",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "About",
    description: "Learn more about my background and experience",
    link: "/about",
    color: "from-teal-500 to-green-500",
  },
  {
    title: "Contact",
    description: "Get in touch for collaborations or opportunities",
    link: "/contact",
    color: "from-purple-500 to-pink-500",
  },
];

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues by only showing animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 lg:p-16 bg-theme-gradient">
      {/* Hero Section with Animation */}
      <motion.div
        className="text-center max-w-3xl mb-12 lg:mb-16"
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={heroVariants}
      >
        <motion.h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">
          {WEBSITE_NAME}
        </motion.h1>

        <motion.p className="text-lg lg:text-xl text-theme-secondary mb-6">
          Web & Software Developer • Creator • Problem Solver • Vibe Coder
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 justify-center">
          <Link href="/projects">
            <motion.button
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              whileHover={{ scale: 1.03 }} // Reduced from 1.05
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              className={`px-5 py-2 rounded-lg font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50 ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              } border border-gray-300 dark:border-gray-700`}
              whileHover={{ scale: 1.03 }} // Reduced from 1.05
              whileTap={{ scale: 0.98 }}
            >
              Contact Me
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Featured Sections */}
      <motion.div
        className="w-full max-w-5xl"
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSections.map((section) => (
            <motion.div
              key={section.title}
              variants={cardVariants}
              whileHover={{ y: -5 }} // Reduced from -10
              className={`relative overflow-hidden rounded-lg p-5 border dark:border-gray-700 border-gray-200 ${
                theme === "dark" ? "bg-gray-800/70" : "bg-white/90"
              } backdrop-blur-sm shadow-md`}
            >
              <Link href={section.link} className="block h-full">
                {/* Card background gradient - less intense */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${section.color} opacity-10 blur-xl`}
                ></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2 text-theme-primary">
                    {section.title}
                  </h3>
                  <p className="text-sm text-theme-secondary">
                    {section.description}
                  </p>

                  <div className="mt-3 inline-flex items-center text-sm font-medium text-teal-500">
                    Explore
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer - simplified */}
      <div className="mt-12 text-center">
        <p className="text-sm dark:text-gray-400 text-gray-600">
          Built with Next.js and Tailwind CSS By WilsonIIRIP/Luke
        </p>
      </div>
    </main>
  );
}
