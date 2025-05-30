"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Code, Users, Palette, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the project data structure
interface Project {
  id: string;
  name: string;
  status: "In Development" | "Completed" | "Planned";
  client: React.ReactNode;
  description: string;
  role: string;
  technologies: string[];
  features: string[];
  color: string;
  icon: keyof typeof projectIcons;
  year: number;
}

// Project icons mapping
const projectIcons = {
  code: Code,
  users: Users,
  palette: Palette,
  briefcase: Briefcase,
  star: Star
};

// Project data
const projects: Project[] = [
  {
    id: "theseasons",
    name: "The Seasons Roleplay",
    status: "In Development",
    client: <Link href="https://www.youtube.com/@parkerrYT/videos" target="_blank" className="text-blue-500 hover:text-blue-600 underline">Parkerr</Link>,
    description: "The next generation of community-driven FiveM role-play. Free, open, and built for you.",
    role: "Web Developer",
    technologies: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    features: [
      "Character creation system",
      "Interactive story elements",
      "Community forums",
      "Event calendar",
      "Custom roleplay scenarios"
    ],
    color: "green",
    icon: "users",
    year: 2025
  },
  {
    id: "mamaleah",
    name: "Mama Leah Doula",
    status: "In Development",
    client: "Leah's Doula Services",
    description: "Professional website for a doula service providing support for expecting mothers and families.",
    role: "Web Developer",
    technologies: ["TypeScript", "Next.js", "Tailwind CSS", "React"],
    features: [
      "Service information",
      "Testimonials",
      "Appointment booking",
      "Resource library",
      "Blog with pregnancy tips"
    ],
    color: "pink",
    icon: "star",
    year: 2025
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function PortfolioShowcase() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-[1.1] tracking-tight whitespace-normal break-words px-2 md:px-0 pt-6"
          style={{ fontFamily: "KOMIKAX, sans-serif" }}
        >
          Client Projects
        </h1>
        {/* Decorative gradient bar */}
        <div className="mx-auto mb-6 h-2 w-32 md:w-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-80" />
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-400">
          A showcase of professional projects I&apos;ve developed for clients, 
          demonstrating my expertise in creating tailored digital solutions.
        </p>
      </motion.div>

      {/* Projects List */}
      <motion.div 
        className="space-y-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => {
          const IconComponent = projectIcons[project.icon];
          const statusColors = {
            "In Development": "bg-amber-500/20 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
            "Completed": "bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-400",
            "Planned": "bg-blue-500/20 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          };
          
          return (
            <motion.div 
              key={project.id}
              className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-200/20 dark:border-slate-700/30 shadow-md hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4, x: 0 }}
            >
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  {/* Project Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-md ${project.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-pink-100 dark:bg-pink-900/20'} flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 ${project.color === 'green' ? 'text-green-500 dark:text-green-400' : 'text-pink-500 dark:text-pink-400'}`} />
                  </div>
                  
                  {/* Project Content */}
                  <div className="flex-grow">
                    {/* Header with Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-flowers-kingdom mb-1">
                          {project.name}
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {project.status}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Client: {project.client}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                      {project.description}
                    </p>
                    
                    {/* Role */}
                    <div className="mb-2">
                      <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        My Role
                      </h3>
                      <p className="text-slate-700 dark:text-slate-200 font-medium text-sm">
                        {project.role}
                      </p>
                    </div>
                    
                    {/* Technologies */}
                    <div className="mb-3">
                      <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className={`px-2 py-0.5 ${project.color === 'green' ? 'bg-green-100/20 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-pink-100/20 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'} text-xs rounded-full`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-2">
                      <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5">
                        {project.features.map((feature) => (
                          <div key={feature} className="flex items-start">
                            <div className={`mt-1 mr-2 h-1 w-1 rounded-full ${project.color === 'green' ? 'bg-green-500' : 'bg-pink-500'}`}></div>
                            <span className="text-slate-600 dark:text-slate-300 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="text-center max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 dark:border-blue-500/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white font-arista">
          Interested in working together?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          I&apos;m always open to new projects and collaborations. Let&apos;s create something amazing together!
        </p>
        <Button 
          asChild
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-0"
        >
          <Link href="/contact" className="flex items-center gap-2">
            Get in Touch
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
