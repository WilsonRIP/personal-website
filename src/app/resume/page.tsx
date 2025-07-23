"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaGithub,
  FaYoutube,
  FaTwitch,
  FaDiscord,
  FaCode,
  FaCamera,
  FaVideo,
  FaPaintBrush,
} from "react-icons/fa"; // Example icons

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Define types for skills and links
interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface ResumeLink {
  url: string;
  name: string;
  icon: React.ReactNode;
}

// --- Resume Data ---
const resumeData = {
  name: "WilsonIIRIP / Luke",
  experience: "Indeterminate",
  skills: [
    { name: "Full Stack Developer", icon: <FaCode /> },
    { name: "Vibe Coder", icon: <FaCode /> }, // Using code icon as placeholder
    { name: "Photographer", icon: <FaCamera /> },
    { name: "Video Editor", icon: <FaVideo /> },
    { name: "Photo Editor", icon: <FaPaintBrush /> },
    { name: "Streamer", icon: <FaTwitch /> },
    { name: "YouTuber", icon: <FaYoutube /> },
  ] as Skill[],
  links: [
    {
      url: "https://www.youtube.com/@wilsonrip",
      name: "YouTube",
      icon: <FaYoutube />,
    },
    {
      url: "https://github.com/WilsonRIP",
      name: "GitHub Page",
      icon: <FaGithub />,
    },
    {
      url: "https://www.twitch.tv/wilsoniirip",
      name: "Twitch Channel",
      icon: <FaTwitch />,
    },
    {
      url: "https://discord.gg/wKHnwHYgzF",
      name: "Wilson Dev Zone Discord",
      icon: <FaDiscord />,
    },
  ] as ResumeLink[],
};
// ---

export default function ResumePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-theme-gradient">
      <motion.div
        className="w-full max-w-4xl space-y-10 bg-theme-card dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-theme rounded-xl shadow-lg p-8 lg:p-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div
          variants={fadeIn}
          className="text-center border-b border-theme pb-6 mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {resumeData.name}
          </h1>
          <p className="text-lg text-theme-secondary">
            Experience: {resumeData.experience}
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.section variants={fadeIn}>
          <h2 className="text-2xl font-semibold mb-6 text-theme-primary">
            Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {resumeData.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <span className="text-teal-500 text-xl">{skill.icon}</span>
                <span className="text-sm font-medium text-theme-secondary">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Links Section */}
        <motion.section variants={fadeIn}>
          <h2 className="text-2xl font-semibold mb-6 text-theme-primary">
            Links & Profiles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resumeData.links.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-600/70 transition-colors duration-200"
              >
                <span className="text-blue-500 text-2xl">{link.icon}</span>
                <div>
                  <p className="text-md font-semibold text-theme-primary group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors duration-200">
                    {link.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                    {link.url}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
