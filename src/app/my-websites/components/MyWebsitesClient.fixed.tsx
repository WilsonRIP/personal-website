"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Website, websites } from "../data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Star,
  Code,
  Filter,
  Grid3X3,
  List,
  Search,
  Sparkles,
  Globe,
  Eye,
  ArrowUpRight,
  Award
} from "lucide-react";
import { useTheme } from "next-themes";

// Enhanced Configuration
const ANIMATION_CONFIG = {
  duration: 0.6,
  stagger: 0.1,
  spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;

type ViewMode = "grid" | "list";

// Loading skeleton component
const WebsiteCardSkeleton = () => (
  <div className="h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 animate-pulse">
    <div className="p-6 space-y-4">
      <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        ))}
      </div>
    </div>
  </div>
);

// Main Component
export default function MyWebsitesClient() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "title" | "recent">("featured");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique technologies for filter
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    websites.forEach(website => {
      website.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  // Filter and sort websites
  const filteredWebsites = useMemo(() => {
    const filtered = websites.filter(website => {
      const matchesSearch = website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          website.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTech = selectedTech === "all" || website.technologies.includes(selectedTech);
      return matchesSearch && matchesTech;
    });

    // Sort websites
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => Number(b.featured || false) - Number(a.featured || false));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return filtered;
  }, [searchQuery, selectedTech, sortBy]);

  const featuredWebsites = filteredWebsites.filter(website => website.featured);
  const regularWebsites = filteredWebsites.filter(website => !website.featured);

  if (!mounted) {
    return (
      <main className={
        resolvedTheme === "dark"
          ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
      }>
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <WebsiteCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: ANIMATION_CONFIG.duration,
        staggerChildren: ANIMATION_CONFIG.stagger
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className={
      resolvedTheme === "dark"
        ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
    }>
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-green-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Header */}
          <motion.header className="text-center space-y-6" variants={itemVariants}>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Portfolio Showcase
              </div>

              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight"
                style={{ fontFamily: "KOMIKAX, sans-serif" }}
              >
                My Websites
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                A curated collection of websites I&apos;ve designed and developed, showcasing my expertise in 
                <span className="font-semibold text-purple-600 dark:text-purple-400"> modern web development</span> and 
                <span className="font-semibold text-blue-600 dark:text-blue-400"> creative design</span>.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{websites.length}</div>
                <div className="text-slate-500 dark:text-slate-400">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{featuredWebsites.length}</div>
                <div className="text-slate-500 dark:text-slate-400">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{allTechnologies.length}</div>
                <div className="text-slate-500 dark:text-slate-400">Technologies</div>
              </div>
            </div>
          </motion.header>

          {/* Enhanced Controls */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            variants={itemVariants}
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Tech Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-w-[140px]"
              >
                <option value="all">All Technologies</option>
                {allTechnologies.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "title" | "recent")}
                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="featured">Featured First</option>
                <option value="title">Title</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "px-4 py-3 flex items-center gap-2 text-sm font-medium transition-all duration-200",
                  viewMode === "grid"
                    ? "bg-purple-500 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-4 py-3 flex items-center gap-2 text-sm font-medium transition-all duration-200",
                  viewMode === "list"
                    ? "bg-purple-500 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div className="flex items-center justify-between" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {searchQuery || selectedTech !== "all" ? "Search Results" : "All Projects"}
              </h2>
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
                {filteredWebsites.length}
              </span>
            </div>
            {(searchQuery || selectedTech !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTech("all");
                }}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                Clear filters
              </Button>
            )}
          </motion.div>

          {/* Featured Website Section */}
          {featuredWebsites.length > 0 && (
            <motion.section className="space-y-6" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Featured Projects</h3>
              </div>

              <div className="space-y-6">
                {featuredWebsites.map((website, index) => (
                  <FeaturedWebsiteCard key={website.id} website={website} index={index} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Regular Websites Grid/List */}
          {regularWebsites.length > 0 && (
            <motion.section className="space-y-6" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Other Projects</h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {regularWebsites.map((website, index) => (
                    <WebsiteCard 
                      key={website.id} 
                      website={website} 
                      index={index} 
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.section>
          )}

          {/* No Results State */}
          {filteredWebsites.length === 0 && (
            <motion.div
              className="text-center py-16"
              variants={itemVariants}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No websites found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTech("all");
                  setSortBy("featured");
                }}
                variant="outline"
                className="rounded-xl"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

// Enhanced Featured Website Card
function FeaturedWebsiteCard({ website, index }: { website: Website; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ...ANIMATION_CONFIG.spring
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Background gradient */}
        <div
          className={cn(
            "absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 group-hover:opacity-20 blur-3xl transition-all duration-500",
            website.color || "bg-gradient-to-br from-purple-500 to-pink-500"
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 relative z-10">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Live
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                {website.title}
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {website.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Code className="h-4 w-4" />
                Built with
              </div>
              <div className="flex flex-wrap gap-2">
                {website.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                asChild
                className="group/btn bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 border-0 px-8 py-3 rounded-xl text-base"
              >
                <Link href={website.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-5 w-5 mr-2" />
                  <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
                    Visit Website
                  </span>
                  <ArrowUpRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg group-hover:shadow-xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              <Image
                src={website.imageUrl}
                alt={website.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/640x360?text=Website+Preview";
                  target.onerror = null;
                }}
              />

              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="sm" className="bg-white/90 text-slate-800 hover:bg-white rounded-xl">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Regular Website Card
function WebsiteCard({ 
  website, 
  index, 
  viewMode 
}: { 
  website: Website; 
  index: number; 
  viewMode: ViewMode;
}) {
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

  if (viewMode === "list") {
    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="group relative"
      >
        <div className="flex gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative w-48 aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <Image
              src={website.imageUrl}
              alt={website.title}
              fill
              sizes="192px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/640x360?text=Website+Preview";
                target.onerror = null;
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                {website.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                {website.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {website.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                >
                  {tech}
                </span>
              ))}
              {website.technologies.length > 4 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                  +{website.technologies.length - 4}
                </span>
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950/50 dark:hover:border-purple-700"
            >
              <Link href={website.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative"
    >
      <div className="relative overflow-hidden h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-500">
        {/* Background gradient */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5 group-hover:opacity-15 blur-2xl transition-all duration-500",
            website.color || "bg-gradient-to-br from-purple-500 to-pink-500"
          )}
        />

        <div className="p-6 space-y-4 relative z-10">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <Image
              src={website.imageUrl}
              alt={website.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/640x360?text=Website+Preview";
                target.onerror = null;
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              {website.title}
            </h3>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {website.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {website.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                >
                  {tech}
                </span>
              ))}
              {website.technologies.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                  +{website.technologies.length - 3}
                </span>
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-xl group-hover:bg-purple-50 group-hover:border-purple-200 dark:group-hover:bg-purple-950/50 dark:group-hover:border-purple-700 transition-all duration-300"
            >
              <Link href={website.url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Visit Website
                </span>
                <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}