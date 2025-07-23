"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEBSITE_NAME } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, Code, User, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

// Simple loading skeleton
const LoadingContainer = ({ className }: { className: string }) => (
  <div className={`${className} space-y-6`}>
    <div className="space-y-4">
      <div className="h-12 lg:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5 mx-auto animate-pulse"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/5 mx-auto animate-pulse"></div>
    </div>
    <div className="flex gap-4 justify-center">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="h-48 p-6 rounded-lg shadow-sm bg-card border border-border animate-pulse">
    <div className="space-y-4">
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

// Simplified featured sections
const featuredSections = [
  {
    title: "Projects",
    description: "Explore my latest work, personal projects, and technical achievements",
    link: "/projects",
    icon: Code,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "About",
    description: "Discover my background, skills, and journey as a developer",
    link: "/about",
    icon: User,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  {
    title: "Contact",
    description: "Let's connect and discuss potential collaborations or opportunities",
    link: "/contact",
    icon: Mail,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="w-full max-w-4xl space-y-16">
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
      <div className="container mx-auto px-6 py-12">
        <div className="w-full max-w-4xl mx-auto space-y-16">
          
          {/* Simplified Hero Section */}
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main title */}
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-4 w-4" />
                Welcome to my digital space
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {WEBSITE_NAME}
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="font-semibold text-blue-600 dark:text-blue-400">Web & Software Developer</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Creator</span>
                <span className="mx-2">•</span>
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
                className="px-8 py-3 rounded-lg font-semibold"
              >
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-lg font-semibold"
              >
                <Link href="/contact">Contact Me</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Simplified Featured Sections */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Explore My Work
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group h-full"
                  >
                    <Card className="h-full rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                          <IconComponent className={`h-6 w-6 ${section.color}`} />
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground">
                          {section.title}
                        </CardTitle>
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
          </motion.div>

          {/* Simplified Footer */}
          <motion.footer 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border">
              <span className="text-sm text-muted-foreground">
                Built with Next.js and Tailwind CSS
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                WilsonIIRIP/Luke
              </span>
            </div>
          </motion.footer>
        </div>
      </div>
    </main>
  );
}