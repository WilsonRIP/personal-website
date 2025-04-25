// src/app/projects/components/ProjectsStats.tsx

"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GithubRepo } from "@/lib/github"; // Assuming GithubRepo is defined correctly
// Assuming ActivityEvent type is defined (either imported or inline)
import { ActivityEvent, ActivityEventType } from "@/lib/types"; // Adjust import path
import { useInView } from "react-intersection-observer";
// Make sure you have installed this: npm install @primer/octicons-react
import {
    CodeIcon, CalendarIcon, RepoIcon, GitBranchIcon
} from '@primer/octicons-react';

// Define structure for language stats if not defined elsewhere
interface LanguageStat {
    name: string;
    count: number;
}

// Ensure GithubUserStats interface includes topLanguages if you are using it
// If stats prop is optional and calculated fallback is used, this definition helps type safety
interface GithubUserStats {
    totalRepos: number;
    totalStars: number;
    totalCommits: number;
    earliestRepo: string; // ISO Date string
    latestRepo: string; // ISO Date string
    topLanguages: LanguageStat[];
}

interface ProjectsStatsProps {
    repos: GithubRepo[];
    stats?: GithubUserStats; // stats prop is optional
}

// Helper function to format dates
function formatDate(dateString: string): string { // Explicit return type
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

// Helper function to get a relative time string
function timeAgo(dateString: string): string { // Explicit return type
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
        if (weeks < 5) return `${weeks}w ago`; // Use 5 to avoid showing "4w ago" when it's almost a month
        if (months < 12) return `${months}mo ago`;
        return `${years}y ago`;
    } catch {
        return "some time ago"; // Fallback for invalid dates
    }
}


// --- Main Component ---
export default function ProjectsStats({ repos = [], stats }: ProjectsStatsProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const { ref, inView } = useInView({
        threshold: 0.05,
        triggerOnce: true,
    });

    // --- Data Processing with useMemo ---
    const processedData = useMemo(() => {
        // Define the expected structure for stats_data
        const defaultStatsData: GithubUserStats = {
            totalRepos: 0,
            totalStars: 0,
            totalCommits: 0,
            earliestRepo: new Date().toISOString(), // Default value
            latestRepo: new Date().toISOString(), // Default value
            topLanguages: [],
        };

        if (!repos || repos.length === 0) {
            // Use default structure when repos are empty
            return {
                stats_data: stats || defaultStatsData, // Use provided stats if available even if repos empty
                years: new Set<number>(),
                groupedEventsByYear: {},
                sortedYears: [],
            };
        }

        // --- Start of calculations when repos exist ---
        const activityEvents: ActivityEvent[] = [];
        const years = new Set<number>();
        const oneDay = 24 * 60 * 60 * 1000;

        repos.forEach((repo) => {
            if (!repo || !repo.created_at || !repo.pushed_at) return; // Skip invalid repo data

            const creationDate = new Date(repo.created_at);
            const pushedDate = new Date(repo.pushed_at);
            // Check for valid dates before proceeding
            if (isNaN(creationDate.getTime()) || isNaN(pushedDate.getTime())) return;

            const creationYear = creationDate.getFullYear();
            const pushedYear = pushedDate.getFullYear();

            years.add(creationYear);
            years.add(pushedYear);

            activityEvents.push({ type: 'creation', date: repo.created_at, repo: repo, id: `${repo.id}-created` });

            if (Math.abs(pushedDate.getTime() - creationDate.getTime()) > oneDay) {
                activityEvents.push({ type: 'activity', date: repo.pushed_at, repo: repo, id: `${repo.id}-pushed` });
            } else if (repo.pushed_at !== repo.created_at) {
                 activityEvents.push({ type: 'activity', date: repo.pushed_at, repo: repo, id: `${repo.id}-pushed` });
            }
        });

        activityEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const groupedEventsByYear: Record<number, ActivityEvent[]> = {};
        activityEvents.forEach(event => {
            const year = new Date(event.date).getFullYear();
            if (!groupedEventsByYear[year]) {
                groupedEventsByYear[year] = [];
            }
            groupedEventsByYear[year].push(event);
        });

        const sortedYears = Object.keys(groupedEventsByYear).map(Number).sort((a, b) => b - a);

        // Calculate Stats or use provided stats
        let calculatedStats: GithubUserStats;
        if (stats) {
             calculatedStats = { ...defaultStatsData, ...stats }; // Merge provided stats with defaults
        } else {
             // Calculate stats only if not provided
             calculatedStats = {
                totalRepos: repos.length,
                totalStars: repos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0),
                // Estimate total commits based on repo activity
                totalCommits: repos.reduce((sum, repo) => {
                    // If your GitHub API provides commit counts in any field, you can use that
                    // Here we're estimating based on creation (at least 1) plus any additional activity
                    // A better approach would be to fetch actual commit counts via GitHub API
                    let estimatedCommits = 1; // Every repo has at least one commit
                    
                    // Add extra estimated commits based on repo age and activity
                    if (repo?.created_at && repo?.pushed_at) {
                        const creationDate = new Date(repo.created_at);
                        const lastPushDate = new Date(repo.pushed_at);
                        
                        // If pushed date is different from creation, assume additional commits
                        if (lastPushDate.getTime() > creationDate.getTime()) {
                            // Calculate months between creation and last push
                            const months = Math.max(1, 
                                Math.round((lastPushDate.getTime() - creationDate.getTime()) / (30 * 24 * 60 * 60 * 1000)));
                            
                            // Estimate more commits for older, active repos
                            estimatedCommits += Math.min(50, months * 2); 
                        }
                    }
                    
                    return sum + estimatedCommits;
                }, 0),
                // Ensure reduce starts with a valid repo object
                earliestRepo: repos.reduce( (earliest, repo) =>
                        (!earliest || !repo || !repo.created_at || !earliest.created_at || new Date(repo.created_at) < new Date(earliest.created_at))
                        ? repo : earliest, repos[0] // Use first repo as initial value
                    )?.created_at || defaultStatsData.earliestRepo, // Fallback
                 latestRepo: repos.reduce( (latest, repo) =>
                        (!latest || !repo || !repo.pushed_at || !latest.pushed_at || new Date(repo.pushed_at) > new Date(latest.pushed_at))
                        ? repo : latest, repos[0]
                    )?.pushed_at || defaultStatsData.latestRepo, // Fallback
                topLanguages: [], // Initialize and calculate below
             };

             // Calculate top languages
            const languages: Record<string, number> = {};
            repos.forEach((repo) => {
                if (repo?.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });
            calculatedStats.topLanguages = Object.entries(languages)
                .map(([name, count]): LanguageStat => ({ name, count })) // Explicit return type for map
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
        }

        return {
            stats_data: calculatedStats,
            years,
            groupedEventsByYear,
            sortedYears,
        };
    }, [repos, stats]); // Depend on repos and stats

    // Destructure with default values matching the structure returned by useMemo
    const {
        stats_data = { totalRepos: 0, totalStars: 0, totalCommits: 0, topLanguages: [], earliestRepo: '', latestRepo: '' }, // Ensure stats_data is never undefined
        years = new Set<number>(),
        groupedEventsByYear = {},
        sortedYears = []
    } = processedData || {}; // Add fallback for processedData potentially being undefined briefly


    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // --- Render Logic ---
    // Improved empty state check
    if (repos.length === 0 && !stats?.totalRepos) {
        return (
             <div className="mt-16 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/70 dark:border-slate-700/50 text-center text-slate-500 dark:text-slate-400">
                No GitHub data available to display highlights.
            </div>
        )
    }

    // Helper functions for styling
    const getEventIcon = (type: ActivityEventType, className: string = "w-3 h-3 text-white/90") => {
        switch(type) {
            case 'creation':
                return <RepoIcon className={className} />;
            case 'activity':
                return <GitBranchIcon className={className} />;
            default:
                return <CodeIcon className={className} />;
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-slate-200/70 dark:border-slate-700/50"
        >
            {/* Header */}
             <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">GitHub Activity</h2>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(stats_data.earliestRepo)} - {formatDate(stats_data.latestRepo)}
                </div>
             </div>
             {/* Stats Summary Cards */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 relative border-b border-slate-200/70 dark:border-slate-700/50">
                {/* ... */}
                 {[
                    { label: 'Repositories', value: stats_data.totalRepos, color: 'blue', gradient: 'from-blue-400 to-indigo-500' },
                    { label: 'Stars', value: stats_data.totalStars, color: 'amber', gradient: 'from-amber-400 to-orange-500' },
                    { label: 'Commits', value: stats_data.totalCommits, color: 'green', gradient: 'from-emerald-400 to-teal-500' },
                    { label: 'Active Years', value: years.size, color: 'purple', gradient: 'from-purple-400 to-indigo-500' },
                 ].map((stat) => (
                    <motion.div 
                        key={stat.label} 
                        className={`p-5 rounded-lg shadow-md overflow-hidden relative bg-gradient-to-br ${stat.gradient} dark:bg-opacity-80`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    > 
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-0"></div>
                        <div className="relative z-10 text-center">
                            <div className={`font-flowers-kingdom text-3xl mb-1 bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>{stat.value}</div>
                            <div className="text-sm font-arista uppercase tracking-wider text-slate-700 dark:text-slate-300">{stat.label}</div>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-16 h-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-30 blur-md`}></div>
                    </motion.div>
                 ))}
             </div>

            {/* Tab Navigation */}
             <div className="flex border-b border-slate-200/70 dark:border-slate-700/50">
                <button 
                    className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
                    onClick={() => setActiveTab("overview")}
                >
                    Activity Timeline
                </button>
                <button 
                    className={`px-4 py-2 font-medium ${activeTab === "languages" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
                    onClick={() => setActiveTab("languages")}
                >
                    Languages
                </button>
             </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 relative bg-slate-50/30 dark:bg-slate-800/30">
                {/* ACTIVITY TIMELINE */}
                {activeTab === "overview" && (
                    <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
                        {sortedYears.length > 0 ? sortedYears.map((year) => (
                            <motion.div key={year} className="mb-8" >
                                <div className="flex items-center mb-4">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                                        <CalendarIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">{year} Activity</h3>
                                </div>
                                <div className="space-y-6 ml-6 md:ml-10">
                                    {groupedEventsByYear[year]?.map((event) => (
                                        <motion.div key={event.id} className="flex items-start relative pb-8 mb-2" >
                                            <div className="absolute top-0 bottom-0 left-2.5 w-px bg-slate-200 dark:bg-slate-700"></div>
                                            <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 relative z-10">
                                                {getEventIcon(event.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="font-medium text-slate-800 dark:text-slate-200">
                                                        {event.type === 'creation' ? 'Created' : 'Updated'} 
                                                        <span className="font-semibold ml-1">{event.repo?.name || 'repository'}</span>
                                                    </div>
                                                    {event.repo?.description && (
                                                        <div className="text-sm px-3 py-2 mt-1 border-l-2 border-indigo-400 dark:border-indigo-500 bg-gradient-to-r from-indigo-50/80 to-transparent dark:from-indigo-900/20 dark:to-transparent rounded-r-md font-medium">
                                                            {event.repo.description}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo(event.date)}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )) : ( 
                            <p className="text-slate-500 dark:text-slate-400 italic text-center py-8">No activity data available for this time period.</p> 
                        )}
                    </motion.div>
                )}

                {/* LANGUAGES TAB */}
                {activeTab === "languages" && (
                     <motion.div key="languages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6">Top Languages by Repository Count</h3>
                        {/* Check stats_data.topLanguages before mapping */}
                        {(stats_data.topLanguages && stats_data.topLanguages.length > 0) ? (
                            <div className="space-y-5">
                                {/* Add type annotation here */}
                                {stats_data.topLanguages.map((lang: LanguageStat) => (
                                    <motion.div 
                                        key={lang.name} 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ duration: 0.5 }}>
                                        <div className="flex items-center justify-between mb-1.5 text-sm">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{lang.name}</span>
                                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                                {lang.count} {lang.count === 1 ? "repo" : "repos"}
                                            </span>
                                        </div>
                                        <div className="bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden shadow-inner">
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                // Add safe navigation for count access
                                                animate={{ width: `${(lang.count / (stats_data.topLanguages[0]?.count || 1)) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            ></motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-slate-500 dark:text-slate-400 italic">No language data available.</p>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}