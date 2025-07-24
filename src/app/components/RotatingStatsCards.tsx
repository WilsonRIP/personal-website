"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  GitFork, 
  Code, 
  Activity, 
  TrendingUp, 
  Award,
  Zap,
  Clock,
  BarChart3,
  GitBranch,
  FileText
} from "lucide-react";
import { GithubUserStats } from "@/lib/githubStats";

interface StatCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface RotatingStatsCardsProps {
  stats: GithubUserStats;
  autoRotate?: boolean;
  rotationInterval?: number;
}

export default function RotatingStatsCards({ 
  stats, 
  autoRotate = true, 
  rotationInterval = 4000 
}: RotatingStatsCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create comprehensive stat cards from all available data
  const statCards: StatCard[] = [
    // Basic Stats
    {
      id: "repositories",
      title: "Total Repositories",
      value: stats.totalRepos.toString(),
      subtitle: `${stats.originalReposCount} original, ${stats.forkedReposCount} forked`,
      icon: Code,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: "stars",
      title: "Total Stars",
      value: stats.totalStars.toString(),
      subtitle: `${stats.averageStars.toFixed(1)} average per repository`,
      icon: Star,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      borderColor: "border-amber-200 dark:border-amber-800"
    },
    {
      id: "forks",
      title: "Total Forks",
      value: stats.totalForks.toString(),
      subtitle: `${stats.averageForks.toFixed(1)} average per repository`,
      icon: GitFork,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    {
      id: "watchers",
      title: "Total Watchers",
      value: stats.totalWatchers.toString(),
      subtitle: `${stats.totalOpenIssues} open issues`,
      icon: Activity,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50 dark:bg-violet-950/20",
      borderColor: "border-violet-200 dark:border-violet-800"
    },
    // Enhanced Stats (if available)
    ...(stats.enhancedDataAvailable ? [
      {
        id: "commits",
        title: "Total Commits",
        value: stats.totalCommits.toString(),
        subtitle: `${stats.averageCommitsPerRepo.toFixed(1)} average per repository`,
        icon: GitBranch,
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
        borderColor: "border-indigo-200 dark:border-indigo-800"
      },
      {
        id: "pull-requests",
        title: "Pull Requests",
        value: stats.totalPullRequests.toString(),
        subtitle: "Total contributions made",
        icon: TrendingUp,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
        borderColor: "border-purple-200 dark:border-purple-800"
      },
      {
        id: "releases",
        title: "Releases",
        value: stats.totalReleases.toString(),
        subtitle: "Published releases",
        icon: Award,
        color: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-rose-50 dark:bg-rose-950/20",
        borderColor: "border-rose-200 dark:border-rose-800"
      }
    ] : []),
    // Language Stats
    {
      id: "languages",
      title: "Programming Languages",
      value: stats.topLanguages.length.toString(),
      subtitle: `${stats.languageBreakdown.length} languages used`,
      icon: FileText,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
      borderColor: "border-cyan-200 dark:border-cyan-800"
    },
    // Repository Size Stats
    {
      id: "repo-size",
      title: "Repository Size",
      value: `${(stats.totalRepoSize / 1024).toFixed(1)} MB`,
      subtitle: `${stats.averageRepoSize.toFixed(1)} KB average per repository`,
      icon: BarChart3,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    // Activity Stats
    {
      id: "activity",
      title: "Development Activity",
      value: stats.mostActiveRepo.commits > 0 ? stats.mostActiveRepo.commits.toString() : "Active",
      subtitle: stats.mostActiveRepo.name || "Ongoing development",
      icon: Zap,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    // Time-based Stats
    {
      id: "experience",
      title: "Development Experience",
      value: `${Math.floor((new Date().getTime() - new Date(stats.earliestRepo).getTime()) / (1000 * 60 * 60 * 24 * 365))} years`,
      subtitle: `Since ${new Date(stats.earliestRepo).getFullYear()}`,
      icon: Clock,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950/20",
      borderColor: "border-slate-200 dark:border-slate-800"
    }
  ];

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate || statCards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statCards.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, statCards.length]);

  // Manual navigation
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % statCards.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + statCards.length) % statCards.length);
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  if (statCards.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No statistics available
      </div>
    );
  }

  const currentCard = statCards[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Card Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative"
          >
            <div className={`
              p-8 rounded-xl border-2 shadow-lg backdrop-blur-sm
              ${currentCard.bgColor} ${currentCard.borderColor}
              transition-all duration-300 hover:shadow-xl
            `}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`
                      p-3 rounded-lg ${currentCard.bgColor}
                      border ${currentCard.borderColor}
                    `}>
                      <currentCard.icon className={`h-6 w-6 ${currentCard.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {currentCard.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentCard.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${currentCard.color}`}>
                  {currentCard.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentCard.title}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {statCards.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 border shadow-lg hover:bg-background transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 border shadow-lg hover:bg-background transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Progress Indicators */}
      {statCards.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {statCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                ${index === currentIndex 
                  ? 'bg-foreground scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }
              `}
            />
          ))}
        </div>
      )}

      {/* Auto-rotate indicator */}
      {autoRotate && statCards.length > 1 && (
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Auto-rotating every {(rotationInterval / 1000).toFixed(1)}s
          </div>
        </div>
      )}

      {/* Card Counter */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        {currentIndex + 1} of {statCards.length} statistics
      </div>
    </div>
  );
} 