"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEBSITE_NAME } from "@/lib/types";
import { heroVariants, sectionVariants, cardVariants } from "@/lib/animations";
import Link from "next/link";
import { Saira_Stencil_One } from "next/font/google";
import { ArrowRight } from "lucide-react";

const Saira = Saira_Stencil_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-saira-stencil-one",
  display: "swap",
});

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
        <motion.h1 
          className={`text-5xl lg:text-7xl font-flowers-kingdom font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4 transition-all duration-300 ease-in-out drop-shadow-md [filter:drop-shadow(0_0_6px_rgba(59,130,246,0.5))]`}
          whileHover={{
            scale: 1.05, 
            // Optional: slightly change gradient on hover
            // background: "linear-gradient(to right, #3b82f6, #10b981, #6366f1)", 
            // WebkitBackgroundClip: "text",
            // WebkitTextFillColor: "transparent",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {WEBSITE_NAME}
        </motion.h1>

        <motion.p className="text-lg lg:text-xl text-theme-primary mb-6">
          Web & Software Developer • Creator • Problem Solver • Vibe Coder
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 justify-center">
          <Link href="/projects">
            <motion.button
              className={`${Saira.className} px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              className={`${Saira.className} px-5 py-2 rounded-lg font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50 bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700`}
              whileHover={{ scale: 1.03 }}
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
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Link href={section.link} className="group block h-full" passHref>
                <div className="flex flex-col h-full p-6 rounded-lg shadow-md hover:shadow-lg transition-all bg-theme-card border border-theme">
                  <h3 className="text-lg font-semibold text-theme-primary mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-theme-secondary mb-4 flex-grow">
                    {section.description}
                  </p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary transition-colors group-hover:text-primary/90">
                    Explore
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer - simplified */}
      <div className="mt-12 text-center">
        <p className="text-sm text-theme-secondary">
          Built with Next.js and Tailwind CSS By WilsonIIRIP/Luke
        </p>
      </div>
    </main>
  );
}
