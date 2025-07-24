"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Sparkles, 
  Code, 
  Star, 
  Github, 
  GitBranch,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { WEBSITE_NAME } from "@/lib/types";
import { type GithubUserStats } from "@/lib/githubStats";
import RotatingStatsCards from "./components/RotatingStatsCards";

// Client component for rendering stats
function HomeStats({ stats }: { stats: GithubUserStats }) {
  const quickStats = [
    { 
      label: "GitHub Repos", 
      value: `${stats.totalRepos}+`, 
      icon: Github,
      color: "text-blue-600 dark:text-blue-400"
    },
    { 
      label: "Total Stars", 
      value: stats.totalStars > 0 ? `${stats.totalStars}+` : "0", 
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400"
    },
    { 
      label: "Technologies", 
      value: `${stats.topLanguages.length}+`, 
      icon: Code,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    { 
      label: "Experience", 
      value: "4+ Months", 
      icon: GitBranch,
      color: "text-violet-600 dark:text-violet-400"
    },
  ];

  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Quick Stats
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A snapshot of my development activity and contributions
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="text-center p-4 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-muted/50 flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default function HomeContent({ githubStats }: { githubStats: GithubUserStats }) {
  return (
    <>
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
              Get In Touch
              <ExternalLink className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Quick Stats Section */}
      <HomeStats stats={githubStats} />

      {/* Rotating Analytics Section */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            GitHub Analytics Overview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore comprehensive statistics from my development activity
          </p>
        </div>
        <RotatingStatsCards stats={githubStats} autoRotate={true} rotationInterval={2500} />
      </motion.section>

      {/* Featured Cards Section */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            What I Do
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Specializing in modern web development and creating exceptional digital experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Full-Stack Development",
              description: "Building complete web applications with modern technologies like Next.js, React, and Node.js.",
              icon: Code,
              accent: "bg-blue-50 dark:bg-blue-950/20",
              iconColor: "text-blue-600 dark:text-blue-400",
              stats: { label: "Projects", value: "50+" }
            },
            {
              title: "Creative Solutions",
              description: "Designing intuitive user interfaces and implementing innovative features that solve real problems.",
              icon: Star,
              accent: "bg-emerald-50 dark:bg-emerald-950/20",
              iconColor: "text-emerald-600 dark:text-emerald-400",
              stats: { label: "Technologies", value: `${githubStats.topLanguages.length}+` }
            },
            {
              title: "Continuous Learning",
              description: "Always exploring new technologies and best practices to deliver cutting-edge solutions.",
              icon: TrendingUp,
              accent: "bg-violet-50 dark:bg-violet-950/20",
              iconColor: "text-violet-600 dark:text-violet-400",
              stats: { label: "Experience", value: "4+ Months" }
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${card.accent} flex items-center justify-center mb-4`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground">
                      {card.stats.label}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {card.stats.value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let&apos;s collaborate on your next project. I&apos;m passionate about creating innovative solutions that make a difference.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="px-10 py-4 rounded-xl font-semibold text-lg"
          >
            <Link href="/projects" className="flex items-center gap-2">
              Explore My Work
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-10 py-4 rounded-xl font-semibold text-lg border-2"
          >
            <Link href="/contact" className="flex items-center gap-2">
              Start a Conversation
              <ExternalLink className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </>
  );
} 