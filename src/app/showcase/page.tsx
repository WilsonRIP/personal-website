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
      type: "spring" as const,
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
        className="text-center mb-16 lg:mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Welcome Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Briefcase className="h-4 w-4" />
          Professional Portfolio
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="scroll-m-20 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 lg:mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Client Showcase
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          A curated collection of <span className="font-semibold text-blue-600 dark:text-blue-400">professional projects</span> I&apos;ve developed for clients, 
          showcasing my expertise in creating <span className="font-semibold text-emerald-600 dark:text-emerald-400">tailored digital solutions</span> that drive results.
        </motion.p>

        {/* Stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Custom Solutions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Modern Technologies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
            <span>Client-Focused</span>
          </div>
        </motion.div>
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
          
          return (
            <motion.div 
              key={project.id}
              className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              variants={itemVariants}
            >
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  {/* Project Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-foreground" />
                  </div>
                  
                  {/* Project Content */}
                  <div className="flex-grow">
                    {/* Header with Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                          {project.name}
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {project.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Client: {project.client}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">
                      {project.description}
                    </p>
                    
                    {/* Role */}
                    <div className="mb-2">
                      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        My Role
                      </h3>
                      <p className="text-lg font-semibold">
                        {project.role}
                      </p>
                    </div>
                    
                    {/* Technologies */}
                    <div className="mb-3">
                      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-2">
                      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5">
                        {project.features.map((feature) => (
                          <div key={feature} className="flex items-start">
                            <div className="mt-1 mr-2 h-1 w-1 rounded-full bg-foreground"></div>
                            <span className="text-muted-foreground text-xs">{feature}</span>
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
        className="text-center max-w-2xl mx-auto p-8 bg-card border rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
          Interested in working together?
        </h2>
        <p className="text-xl text-muted-foreground mb-6">
          I&apos;m always open to new projects and collaborations. Let&apos;s create something amazing together!
        </p>
        <Button 
          asChild
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
