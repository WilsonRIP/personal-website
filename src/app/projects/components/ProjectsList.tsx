"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GithubRepo } from "@/lib/github";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  Filter,
  Search,
  Code,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsListProps {
  initialRepos: GithubRepo[];
}

export default function ProjectsList({ initialRepos }: ProjectsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name">("updated");
  
  const reposPerPage = 6;

  // Get unique languages for filter
  const languages = useMemo(() => {
    const langs = new Set(
      initialRepos
        .map(repo => repo.language)
        .filter((lang): lang is string => Boolean(lang))
    );
    return Array.from(langs).sort();
  }, [initialRepos]);

  // Filter and sort repositories
  const filteredRepos = useMemo(() => {
    const filtered = initialRepos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = selectedLanguage === "all" || repo.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });

    // Sort repositories
    switch (sortBy) {
      case "stars":
        filtered.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "updated":
      default:
        filtered.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
        break;
    }

    return filtered;
  }, [initialRepos, searchQuery, selectedLanguage, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLanguage, sortBy]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById("projects-section")?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

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

  return (
    <div id="projects-section" className="space-y-8">
      {/* Enhanced Header with Filters */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm">
                <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                Repository Showcase
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                {filteredRepos.length}
              </span>
              {filteredRepos.length !== initialRepos.length && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  of {initialRepos.length}
                </span>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {searchQuery || selectedLanguage !== "all" ? (
              <span>Filtered results</span>
            ) : (
              <span>All repositories</span>
            )}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          variants={itemVariants}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[120px]"
            >
              <option value="all">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "updated" | "stars" | "name")}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="updated">Last Updated</option>
              <option value="stars">Stars</option>
              <option value="name">Name</option>
            </select>
          </div>
        </motion.div>
      </motion.div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPage}-${searchQuery}-${selectedLanguage}-${sortBy}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {currentRepos.map((repo, index) => (
            <ProjectCard key={repo.id} repo={repo} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results State */}
      {filteredRepos.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No repositories found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedLanguage("all");
              setSortBy("updated");
            }}
            variant="outline"
            className="rounded-xl"
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <nav className="inline-flex items-center rounded-2xl shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 border border-slate-200/50 dark:border-slate-700/50">
            {/* Previous Button */}
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="ghost"
              size="sm"
              className="rounded-xl px-3 py-2 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center mx-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    className={`w-10 h-10 rounded-xl mx-1 ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white shadow-lg"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="ghost"
              size="sm"
              className="rounded-xl px-3 py-2 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </motion.div>
      )}
    </div>
  );
}

function ProjectCard({ repo, index }: { repo: GithubRepo; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  // Enhanced language color mapping
  const getLanguageColor = (language: string | null) => {
    if (!language) return { bg: "#8B8B8B", text: "#FFFFFF" };

    const colorMap: Record<string, { bg: string; text: string }> = {
      JavaScript: { bg: "#F7DF1E", text: "#000000" },
      TypeScript: { bg: "#3178C6", text: "#FFFFFF" },
      Python: { bg: "#3776AB", text: "#FFFFFF" },
      Java: { bg: "#007396", text: "#FFFFFF" },
      "C#": { bg: "#239120", text: "#FFFFFF" },
      PHP: { bg: "#777BB4", text: "#FFFFFF" },
      "C++": { bg: "#00599C", text: "#FFFFFF" },
      Ruby: { bg: "#CC342D", text: "#FFFFFF" },
      Swift: { bg: "#F05138", text: "#FFFFFF" },
      Go: { bg: "#00ADD8", text: "#FFFFFF" },
      Kotlin: { bg: "#7F52FF", text: "#FFFFFF" },
      Rust: { bg: "#DEA584", text: "#000000" },
      HTML: { bg: "#E34F26", text: "#FFFFFF" },
      CSS: { bg: "#1572B6", text: "#FFFFFF" },
      Shell: { bg: "#89E051", text: "#000000" },
      Vue: { bg: "#4FC08D", text: "#FFFFFF" },
      React: { bg: "#61DAFB", text: "#000000" },
    };

    return colorMap[language] || { bg: "#8B8B8B", text: "#FFFFFF" };
  };

  const languageColors = getLanguageColor(repo.language);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}mo ago`;
    return `${Math.ceil(diffDays / 365)}y ago`;
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <Card className="group relative overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-[1.02]">
        {/* Enhanced background gradient */}
        <div
          className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full opacity-5 group-hover:opacity-15 blur-2xl transition-all duration-500"
          style={{ backgroundColor: languageColors.bg }}
        />

        <CardHeader className="relative z-10 pb-3 pt-4 px-5">
          {/* Language Badge */}
          {repo.language && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: languageColors.bg }}
                />
                <span 
                  className="text-xs font-bold px-2 py-1 rounded-full shadow-sm"
                  style={{
                    backgroundColor: languageColors.bg,
                    color: languageColors.text
                  }}
                >
                  {repo.language}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(repo.pushed_at)}
              </div>
            </div>
          )}

          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
            {repo.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex-grow px-5 py-0">
          <CardDescription className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
            {repo.description || "No description provided"}
          </CardDescription>
        </CardContent>

        <CardFooter className="relative z-10 flex flex-col gap-4 px-5 py-4 mt-auto">
          {/* Stats */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300">
                <Star className="h-3.5 w-3.5" />
                {repo.stargazers_count}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                <GitFork className="h-3.5 w-3.5" />
                {repo.forks_count}
              </span>
            </div>
            
            {/* Quality indicators */}
            <div className="flex items-center gap-1">
              {repo.stargazers_count > 5 && (
                <div className="w-2 h-2 rounded-full bg-amber-400" title="Popular repository" />
              )}
              {repo.description && (
                <div className="w-2 h-2 rounded-full bg-green-400" title="Well documented" />
              )}
              {repo.homepage && (
                <div className="w-2 h-2 rounded-full bg-blue-400" title="Has live demo" />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between w-full gap-3">
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200"
            >
              <Code className="h-4 w-4" />
              Code
            </Link>

            {repo.homepage && (
              <Link
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
              >
                <Eye className="h-4 w-4" />
                Live
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}