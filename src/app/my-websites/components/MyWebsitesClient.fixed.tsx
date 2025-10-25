"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Website, websites } from "../data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ArrowUpRight,
  Award
} from "lucide-react";




type ViewMode = "grid" | "list";

// Loading skeleton component
const WebsiteCardSkeleton = () => (
  <div className="h-full bg-card border rounded-lg animate-pulse">
    <div className="p-6 space-y-4">
      <div className="aspect-video bg-muted rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
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
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="h-12 bg-muted rounded-lg w-64 mx-auto animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse"></div>
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
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.header className="text-center space-y-6" variants={itemVariants}>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border text-muted-foreground text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Portfolio Showcase
              </div>

              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                My Websites
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A curated collection of websites I&apos;ve designed and developed, showcasing my expertise in 
                <span className="font-semibold"> modern web development</span> and 
                <span className="font-semibold"> creative design</span>.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{websites.length}</div>
                <div className="text-muted-foreground">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{featuredWebsites.length}</div>
                <div className="text-muted-foreground">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{allTechnologies.length}</div>
                <div className="text-muted-foreground">Technologies</div>
              </div>
            </div>
          </motion.header>

          {/* Controls */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 p-6 bg-card border rounded-lg shadow-sm"
            variants={itemVariants}
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tech Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger className="min-w-[140px]">
                  <SelectValue placeholder="All Technologies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {allTechnologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "featured" | "title" | "recent")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-md border border-input overflow-hidden">
              <Button
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-none border-0 transition-all duration-200",
                  viewMode === "grid" 
                    ? "shadow-sm scale-105" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Grid3X3 className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  viewMode === "grid" && "scale-110"
                )} />
                Grid
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-none border-0 transition-all duration-200",
                  viewMode === "list" 
                    ? "shadow-sm scale-105" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <List className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  viewMode === "list" && "scale-110"
                )} />
                List
              </Button>
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div className="flex items-center justify-between" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {searchQuery || selectedTech !== "all" ? "Search Results" : "All Projects"}
              </h2>
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full bg-muted text-muted-foreground">
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
              >
                Clear filters
              </Button>
            )}
          </motion.div>

          {/* Featured Website Section */}
          {featuredWebsites.length > 0 && (
            <motion.section className="space-y-6" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Award className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Featured Projects</h3>
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
                <div className="p-2 rounded-lg bg-muted">
                  <Globe className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Other Projects</h3>
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">
                No websites found
              </h3>
              <p className="text-xl text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTech("all");
                  setSortBy("featured");
                }}
                variant="outline"
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
        type: "spring" as const,
        stiffness: 300,
        damping: 30
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
      <div className="relative overflow-hidden rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  Live
                </div>
              </div>

              <h2 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {website.title}
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {website.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Code className="h-4 w-4" />
                Built with
              </div>
              <div className="flex flex-wrap gap-2">
                {website.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
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
                className="px-8 py-3 text-base bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href={website.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-5 w-5 mr-2" />
                  Visit Website
                  <ArrowUpRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image
                src={website.imageUrl}
                alt={website.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
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
        <div className="flex gap-6 p-6 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          {/* Image */}
          <div className="relative w-48 aspect-video overflow-hidden rounded-lg border border-border flex-shrink-0">
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
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {website.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2">
                {website.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {website.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
              {website.technologies.length > 4 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  +{website.technologies.length - 4}
                </span>
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
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
      <div className="relative overflow-hidden h-full bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
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
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {website.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {website.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {website.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
              {website.technologies.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  +{website.technologies.length - 3}
                </span>
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Link href={website.url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}