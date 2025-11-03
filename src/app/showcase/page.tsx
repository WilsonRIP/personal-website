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
    client: <Link href="https://www.youtube.com/@parkerrYT/videos" target="_blank" className="text-primary hover:text-primary/80 underline">Parkerr</Link>,
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Briefcase className="h-4 w-4" />
          Professional Portfolio
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 lg:mb-8 text-foreground leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Client Showcase
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 font-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          A curated collection of <span className="font-semibold text-primary">professional projects</span> I&apos;ve developed for clients, 
          showcasing my expertise in creating <span className="font-semibold text-primary">tailored digital solutions</span> that drive results.
        </motion.p>

        {/* Stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-muted-foreground font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <span>Custom Solutions</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span>Modern Technologies</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
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
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Project Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                    <IconComponent className="h-7 w-7 text-foreground" />
                  </div>
                  
                  {/* Project Content */}
                  <div className="flex-grow space-y-6">
                    {/* Header with Status */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
                          {project.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                            <Clock className="h-3.5 w-3.5" />
                            {project.status}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Client: {project.client}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-3">
                      <p className="text-base md:text-lg leading-relaxed text-foreground font-normal">
                        {project.description}
                      </p>
                    </div>
                    
                    {/* Role */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        My Role
                      </h3>
                      <p className="text-base text-muted-foreground font-medium">
                        {project.role}
                      </p>
                    </div>
                    
                    {/* Technologies */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-3 py-1.5 bg-muted text-foreground text-sm font-medium rounded-md border border-border hover:bg-muted/80 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        Key Features
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
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
        className="text-center max-w-2xl mx-auto p-8 md:p-10 bg-card border rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
          Interested in working together?
        </h2>
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-8 max-w-xl mx-auto">
          I&apos;m always open to new projects and collaborations. Let&apos;s create something amazing together!
        </p>
        <Button 
          asChild
          size="lg"
          className="text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/contact" className="flex items-center gap-2">
            Get in Touch
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
