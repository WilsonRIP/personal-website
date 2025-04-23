"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GithubRepo } from "@/lib/github";
import { GithubUserStats } from "@/lib/githubStats";
import { useInView } from "react-intersection-observer";

interface ProjectsStatsProps {
  repos: GithubRepo[];
  stats?: GithubUserStats;
}

export default function ProjectsStats({ repos, stats }: ProjectsStatsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Calculate active years
  const years = new Set<number>();
  if (repos.length > 0) {
    repos.forEach((repo) => {
      const creationYear = new Date(repo.created_at).getFullYear();
      years.add(creationYear);

      // Also add years of latest updates if different
      const updateYear = new Date(repo.pushed_at).getFullYear();
      years.add(updateYear);
    });
  }

  const stats_data = stats || {
    totalRepos: repos.length,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    earliestRepo:
      repos.length > 0
        ? repos.reduce(
            (earliest, repo) =>
              new Date(repo.created_at) < new Date(earliest)
                ? repo.created_at
                : earliest,
            repos[0].created_at
          )
        : new Date().toISOString(),
    latestRepo:
      repos.length > 0
        ? repos.reduce(
            (latest, repo) =>
              new Date(repo.pushed_at) > new Date(latest)
                ? repo.pushed_at
                : latest,
            repos[0].pushed_at
          )
        : new Date().toISOString(),
    topLanguages: [],
  };

  // Calculate top languages if not provided in stats
  if (!stats && repos.length > 0) {
    const languages: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    stats_data.topLanguages = Object.entries(languages)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="mt-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          GitHub Highlights
        </h2>
        <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Latest Data
        </div>
      </div>

      {/* Stats Summary - Always visible, simplified */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500 blur-3xl"></div>
        </div>

        <motion.div
          variants={itemVariants}
          className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors relative z-10 transform hover:-translate-y-1 hover:shadow-md duration-200"
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors duration-300"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Repositories
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {stats_data.totalRepos}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors relative z-10 transform hover:-translate-y-1 hover:shadow-md duration-200"
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors duration-300"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Stars
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {stats_data.totalStars}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors relative z-10 transform hover:-translate-y-1 hover:shadow-md duration-200"
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors duration-300"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            Forks
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {stats_data.totalForks}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors relative z-10 transform hover:-translate-y-1 hover:shadow-md duration-200"
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors duration-300"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Active Years
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {years.size}
          </p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors ${
              activeTab === "overview"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("languages")}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors ${
              activeTab === "languages"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            }`}
          >
            Languages
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Activity Timeline
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="relative mr-4">
                    <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-md"></div>
                    <div className="w-0.5 h-16 bg-gradient-to-b from-green-500/50 to-blue-500/50 absolute left-2 top-4"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      First Repository
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formatDate(stats_data.earliestRepo)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-md"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Latest Activity
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formatDate(stats_data.latestRepo)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "languages" && (
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Top Programming Languages
              </h3>
              <div className="space-y-5">
                {stats_data.topLanguages.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    className="group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 mr-2 shadow-sm"></span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lang.name}
                        </span>
                      </div>
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                        {lang.count} {lang.count === 1 ? "repo" : "repos"}
                      </span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <motion.div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (lang.count / stats_data.topLanguages[0].count) *
                            100
                          }%`,
                        }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
