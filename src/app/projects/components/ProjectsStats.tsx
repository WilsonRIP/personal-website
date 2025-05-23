"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubRepo } from "@/lib/github";
import { ActivityEvent, ActivityEventType } from "@/lib/types";
import { useInView } from "react-intersection-observer";
import {
  TrendingUp,
  Calendar,
  Star,
  GitFork,
  Code,
  Activity,
  BarChart3,
  Clock,
  Award,
  Zap,
  Target
} from "lucide-react";

// Types
interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
}

interface GithubUserStats {
  totalRepos: number;
  totalStars: number;
  totalCommits: number;
  earliestRepo: string;
  latestRepo: string;
  topLanguages: LanguageStat[];
}

interface ProjectsStatsProps {
  repos: GithubRepo[];
  stats?: GithubUserStats;
}

// Enhanced helper functions
function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
}

function timeAgo(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 5) return `${weeks}w ago`;
    if (months < 12) return `${months}mo ago`;
    return `${years}y ago`;
  } catch {
    return "some time ago";
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Language color mapping
const getLanguageColor = (language: string): string => {
  const colorMap: Record<string, string> = {
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6", 
    Python: "#3776AB",
    Java: "#007396",
    "C#": "#239120",
    PHP: "#777BB4",
    "C++": "#00599C",
    Ruby: "#CC342D",
    Swift: "#F05138",
    Go: "#00ADD8",
    Kotlin: "#7F52FF",
    Rust: "#DEA584",
    HTML: "#E34F26",
    CSS: "#1572B6",
    Shell: "#89E051",
    Vue: "#4FC08D",
    React: "#61DAFB",
  };
  return colorMap[language] || "#8B8B8B";
};

export default function ProjectsStats({ repos = [], stats }: ProjectsStatsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "languages" | "insights">("overview");
  const { ref, inView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  // Enhanced data processing
  const processedData = useMemo(() => {
    const defaultStatsData: GithubUserStats = {
      totalRepos: 0,
      totalStars: 0,
      totalCommits: 0,
      earliestRepo: new Date().toISOString(),
      latestRepo: new Date().toISOString(),
      topLanguages: [],
    };

    if (!repos || repos.length === 0) {
      return {
        stats_data: stats || defaultStatsData,
        years: new Set<number>(),
        groupedEventsByYear: {},
        sortedYears: [],
        languageStats: [],
        productivityScore: 0,
        recentActivity: [],
      };
    }

    // Calculate activity events
    const activityEvents: ActivityEvent[] = [];
    const years = new Set<number>();
    const oneDay = 24 * 60 * 60 * 1000;

    repos.forEach((repo) => {
      if (!repo || !repo.created_at || !repo.pushed_at) return;

      const creationDate = new Date(repo.created_at);
      const pushedDate = new Date(repo.pushed_at);
      
      if (isNaN(creationDate.getTime()) || isNaN(pushedDate.getTime())) return;

      const creationYear = creationDate.getFullYear();
      const pushedYear = pushedDate.getFullYear();

      years.add(creationYear);
      years.add(pushedYear);

      activityEvents.push({ 
        type: 'creation', 
        date: repo.created_at, 
        repo: repo, 
        id: `${repo.id}-created` 
      });

      if (Math.abs(pushedDate.getTime() - creationDate.getTime()) > oneDay) {
        activityEvents.push({ 
          type: 'activity', 
          date: repo.pushed_at, 
          repo: repo, 
          id: `${repo.id}-pushed` 
        });
      }
    });

    activityEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Group events by year
    const groupedEventsByYear: Record<number, ActivityEvent[]> = {};
    activityEvents.forEach(event => {
      const year = new Date(event.date).getFullYear();
      if (!groupedEventsByYear[year]) {
        groupedEventsByYear[year] = [];
      }
      groupedEventsByYear[year].push(event);
    });

    const sortedYears = Object.keys(groupedEventsByYear).map(Number).sort((a, b) => b - a);

    // Calculate enhanced language statistics
    const languages: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo?.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const totalReposWithLanguages = Object.values(languages).reduce((sum, count) => sum + count, 0);
    const languageStats = Object.entries(languages)
      .map(([name, count]): LanguageStat => ({ 
        name, 
        count, 
        percentage: (count / totalReposWithLanguages) * 100 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Calculate productivity score (0-100)
    const avgStarsPerRepo = repos.length > 0 ? repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) / repos.length : 0;
    const reposWithDescription = repos.filter(repo => repo.description).length;
    const reposWithHomepage = repos.filter(repo => repo.homepage).length;
    const languageDiversity = Object.keys(languages).length;
    
    const productivityScore = repos.length > 0 ? Math.min(100, Math.round(
      (avgStarsPerRepo * 10) + 
      ((reposWithDescription / repos.length) * 25) +
      ((reposWithHomepage / repos.length) * 15) +
      (languageDiversity * 2)
    )) : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = repos.filter(repo => 
      new Date(repo.pushed_at) > thirtyDaysAgo
    ).length;

    // Calculate or use provided stats
    let calculatedStats: GithubUserStats;
    if (stats) {
      calculatedStats = { ...defaultStatsData, ...stats };
    } else {
      calculatedStats = {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0),
        totalCommits: repos.reduce((sum, repo) => {
          let estimatedCommits = 1;
          if (repo?.created_at && repo?.pushed_at) {
            const creationDate = new Date(repo.created_at);
            const lastPushDate = new Date(repo.pushed_at);
            if (lastPushDate.getTime() > creationDate.getTime()) {
              const months = Math.max(1, 
                Math.round((lastPushDate.getTime() - creationDate.getTime()) / (30 * 24 * 60 * 60 * 1000)));
              estimatedCommits += Math.min(50, months * 2);
            }
          }
          return sum + estimatedCommits;
        }, 0),
        earliestRepo: repos.reduce((earliest, repo) =>
          (!earliest || !repo || !repo.created_at || !earliest.created_at || 
           new Date(repo.created_at) < new Date(earliest.created_at)) ? repo : earliest, 
          repos[0])?.created_at || defaultStatsData.earliestRepo,
        latestRepo: repos.reduce((latest, repo) =>
          (!latest || !repo || !repo.pushed_at || !latest.pushed_at || 
           new Date(repo.pushed_at) > new Date(latest.pushed_at)) ? repo : latest, 
          repos[0])?.pushed_at || defaultStatsData.latestRepo,
        topLanguages: languageStats,
      };
    }

    return {
      stats_data: calculatedStats,
      years,
      groupedEventsByYear,
      sortedYears,
      languageStats,
      productivityScore,
      recentActivity,
    };
  }, [repos, stats]);

  const {
    stats_data,
    years,
    groupedEventsByYear,
    sortedYears,
    languageStats,
    productivityScore,
    recentActivity,
  } = processedData;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Get event icon
  const getEventIcon = (type: ActivityEventType, className: string = "w-3 h-3") => {
    switch(type) {
      case 'creation':
        return <Code className={className} />;
      case 'activity':
        return <Activity className={className} />;
      default:
        return <Code className={className} />;
    }
  };

  // Early return for no data
  if (repos.length === 0 && !stats?.totalRepos) {
    return (
      <motion.div 
        className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <BarChart3 className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No GitHub Data Available
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Unable to display analytics and insights at this time.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
    >
      {/* Enhanced Header */}
      <motion.div 
        className="px-6 py-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-700/50"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                GitHub Analytics
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive insights into your development activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(stats_data.earliestRepo)} - {formatDate(stats_data.latestRepo)}</span>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-slate-200/50 dark:border-slate-700/50"
        variants={itemVariants}
      >
        {[
          { 
            label: 'Repositories', 
            value: formatNumber(stats_data.totalRepos), 
            icon: Code,
            gradient: 'from-blue-500 to-indigo-600',
            change: recentActivity > 0 ? `+${recentActivity} this month` : 'No recent activity'
          },
          { 
            label: 'Total Stars', 
            value: formatNumber(stats_data.totalStars), 
            icon: Star,
            gradient: 'from-amber-500 to-orange-600',
            change: repos.length > 0 ? `${(stats_data.totalStars / repos.length).toFixed(1)} avg per repo` : 'No repos'
          },
          { 
            label: 'Commits', 
            value: formatNumber(stats_data.totalCommits), 
            icon: Activity,
            gradient: 'from-emerald-500 to-teal-600',
            change: repos.length > 0 ? `${(stats_data.totalCommits / repos.length).toFixed(0)} avg per repo` : 'No repos'
          },
          { 
            label: 'Languages', 
            value: languageStats.length.toString(), 
            icon: Target,
            gradient: 'from-purple-500 to-pink-600',
            change: `${years.size} active years`
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-600/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500 opacity-60" />
                </div>
                
                <div className="space-y-1">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.change}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Productivity Score */}
      <motion.div 
        className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/20"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Portfolio Quality Score</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Based on documentation, diversity, and engagement</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{productivityScore}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">out of 100</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
            <span>Quality Assessment</span>
            <span>{productivityScore}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${productivityScore}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tab Navigation */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
        {[
          { id: 'overview', label: 'Activity Timeline', icon: Clock },
          { id: 'languages', label: 'Languages', icon: Code },
          { id: 'insights', label: 'Insights', icon: Zap },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all duration-200 relative ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab(tab.id as "overview" | "languages" | "insights")}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="activeTab"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Enhanced Tab Content */}
      <div className="p-6 min-h-[400px] bg-gradient-to-br from-slate-50/30 to-white/30 dark:from-slate-800/30 dark:to-slate-700/30">
        <AnimatePresence mode="wait">
          {/* Activity Timeline */}
          {activeTab === "overview" && (
            <motion.div
              key="timeline"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {sortedYears.length > 0 ? sortedYears.map((year) => (
                <motion.div 
                  key={year} 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{year}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600"></div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {(groupedEventsByYear as Record<number, ActivityEvent[]>)[year]?.length || 0} events
                    </span>
                  </div>
                  
                  <div className="space-y-4 ml-10">
                    {((groupedEventsByYear as Record<number, ActivityEvent[]>)[year] || []).map((event: ActivityEvent, index: number) => (
                      <motion.div
                        key={event.id}
                        className="group relative flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/30 flex-shrink-0">
                          {getEventIcon(event.type, "w-4 h-4 text-blue-600 dark:text-blue-400")}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-white">
                                {event.type === 'creation' ? 'Created' : 'Updated'} 
                                <span className="text-blue-600 dark:text-blue-400 ml-1">
                                  {event.repo?.name || 'repository'}
                                </span>
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {timeAgo(event.date)}
                              </div>
                            </div>
                            
                            {event.repo && (
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  {event.repo.stargazers_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GitFork className="h-3 w-3" />
                                  {event.repo.forks_count}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {event.repo?.description && (
                            <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border-l-4 border-blue-500">
                              {event.repo.description}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">No activity data available</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Languages Tab */}
          {activeTab === "languages" && (
            <motion.div
              key="languages"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Programming Languages</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {languageStats.length} languages used
                </span>
              </div>

              {languageStats.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {languageStats.map((lang, index) => (
                    <motion.div
                      key={lang.name}
                      className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: getLanguageColor(lang.name) }}
                          />
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {lang.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {lang.count} repos
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {lang.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: getLanguageColor(lang.name) }}
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Code className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">No language data available</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Insights Tab */}
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Portfolio Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Documentation Quality */}
                <motion.div
                  className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">Documentation</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">With descriptions</span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {repos.filter(r => r.description).length}/{repos.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">With live demos</span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {repos.filter(r => r.homepage).length}/{repos.length}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Activity Patterns */}
                <motion.div
                  className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">Activity</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Recent updates</span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {recentActivity} this month
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Average stars</span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {repos.length > 0 ? (stats_data.totalStars / repos.length).toFixed(1) : '0'} per repo
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}