"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { GithubRepo } from "@/lib/github";
import { GithubUserStats } from "@/lib/githubStats";
import { ActivityEvent, ActivityEventType } from "@/lib/types";
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
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RotatingStatsCards from "@/app/components/RotatingStatsCards";

// Types
interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
}



interface ProjectsStatsProps {
  repos: GithubRepo[];
  stats?: GithubUserStats;
}

// Helper functions
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

  // Data processing
  const processedData = useMemo(() => {
    const defaultStatsData: GithubUserStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      totalOpenIssues: 0,
      totalRepos: 0,
      totalRepoSize: 0,
      averageRepoSize: 0,
      forkedReposCount: 0,
      originalReposCount: 0,
      averageStars: 0,
      averageForks: 0,
      averageCommitsPerRepo: 0,
      mostStarredRepo: { name: '', url: '', stars: 0 },
      mostForkedRepo: { name: '', url: '', forks: 0 },
      topLanguages: [],
      earliestRepo: new Date().toISOString(),
      latestRepo: new Date().toISOString(),
      earliestRepoName: '',
      latestRepoName: '',
      totalCommits: 0,
      totalPullRequests: 0,
      totalReleases: 0,
      topTopics: [],
      languageBreakdown: [],
      mostActiveRepo: { name: '', url: '', commits: 0 },
      latestRelease: null,
      enhancedDataAvailable: false,
      rateLimited: false
    };

    if (!repos || repos.length === 0) {
      return {
        stats_data: stats || defaultStatsData,
        years: new Set<number>(),
        groupedEventsByYear: {},
        sortedYears: [],
        languageStats: [],
        productivityScore: 0,
        recentActivity: 0,
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

    // Calculate language statistics
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
        totalStars: repos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0),
        totalForks: repos.reduce((sum, repo) => sum + (repo?.forks_count || 0), 0),
        totalWatchers: repos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0), // Watchers typically same as stars for public repos
        totalOpenIssues: 0, // Would need additional API calls to get this
        totalRepos: repos.length,
        totalRepoSize: 0, // Would need additional API calls to get this
        averageRepoSize: 0,
        forkedReposCount: repos.filter(repo => repo?.fork).length,
        originalReposCount: repos.filter(repo => !repo?.fork).length,
        averageStars: repos.length > 0 ? repos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0) / repos.length : 0,
        averageForks: repos.length > 0 ? repos.reduce((sum, repo) => sum + (repo?.forks_count || 0), 0) / repos.length : 0,
        averageCommitsPerRepo: 0, // Would need additional API calls to get this
        mostStarredRepo: { name: '', url: '', stars: 0 },
        mostForkedRepo: { name: '', url: '', forks: 0 },
        topLanguages: languageStats,
        earliestRepo: repos.reduce((earliest, repo) =>
          (!earliest || !repo || !repo.created_at || !earliest.created_at || 
           new Date(repo.created_at) < new Date(earliest.created_at)) ? repo : earliest, 
          repos[0])?.created_at || defaultStatsData.earliestRepo,
        latestRepo: repos.reduce((latest, repo) =>
          (!latest || !repo || !repo.pushed_at || !latest.pushed_at || 
           new Date(repo.pushed_at) > new Date(latest.pushed_at)) ? repo : latest, 
          repos[0])?.pushed_at || defaultStatsData.latestRepo,
        earliestRepoName: '',
        latestRepoName: '',
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
        totalPullRequests: 0,
        totalReleases: 0,
        topTopics: [],
        languageBreakdown: [],
        mostActiveRepo: { name: '', url: '', commits: 0 },
        latestRelease: null,
        enhancedDataAvailable: false,
        rateLimited: false
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
    groupedEventsByYear,
    sortedYears,
    languageStats,
    productivityScore,
    recentActivity,
  } = processedData;

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
        className="p-8 bg-card border rounded-lg shadow-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No GitHub Data Available
        </h3>
        <p className="text-muted-foreground">
          Unable to display analytics and insights at this time.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header */}
      <motion.div 
        className="px-6 py-6 border-b border-border bg-muted/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                GitHub Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive insights into your development activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(stats_data.earliestRepo)} - {formatDate(stats_data.latestRepo)}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { 
            label: 'Repositories', 
            value: formatNumber(stats_data.totalRepos), 
            icon: Code,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            change: `${stats_data.originalReposCount} original, ${stats_data.forkedReposCount} forked`
          },
          { 
            label: 'Total Stars', 
            value: formatNumber(stats_data.totalStars), 
            icon: Star,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-950/20",
            change: `${stats_data.averageStars.toFixed(1)} avg per repo`
          },
          { 
            label: 'Total Forks', 
            value: formatNumber(stats_data.totalForks), 
            icon: GitFork,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
            change: `${stats_data.averageForks.toFixed(1)} avg per repo`
          },
          { 
            label: 'Watchers', 
            value: formatNumber(stats_data.totalWatchers), 
            icon: Activity,
            color: "text-violet-600 dark:text-violet-400",
            bgColor: "bg-violet-50 dark:bg-violet-950/20",
            change: `${stats_data.totalOpenIssues} open issues`
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="group relative rounded-lg bg-card border p-4 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500 opacity-60" />
              </div>
              
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Productivity Score */}
      <motion.div 
        className="px-6 py-4 border-b border-border bg-emerald-50/30 dark:bg-emerald-950/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Portfolio Quality Score</h3>
              <p className="text-sm text-muted-foreground">Based on documentation, diversity, and engagement</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{productivityScore}</div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Quality Assessment</span>
            <span>{productivityScore}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${productivityScore}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Rotating Stats Cards */}
      <motion.div 
        className="px-6 py-6 border-b border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Comprehensive Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore all your GitHub statistics with rotating cards
          </p>
        </div>
        <RotatingStatsCards stats={stats_data} autoRotate={true} rotationInterval={3000} />
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="border-b border-border bg-muted/30">
          <TabsList className="grid w-full grid-cols-5 h-auto bg-transparent border-0 p-0">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-6 py-4 font-medium text-sm data-[state=active]:bg-background data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Clock className="h-4 w-4" />
              Activity Timeline
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center gap-2 px-6 py-4 font-medium text-sm data-[state=active]:bg-background data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Code className="h-4 w-4" />
              Languages
            </TabsTrigger>
            <TabsTrigger value="repositories" className="flex items-center gap-2 px-6 py-4 font-medium text-sm data-[state=active]:bg-background data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <GitFork className="h-4 w-4" />
              Repository Details
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="flex items-center gap-2 px-6 py-4 font-medium text-sm data-[state=active]:bg-background data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <BarChart3 className="h-4 w-4" />
              Enhanced Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2 px-6 py-4 font-medium text-sm data-[state=active]:bg-background data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Zap className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6 min-h-[400px] bg-muted/10">
          {/* Activity Timeline */}
          <TabsContent value="overview" className="mt-0">
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-sm">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{year}</h3>
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm text-muted-foreground">
                    {(groupedEventsByYear as Record<number, ActivityEvent[]>)[year]?.length || 0} events
                  </span>
                </div>
                
                <div className="space-y-4 ml-10">
                  {((groupedEventsByYear as Record<number, ActivityEvent[]>)[year] || []).map((event: ActivityEvent, index: number) => (
                    <motion.div
                      key={event.id}
                      className="group relative flex items-start gap-4 p-4 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex-shrink-0">
                        {getEventIcon(event.type, "w-4 h-4 text-blue-600 dark:text-blue-400")}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="font-semibold text-foreground">
                              {event.type === 'creation' ? 'Created' : 'Updated'} 
                              <span className="text-blue-600 dark:text-blue-400 ml-1">
                                {event.repo?.name || 'repository'}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {timeAgo(event.date)}
                            </div>
                          </div>
                          
                          {event.repo && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border-l-4 border-blue-500">
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
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activity data available</p>
              </div>
            )}
          </motion.div>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="mt-0">
          <motion.div
            key="languages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Programming Languages</h3>
              <span className="text-sm text-muted-foreground">
                {languageStats.length} languages used
              </span>
            </div>

            {languageStats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {languageStats.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    className="p-4 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-300"
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
                        <span className="font-semibold text-foreground">
                          {lang.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">
                          {lang.count} repos
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lang.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
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
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No language data available</p>
              </div>
            )}
          </motion.div>
          </TabsContent>

          {/* Repository Details Tab */}
          <TabsContent value="repositories" className="mt-0">
          <motion.div
            key="repositories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Repository Analytics</h3>
              <span className="text-sm text-muted-foreground">
                Detailed repository metrics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Repository Size Stats */}
              <motion.div
                className="p-6 rounded-lg bg-card border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Repository Size</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total size</span>
                    <span className="font-medium text-foreground">
                      {stats_data.totalRepoSize > 0 ? `${(stats_data.totalRepoSize / 1024).toFixed(1)} MB` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average size</span>
                    <span className="font-medium text-foreground">
                      {stats_data.averageRepoSize > 0 ? `${(stats_data.averageRepoSize / 1024).toFixed(1)} MB` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average commits</span>
                    <span className="font-medium text-foreground">
                      {stats_data.averageCommitsPerRepo > 0 ? stats_data.averageCommitsPerRepo.toFixed(0) : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Top Repositories */}
              <motion.div
                className="p-6 rounded-lg bg-card border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <Star className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Top Repositories</h4>
                </div>
                
                <div className="space-y-3">
                  {stats_data.mostStarredRepo.name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Most starred</span>
                      <a 
                        href={stats_data.mostStarredRepo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {stats_data.mostStarredRepo.name} ({stats_data.mostStarredRepo.stars})
                      </a>
                    </div>
                  )}
                  {stats_data.mostForkedRepo.name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Most forked</span>
                      <a 
                        href={stats_data.mostForkedRepo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {stats_data.mostForkedRepo.name} ({stats_data.mostForkedRepo.forks})
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Repository Timeline */}
              <motion.div
                className="p-6 rounded-lg bg-card border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Repository Timeline</h4>
                </div>
                
                <div className="space-y-3">
                  {stats_data.earliestRepoName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Earliest repo</span>
                      <span className="font-medium text-foreground">
                        {stats_data.earliestRepoName}
                      </span>
                    </div>
                  )}
                  {stats_data.latestRepoName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Latest repo</span>
                      <span className="font-medium text-foreground">
                        {stats_data.latestRepoName}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total commits</span>
                    <span className="font-medium text-foreground">
                      {formatNumber(stats_data.totalCommits)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Repository Types */}
              <motion.div
                className="p-6 rounded-lg bg-card border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/20">
                    <GitFork className="h-5 w-5 text-violet-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Repository Types</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original repos</span>
                    <span className="font-medium text-foreground">
                      {stats_data.originalReposCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Forked repos</span>
                    <span className="font-medium text-foreground">
                      {stats_data.forkedReposCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Open issues</span>
                    <span className="font-medium text-foreground">
                      {stats_data.totalOpenIssues}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="enhanced" className="mt-0">
          <motion.div
            key="enhanced"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Enhanced Analytics</h3>
              <span className="text-sm text-muted-foreground">
                Advanced GitHub metrics and insights
              </span>
            </div>

            {/* Rate Limiting Notice */}
            {stats_data.rateLimited && (
              <motion.div
                className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">GitHub Rate Limited</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Enhanced analytics are temporarily unavailable due to GitHub API rate limits. Basic statistics are still available.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enhanced Data Unavailable Message */}
              {!stats_data.enhancedDataAvailable && !stats_data.rateLimited && (
                <motion.div
                  className="col-span-2 p-8 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Enhanced Analytics Unavailable</h4>
                      <p className="text-sm text-muted-foreground">
                        Enhanced analytics require additional GitHub API calls. This feature is only available when using the enhanced GitHub stats.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Data Content */}
              {stats_data.enhancedDataAvailable && (
                <>
                  {/* Pull Requests & Releases */}
                  <motion.div
                    className="p-6 rounded-lg bg-card border shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <GitFork className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-foreground">Contributions</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pull Requests</span>
                        <span className="font-medium text-foreground">
                          {formatNumber(stats_data.totalPullRequests)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Releases</span>
                        <span className="font-medium text-foreground">
                          {formatNumber(stats_data.totalReleases)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Commits</span>
                        <span className="font-medium text-foreground">
                          {formatNumber(stats_data.totalCommits)}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Most Active Repository */}
                  <motion.div
                    className="p-6 rounded-lg bg-card border shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <Activity className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h4 className="font-semibold text-foreground">Most Active Repo</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {stats_data.mostActiveRepo.name ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Repository</span>
                          <a 
                            href={stats_data.mostActiveRepo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {stats_data.mostActiveRepo.name}
                          </a>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Repository</span>
                          <span className="font-medium text-foreground">N/A</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Commits</span>
                        <span className="font-medium text-foreground">
                          {formatNumber(stats_data.mostActiveRepo.commits)}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Repository Topics */}
                  <motion.div
                    className="p-6 rounded-lg bg-card border shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <Code className="h-5 w-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-foreground">Top Topics</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {stats_data.topTopics.length > 0 ? (
                        stats_data.topTopics.slice(0, 5).map((topic) => (
                          <div key={topic.name} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{topic.name}</span>
                            <span className="font-medium text-foreground">
                              {topic.count} repos
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No topics found</div>
                      )}
                    </div>
                  </motion.div>

                  {/* Language Breakdown by Bytes */}
                  <motion.div
                    className="p-6 rounded-lg bg-card border shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-foreground">Language Breakdown</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {stats_data.languageBreakdown.length > 0 ? (
                        stats_data.languageBreakdown.slice(0, 5).map((lang, index) => (
                          <div key={lang.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{lang.name}</span>
                              <span className="font-medium text-foreground">
                                {lang.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: getLanguageColor(lang.name) }}
                                initial={{ width: 0 }}
                                animate={{ width: `${lang.percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No language data available</div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-0">
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Portfolio Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documentation Quality */}
              <motion.div
                className="p-6 rounded-lg bg-card border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Documentation</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">With descriptions</span>
                    <span className="font-medium text-foreground">
                      {repos.filter(r => r.description).length}/{repos.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">With live demos</span>
                    <span className="font-medium text-foreground">
                      {repos.filter(r => r.homepage).length}/{repos.length}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Activity Patterns */}
              <motion.div
                className="p-6 rounded-lg bg-card border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-foreground">Activity</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recent updates</span>
                    <span className="font-medium text-foreground">
                      {recentActivity} this month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average stars</span>
                    <span className="font-medium text-foreground">
                      {repos.length > 0 ? (stats_data.totalStars / repos.length).toFixed(1) : '0'} per repo
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}