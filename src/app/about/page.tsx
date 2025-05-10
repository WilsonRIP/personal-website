// src/app/about/page.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// Assume icons exist or can be added later
// import { Github, Youtube, Twitch, Disc } from 'lucide-react'; // Example import

/* ––––––––– Config  ––––––––– */

// Update Name
const NAME = "Luke (WilsonIIRIP)";
// Replace skills with the new list
const userSkills = [
  "Professional Full Stack Developer",
  "Creative Coder",
  "Photographer",
  "Video Editor",
  "Photo Editor",
  "Content Creator (Streaming & YouTube)",
];
// prettier-ignore
const devStack = [
  { name: "Frontend", items: ["Next.js (React)","Tailwind CSS","Framer Motion","TypeScript"] },
  { name: "Backend",  items: ["Node.js","Express","Python (Flask/Django – exploring)"] },
  { name: "Database", items: ["PostgreSQL (with Prisma)","MongoDB","Supabase"] },
  { name: "DevOps/Tools", items: ["Docker","Git/GitHub","Vercel","GitHub Actions"] },
  { name: "Testing", items: ["Jest","React Testing Library","Cypress (exploring)"] },
];

/* ––––––––– Animations  ––––––––– */

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};
const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemFade = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ––––––––– Page  ––––––––– */

export default function AboutPage() {
  // Extract initials for AvatarFallback
  const initials = NAME.split(" ")
    .map((n) => n[0])
    .slice(0, 2) // Take max 2 initials
    .join("");

  return (
    <main
      className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-16 lg:p-24
                     bg-gradient-to-br from-background via-blue-900/10 to-teal-900/20
                     dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-900/10"
    >
      <div className="w-full max-w-5xl space-y-16">
        {/* 1️⃣ Heading */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-3 title-komikax" style={{ fontFamily: "KOMIKAX, sans-serif" }}>
            About {NAME}
          </h1>
          {/* Update tagline */}
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Professional Developer & Creative Mind
          </p>
        </motion.header>

        {/* 2️⃣ Intro / Avatar */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="bg-background/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-xl shadow-lg
                     border border-slate-200/50 dark:border-slate-700/50"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Who I Am
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-40 h-40 border-4 border-white dark:border-slate-700 shadow-lg shrink-0">
              <AvatarImage
                asChild
                src="/cat.png" // TODO: Update profile picture if needed
                alt={`${NAME} profile picture`}
                onError={(e) => {
                  const svg =
                    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><rect width='160' height='160' fill='#cbd5e1'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='#475569'>Profile</text></svg>";
                  (
                    e.currentTarget as HTMLImageElement
                  ).src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                }}
              />
              {/* Add explicit styles to AvatarFallback */}
              <AvatarFallback className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Add explicit text color to prose */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-center md:text-left text-slate-700 dark:text-slate-300">
              <p>
                Hi there! I&apos;m {NAME}, a Professional Developer based in the
                United States. I specialize in building robust and engaging
                digital experiences, combining technical skill with creative
                coding.
              </p>
              <p>
                Outside of development, I&apos;m passionate about photography,
                video/photo editing, and content creation through streaming and
                YouTube. I thrive on learning and exploring new technologies.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 3️⃣ Tabs powered by shadcn/ui */}
        <motion.section initial="hidden" animate="visible" variants={fadeIn}>
          {/* Default to 'skills' tab now? */}
          <Tabs defaultValue="skills" className="w-full space-y-6">
            <TabsList
              className="flex justify-between bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-sm
                         p-1.5 rounded-xl border border-slate-300/50 dark:border-slate-700/50 shadow-sm"
            >
              <TabsTrigger
                value="journey"
                className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 transition-all
                           hover:text-slate-900 dark:hover:text-white
                           data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950
                           data-[state=active]:text-slate-900 dark:data-[state=active]:text-white
                           data-[state=active]:shadow-sm data-[state=active]:rounded-xl"
              >
                My Journey
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 transition-all
                           hover:text-slate-900 dark:hover:text-white
                           data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950
                           data-[state=active]:text-slate-900 dark:data-[state=active]:text-white
                           data-[state=active]:shadow-sm data-[state=active]:rounded-xl"
              >
                Skills & Expertise
              </TabsTrigger>
              <TabsTrigger
                value="stack"
                className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 transition-all
                           hover:text-slate-900 dark:hover:text-white
                           data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950
                           data-[state=active]:text-slate-900 dark:data-[state=active]:text-white
                           data-[state=active]:shadow-sm data-[state=active]:rounded-xl"
              >
                Current Stack
              </TabsTrigger>
            </TabsList>

            {/* Panel 1 – Journey */}
            <TabsContent value="journey">
              <AnimatePresence mode="wait">
                <Card className="bg-background/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-inner">
                  <motion.div
                    key="journey"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="prose prose-neutral dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                  >
                    <p>
                      My journey into code began with a fascination for how
                      websites worked. After mastering HTML, CSS, and vanilla
                      JS, I embraced React and the Next.js framework, then
                      ventured server-side with Node and Express. Today I&apos;m
                      experimenting with Supabase and advanced testing
                      strategies while aiming to build delightful, performant
                      apps.
                    </p>
                  </motion.div>
                </Card>
              </AnimatePresence>
            </TabsContent>

            {/* Panel 2 – Skills - Updated */}
            <TabsContent value="skills">
              <motion.div
                key="skills-content" // Changed key to avoid potential conflicts if structure changes drastically
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1" // Single column for the new skill list
              >
                <motion.div variants={itemFade}>
                  <Card className="h-full bg-background/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                    <CardHeader className="pb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Core Skills & Passions
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1.5">
                        {userSkills.map((item) => (
                          <li
                            key={item}
                            className="flex items-center text-sm text-slate-700 dark:text-slate-300"
                          >
                            <svg
                              className="w-3 h-3 mr-2 text-emerald-500 dark:text-emerald-400 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Panel 3 – Stack */}
            <TabsContent value="stack">
              <motion.div
                key="stack"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="bg-background/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 shadow-inner space-y-6"
              >
                <p className="text-slate-700 dark:text-slate-300">
                  Below is the tool-chain I&apos;m currently enjoying (always
                  evolving):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {devStack.map(({ name, items }) => (
                    <motion.div key={name} variants={itemFade}>
                      <Card className="h-full bg-background dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {name}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="space-y-1.5">
                            {items.map((item) => (
                              <li
                                key={item}
                                className="flex items-center text-sm text-slate-700 dark:text-slate-300"
                              >
                                <svg
                                  className="w-3 h-3 mr-2 text-cyan-500 dark:text-cyan-400 shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* 4️⃣ CTA - Updated with Links */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-400 dark:text-slate-500 mb-4">
            Let&apos;s Connect!
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-500 mb-6 max-w-lg mx-auto">
            Interested in discussing a project or collaboration? Feel free to
            reach out via the contact page or find me on these platforms:
          </p>
          {/* Add Social Links */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {/* Replace with actual icon components later */}
            <a
              href="https://www.youtube.com/@wilsonrip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://github.com/WilsonRIP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.twitch.tv/wilsoniirip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
            >
              Twitch
            </a>
            <a
              href="https://discord.gg/wKHnwHYgzF"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
            >
              Discord
            </a>
          </div>
          <Button asChild size="lg">
            <a href="/contact">Contact Me</a>
          </Button>
        </motion.section>
      </div>
    </main>
  );
}
