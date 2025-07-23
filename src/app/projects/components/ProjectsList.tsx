"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GithubRepo } from "@/lib/github";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar,
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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Show pages 2, 3, 4, 5
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        if (totalPages > 5) {
          pages.push('ellipsis');
        }
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with 2 pages on each side
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div id="projects-section" className="space-y-8">
      {/* Header with Filters */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Repository Showcase
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                {filteredRepos.length}
              </span>
              {filteredRepos.length !== initialRepos.length && (
                <span className="text-sm text-muted-foreground">
                  of {initialRepos.length}
                </span>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            {searchQuery || selectedLanguage !== "all" ? (
              <span>Filtered results</span>
            ) : (
              <span>All repositories</span>
            )}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 p-6 bg-card border rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "updated" | "stars" | "name")}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="stars">Stars</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {currentRepos.map((repo, index) => (
          <ProjectCard key={repo.id} repo={repo} index={index} />
        ))}
      </motion.div>

      {/* No Results State */}
      {filteredRepos.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No repositories found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedLanguage("all");
              setSortBy("updated");
            }}
            variant="outline"
            className="rounded-lg hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:scale-105 transition-transform duration-200"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:scale-105 transition-transform duration-200"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
}

function ProjectCard({ repo, index }: { repo: GithubRepo; index: number }) {
  // Language color mapping
  const getLanguageColor = (language: string | null) => {
    if (!language) return "#8B8B8B";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3 pt-4 px-5">
          {/* Language Badge */}
          {repo.language && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span className="text-xs font-bold px-2 py-1 rounded-full shadow-sm bg-muted">
                  {repo.language}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(repo.pushed_at)}
              </div>
            </div>
          )}

          <CardTitle className="text-lg font-bold text-foreground leading-tight">
            {repo.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-grow px-5 py-0">
          <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {repo.description || "No description provided"}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 px-5 py-4 mt-auto">
          {/* Stats */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {repo.stargazers_count}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                {repo.forks_count}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between w-full gap-3">
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 hover:scale-105 hover:shadow-md rounded-lg transition-all duration-200 group/button"
            >
              <Code className="h-4 w-4 group-hover/button:scale-110 transition-transform duration-200" />
              Code
            </Link>

            {repo.homepage && (
              <Link
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-background bg-foreground hover:bg-foreground/90 hover:scale-105 hover:shadow-lg rounded-lg transition-all duration-200 group/button"
              >
                <Eye className="h-4 w-4 group-hover/button:scale-110 transition-transform duration-200" />
                Live
                <ExternalLink className="h-3 w-3 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}