// src/app/about/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Use standard next/image
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

// Constants defined outside component for performance
const NAME = "Your Name"; // Replace with actual name or import from config

// Define types for structured data
interface SkillItem {
    category: string;
    items: string[];
}

interface StackItem {
    name: string;
    items: string[];
}

const skills: SkillItem[] = [
    {
        category: "Languages",
        items: ["JavaScript", "TypeScript", "Python", "HTML/CSS", "C#", "C++"],
    },
    {
        category: "Frameworks & Libraries",
        items: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "Framer Motion"],
    },
    {
        category: "Tools & Platforms",
        items: ["Git", "Docker", "VS Code", "GitHub Actions", "Vercel", "Supabase (Learning)"],
    },
    {
        category: "Concepts & Design",
        items: ["Responsive Design", "UI/UX Principles", "REST APIs", "Agile Methodologies", "Figma (Learning)"],
    },
];

const devStack: StackItem[] = [
    { name: "Frontend", items: ["Next.js (React)", "Tailwind CSS", "Framer Motion", "TypeScript"] },
    { name: "Backend", items: ["Node.js", "Express", "Python (Flask/Django - exploring)"] },
    { name: "Database", items: ["PostgreSQL (with Prisma)", "MongoDB", "Supabase"] },
    { name: "DevOps/Tools", items: ["Docker", "Git/GitHub", "Vercel", "GitHub Actions"] },
    { name: "Testing", items: ["Jest", "React Testing Library", "Cypress (exploring)"] },
];

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeInOut" },
    },
};

const staggerContainer = {
    hidden: { opacity: 1 }, // Container doesn't fade, just orchestrates children
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Stagger animation of children
        },
    },
};

const itemFadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


export default function AboutPage() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Content for tabs - structure maintained for clarity
    const categories = {
        'My Journey': (
            // Use prose for typography styling, ensure colors are handled by theme
            <motion.div
                key="journey" // Add key for AnimatePresence
                initial="hidden"
                animate="visible"
                exit="hidden" // Define exit animation if needed within AnimatePresence
                variants={fadeIn}
                className="prose prose-neutral dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
            >
                <p>
                    My journey into the world of code began with a fascination for how websites worked and a desire to build my own digital creations.
                    Initially, I immersed myself in the fundamentals: HTML, CSS, and the basics of JavaScript, crafting simple static pages.
                </p>
                <p>
                    As my curiosity grew, I delved deeper into frontend development, drawn to the dynamic possibilities offered by React and its ecosystem. Building interactive user interfaces became a passion. This led me naturally to Next.js, appreciating its power for building performant, full-stack applications.
                </p>
                <p>
                    Driven by a desire to understand the complete picture, I explored backend technologies like Node.js and Express, learning how to design APIs and manage data persistence with databases like PostgreSQL and MongoDB. More recently, I've been exploring Supabase as a backend-as-a-service solution.
                </p>
                <p>
                    I'm a firm believer in continuous learning, always eager to explore new technologies (like tRPC or advanced testing strategies) and refine my skills. My goal is to contribute to meaningful projects, collaborate with talented teams, and build applications that are both functional and delightful to use.
                </p>
            </motion.div>
        ),
        'Skills & Expertise': (
            <motion.div
                key="skills"
                initial="hidden"
                animate="visible"
                variants={staggerContainer} // Stagger children animation
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                {skills.map((skillGroup) => (
                    <motion.div
                        key={skillGroup.category}
                        variants={itemFadeIn} // Each item fades in
                        // Updated Card styling for better contrast with the new gradient
                        className="p-4 bg-background/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-md border border-slate-200/50 dark:border-slate-700/50"
                    >
                        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">{skillGroup.category}</h3>
                        <ul className="space-y-1.5">
                            {skillGroup.items.map((item) => (
                                <li key={item} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-3 h-3 mr-2 text-emerald-500 dark:text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </motion.div>
        ),
        'Current Stack': (
            <motion.div
                key="stack"
                initial="hidden"
                animate="visible"
                variants={staggerContainer} // Stagger children animation
            >
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    This is the set of technologies I'm most actively using and enjoying for my current projects. I'm always evaluating and learning, so this stack evolves over time.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {devStack.map((stackGroup) => (
                        <motion.div
                            key={stackGroup.name}
                            variants={itemFadeIn} // Each item fades in
                            // Updated Card styling
                            className="p-4 bg-background/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-md border border-slate-200/50 dark:border-slate-700/50"
                        >
                            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">{stackGroup.name}</h3>
                            <ul className="space-y-1.5">
                                {stackGroup.items.map((item) => (
                                    <li key={item} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                         <svg className="w-3 h-3 mr-2 text-cyan-500 dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        ),
    };

    return (
        // Applied the gradient from RootLayout here
        // Added min-h-[calc(100vh-theme(spacing.navbarHeight)-theme(spacing.footerHeight))] if navbar/footer heights are fixed
        // Otherwise min-h-screen might be sufficient depending on layout structure
        <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-16 lg:p-24 bg-gradient-to-br from-background via-blue-900/10 to-teal-900/20 dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-900/10">
            <div className="w-full max-w-5xl space-y-16"> {/* Increased spacing */}

                {/* Header */}
                <motion.div
                    className="text-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    {/* Adjusted text colors for potentially darker gradient background */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-3">
                        About {NAME}
                    </h1>
                    <p className="text-lg text-slate-700 dark:text-slate-300"> {/* Slightly lighter secondary text */}
                        Developer, Creator, and Lifelong Learner
                    </p>
                </motion.div>

                {/* Introduction/Bio Section */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    // Updated Card styling: added backdrop-blur for effect over gradient
                    className="bg-background/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Who I Am</h2>
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg flex-shrink-0 border-4 border-white dark:border-slate-700">
                            <Image
                                src="/cat.png" // Replace with your actual image path
                                alt={`${NAME}'s Profile Picture`}
                                width={160} // Specify width
                                height={160} // Specify height
                                className="object-cover w-full h-full"
                                style={{ objectPosition: "center top" }} // Keep style if needed for specific positioning
                                priority // Load image eagerly if it's above the fold
                                onError={(e) => {
                                    // Basic fallback, consider a local placeholder
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16px' fill='%23475569'%3EProfile%3C/text%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                        {/* Use prose for better text formatting */}
                        <div className="text-slate-600 dark:text-slate-400 prose prose-neutral dark:prose-invert max-w-none text-center md:text-left">
                            <p>
                                Hi there! I'm {NAME}, a passionate developer based in the United States.
                                I thrive on turning complex problems into elegant, user-friendly digital experiences.
                                My background in software development allows me to approach challenges with both technical depth and a focus on the end-user.
                            </p>
                            <p>
                                Beyond the keyboard, I enjoy photography, immersing myself in video games, and constantly exploring the ever-evolving tech landscape.
                                I'm committed to continuous learning and strive to stay current with the latest tools and best practices in web development.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Tabs Section */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className="w-full px-2 py-6 sm:px-0">
                        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                            <Tab.List className="flex space-x-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-sm p-1.5 mb-8 border border-slate-300/50 dark:border-slate-700/50 shadow-sm">
                                {Object.keys(categories).map((category) => (
                                    <Tab
                                        key={category}
                                        className={({ selected }) =>
                                            clsx(
                                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out',
                                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-400 dark:focus-visible:ring-offset-sky-600', // Improved focus rings
                                                selected
                                                    ? 'bg-white dark:bg-sky-600 text-sky-700 dark:text-white shadow' // Active tab style
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/[0.6] dark:hover:bg-white/[0.12] hover:text-slate-900 dark:hover:text-white' // Inactive tab style
                                            )
                                        }
                                    >
                                        {category}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels className="mt-2">
                                {/* AnimatePresence enables exit animations when tabs change */}
                                <AnimatePresence mode="wait">
                                    {Object.values(categories).map((content, idx) => (
                                        selectedIndex === idx && ( // Only render the selected panel
                                            <Tab.Panel
                                                key={idx}
                                                static // Keep the element in the DOM for animations
                                                className={clsx(
                                                    // Updated Panel styling
                                                    'rounded-xl bg-background/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-inner',
                                                    'focus:outline-none' // Ring handled by Tab list usually
                                                )}
                                            >
                                                {content}
                                            </Tab.Panel>
                                        )
                                    ))}
                                </AnimatePresence>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </motion.section>

                {/* Call to Action (Optional) */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center"
                >
                     {/* Adjusted text colors */}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Let's Connect!</h2>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-lg mx-auto">
                        Interested in discussing a project, exploring collaboration opportunities, or just want to chat about tech? Feel free to reach out.
                    </p>
                    <a
                        href="/contact" // Assuming you have a contact page route
                        className="inline-block px-8 py-3 rounded-lg bg-sky-600 text-white font-medium transition-all duration-200 ease-in-out hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-400 dark:focus-visible:ring-offset-sky-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Contact Me
                    </a>
                </motion.section>

            </div>
        </main>
    );
}