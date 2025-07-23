"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEBSITE_NAME } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, Code, User, Mail, Sparkles, Github, ExternalLink, Star, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


// Enhanced loading skeleton
const LoadingContainer = ({ className }: { className: string }) => (
  <div className={`${className} space-y-8`}>
    <div className="space-y-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-64 mx-auto animate-pulse"></div>
      <div className="h-16 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6 mx-auto animate-pulse"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5 mx-auto animate-pulse"></div>
    </div>
    <div className="flex gap-4 justify-center">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 animate-pulse"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 animate-pulse"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="h-64 p-6 rounded-xl shadow-sm bg-card border border-border animate-pulse">
    <div className="space-y-4">
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

// Enhanced featured sections with more details
const featuredSections = [
  {
    title: "Projects",
    description: "Explore my latest work, personal projects, and technical achievements. From full-stack applications to creative coding experiments.",
    link: "/projects",
    icon: Code,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    stats: "50+ Projects",
    accent: "Latest work"
  },
  {
    title: "About",
    description: "Discover my background, skills, and journey as a developer. Learn about my expertise in modern web technologies and creative problem-solving.",
    link: "/about",
    icon: User,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    stats: "4+ Months",
    accent: "My story"
  },
  {
    title: "Contact",
    description: "Let's connect and discuss potential collaborations or opportunities. I'm always open to new projects and interesting conversations.",
    link: "/contact",
    icon: Mail,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    stats: "Always Open",
    accent: "Get in touch"
  },
];

// Quick stats section
const quickStats = [
  { label: "Projects Built", value: "50+", icon: Code },
  { label: "Technologies", value: "20+", icon: Star },
  { label: "GitHub Repos", value: "30+", icon: Github },
  { label: "Experience", value: "4+ Months", icon: GitBranch },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="w-full max-w-6xl mx-auto space-y-20">
            <LoadingContainer className="text-center" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="w-full max-w-6xl mx-auto space-y-20 lg:space-y-24">
          
          {/* Enhanced Hero Section */}
          <motion.section
            className="text-center space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Welcome badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              Welcome to my digital space
            </motion.div>

            {/* Main title */}
            <div className="space-y-8">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {WEBSITE_NAME}
              </motion.h1>

              <motion.p 
                className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="font-semibold text-blue-600 dark:text-blue-400">Web & Software Developer</span>
                <span className="mx-3">•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Creator</span>
                <span className="mx-3">•</span>
                <span className="font-semibold text-violet-600 dark:text-violet-400">Problem Solver</span>
              </motion.p>
            </div>

            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-10 py-4 rounded-xl font-semibold text-lg border-2 hover:bg-muted/50 transition-all duration-300"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  Contact Me
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.section>

          {/* Quick Stats Section */}
          <motion.section
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center p-6 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 mx-auto bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Enhanced Featured Sections */}
          <motion.section
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div className="text-center mb-16">
              <motion.h2 
                className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                Explore My Work
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                Discover my projects, learn about my journey, and get in touch for collaborations
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group h-full"
                  >
                    <Card className="h-full rounded-xl border shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <CardHeader className="pb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-14 h-14 rounded-xl ${section.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-7 w-7 ${section.color}`} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                            {section.accent}
                          </span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">
                          {section.title}
                        </CardTitle>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {section.stats}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-grow pt-0 pb-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {section.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Link
                          href={section.link}
                          className={`group/link flex items-center font-semibold ${section.color} hover:underline transition-all duration-300`}
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Enhanced Footer */}
          <motion.footer 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-muted/50 border">
                <span className="text-sm text-muted-foreground">
                  Built with Next.js and Tailwind CSS
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  WilsonIIRIP/Luke
                </span>
              </div>
              
              <div className="flex justify-center gap-6">
                <a
                  href="https://github.com/WilsonRIP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="/contact"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </div>
            </div>
          </motion.footer>
        </div>
      </div>
    </main>
  );
}