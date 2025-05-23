"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEBSITE_NAME } from "@/lib/types";
import { heroVariants, sectionVariants, cardVariants } from "@/lib/animations";
import Link from "next/link";
import { Saira_Stencil_One } from "next/font/google";
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

const Saira = Saira_Stencil_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-saira-stencil-one",
  display: "swap",
});

// Enhanced loading skeleton with better animations
const LoadingContainer = ({ className }: { className: string }) => (
  <div className={`${className} space-y-6`}>
    <div className="space-y-4">
      <div className="h-12 lg:h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl w-4/5 mx-auto animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-3/5 mx-auto animate-pulse"></div>
    </div>
    <div className="flex gap-4 justify-center">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="h-48 p-6 rounded-2xl shadow-lg bg-card border border-border/50 animate-pulse">
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

// Enhanced featured sections with icons and better styling
const featuredSections = [
  {
    title: "Projects",
    description: "Explore my latest work, personal projects, and technical achievements",
    link: "/projects",
    icon: Code,
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
    hoverGradient: "from-blue-600 via-blue-700 to-indigo-700",
  },
  {
    title: "About",
    description: "Discover my background, skills, and journey as a developer",
    link: "/about",
    icon: User,
    gradient: "from-emerald-500 via-teal-600 to-green-600",
    hoverGradient: "from-emerald-600 via-teal-700 to-green-700",
  },
  {
    title: "Contact",
    description: "Let's connect and discuss potential collaborations or opportunities",
    link: "/contact",
    icon: Mail,
    gradient: "from-violet-500 via-purple-600 to-pink-600",
    hoverGradient: "from-violet-600 via-purple-700 to-pink-700",
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
      <main
        className={
          resolvedTheme === "dark"
            ? "min-h-screen bg-gradient-to-br from-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
            : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
        }
      >
        {/* Enhanced background pattern */}
        <div
          className={
            resolvedTheme === "dark"
              ? "absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"
              : "absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px]"
          }
        ></div>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 lg:px-8">
          <div className="w-full max-w-6xl space-y-16">
            <LoadingContainer className="text-center" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
    <main
      className={
        resolvedTheme === "dark"
          ? "min-h-screen bg-gradient-to-br from-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden"
          : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 relative overflow-hidden"
      }
    >
      {/* Enhanced background elements */}
      <div
        className={
          resolvedTheme === "dark"
            ? "absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px]"
        }
      ></div>
      {/* Animated background blobs */}
      <div
        className={
          resolvedTheme === "dark"
            ? "absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"
            : "absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        }
      ></div>
      <div
        className={
          resolvedTheme === "dark"
            ? "absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"
            : "absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        }
      ></div>
      <div
        className={
          resolvedTheme === "dark"
            ? "absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-green-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"
            : "absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-green-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
        }
      ></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl space-y-16 lg:space-y-20">
          
          {/* Enhanced Hero Section */}
          <motion.div
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            {/* Main title with enhanced styling */}
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4" />
                Welcome to my digital space
              </motion.div>

              <motion.h1
                className={
                  `${
                    resolvedTheme === "dark"
                      ? "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent leading-tight"
                      : "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-black-300 leading-tight"
                  }`
                }
                style={{ fontFamily: "KOMIKAX, sans-serif" }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {WEBSITE_NAME}
              </motion.h1>

              <motion.p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Web & Software Developer</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Creator</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-violet-600 dark:text-violet-400">Problem Solver</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-pink-600 dark:text-pink-400">Vibe Coder</span>
              </motion.p>
            </div>

            {/* Enhanced CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.6, staggerChildren: 0.1 } }
              }}
            >
              <motion.div 
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className={`${Saira.className} px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 border-0`}
                >
                  <Link href="/projects" className="flex items-center gap-2">
                    View Projects
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`${Saira.className} px-8 py-4 font-semibold rounded-xl text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <Link href="/contact">Contact Me</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Featured Sections */}
          <motion.div
            className="w-full"
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <motion.h2 
              className={
                resolvedTheme === "dark"
                  ? "text-3xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                  : "text-3xl lg:text-4xl font-bold text-center mb-12 text-black"
              }
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              Explore My World
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group h-full"
                    custom={index}
                  >
                    <Card className="h-full rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden relative">
                      {/* Card gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      <CardHeader className="relative z-10 pb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 flex-grow pt-0 pb-6">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {section.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="relative z-10 pt-0">
                        <Link
                          href={section.link}
                          className={`group/link flex items-center font-semibold bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent hover:from-current hover:to-current transition-all duration-300`}
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

          {/* Enhanced Footer */}
          <motion.footer 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Built with ❤️ using Next.js and Tailwind CSS
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
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