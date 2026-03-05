"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { websites, type Website } from "../data";

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Code2,
  ExternalLink,
  Filter,
  Globe,
  Grid3X3,
  LayoutList,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortBy = "featured" | "title" | "recent";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/1280x720?text=Website+Preview";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="rounded-xl border bg-background/80 p-2.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-xl border bg-muted/50 p-2.5">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function TechPill({
  tech,
  subtle = false,
}: {
  tech: string;
  subtle?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        subtle
          ? "bg-muted/60 text-muted-foreground"
          : "bg-background text-foreground hover:bg-muted"
      )}
    >
      {tech}
    </span>
  );
}

function WebsiteImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      onError={() => {
        if (imageSrc !== PLACEHOLDER_IMAGE) {
          setImageSrc(PLACEHOLDER_IMAGE);
        }
      }}
    />
  );
}

function WebsiteCardSkeleton() {
  return (
    <div className="h-full rounded-2xl border bg-card/70 p-5 animate-pulse">
      <div className="space-y-4">
        <div className="aspect-[16/10] rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-4/5 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-14 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function MyWebsitesClient() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("featured");

  useEffect(() => {
    setMounted(true);
  }, []);

  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();

    for (const website of websites) {
      for (const tech of website.technologies) {
        techSet.add(tech);
      }
    }

    return Array.from(techSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredWebsites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = websites.filter((website) => {
      const matchesSearch =
        query.length === 0 ||
        website.title.toLowerCase().includes(query) ||
        website.description.toLowerCase().includes(query) ||
        website.technologies.some((tech) => tech.toLowerCase().includes(query));

      const matchesTech =
        selectedTech === "all" || website.technologies.includes(selectedTech);

      return matchesSearch && matchesTech;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        case "title":
          return a.title.localeCompare(b.title);
        case "recent":
          return Number(b.id) - Number(a.id);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedTech, sortBy]);

  const featuredWebsites = filteredWebsites.filter((website) => website.featured);
  const regularWebsites = filteredWebsites.filter((website) => !website.featured);
  const hasActiveFilters = searchQuery.trim().length > 0 || selectedTech !== "all";

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-10 w-52 rounded-lg bg-muted animate-pulse" />
              <div className="mx-auto h-5 w-80 rounded bg-muted animate-pulse" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <WebsiteCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTech("all");
    setSortBy("featured");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.14),transparent_55%)]" />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          className="space-y-10 sm:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.header
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur-sm shadow-sm"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%,rgba(255,255,255,0.02))]" />
            <div className="relative px-6 py-10 sm:px-10 sm:py-14">
              <div className="mx-auto max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Portfolio Showcase
                </div>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  My Websites
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-7 text-muted-foreground">
                  A curated collection of projects focused on modern web
                  development, product design, clean interfaces, and practical
                  user experience.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <StatCard
                    label="Projects"
                    value={websites.length}
                    icon={Globe}
                  />
                  <StatCard
                    label="Featured"
                    value={websites.filter((item) => item.featured).length}
                    icon={Star}
                  />
                  <StatCard
                    label="Technologies"
                    value={allTechnologies.length}
                    icon={Code2}
                  />
                </div>
              </div>
            </div>
          </motion.header>

          <motion.section
            variants={itemVariants}
            className="sticky top-4 z-20 rounded-2xl border bg-background/80 backdrop-blur-xl shadow-sm"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, descriptions, or technologies..."
                  className="h-11 rounded-xl pl-10"
                  aria-label="Search websites"
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3 lg:w-auto">
                <div className="flex items-center gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select value={selectedTech} onValueChange={setSelectedTech}>
                    <SelectTrigger className="h-11 min-w-[180px] rounded-xl">
                      <SelectValue placeholder="All technologies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All technologies</SelectItem>
                      {allTechnologies.map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortBy)}
                  >
                    <SelectTrigger className="h-11 min-w-[160px] rounded-xl">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured first</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="recent">Most recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex h-11 items-center rounded-xl border bg-muted/30 p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-9 flex-1 rounded-lg",
                      viewMode === "grid" && "shadow-sm"
                    )}
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Grid
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={viewMode === "list" ? "default" : "ghost"}
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-9 flex-1 rounded-lg",
                      viewMode === "list" && "shadow-sm"
                    )}
                    aria-pressed={viewMode === "list"}
                  >
                    <LayoutList className="mr-2 h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>
            </div>

            {(hasActiveFilters || sortBy !== "featured") && (
              <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3 sm:px-5">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredWebsites.length}</span> result
                  {filteredWebsites.length === 1 ? "" : "s"}
                </span>

                {searchQuery.trim() ? (
                  <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                    Search: {searchQuery.trim()}
                  </span>
                ) : null}

                {selectedTech !== "all" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
                    Tech: {selectedTech}
                  </span>
                ) : null}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto rounded-lg"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {hasActiveFilters ? "Filtered Projects" : "All Projects"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse featured work first, then explore the full collection.
              </p>
            </div>

            <div className="hidden sm:inline-flex items-center rounded-full border bg-muted/40 px-3 py-1.5 text-sm font-medium text-muted-foreground">
              {filteredWebsites.length} total
            </div>
          </motion.section>

          {featuredWebsites.length > 0 && (
            <motion.section className="space-y-5" variants={itemVariants}>
              <SectionTitle
                icon={Award}
                title="Featured Projects"
                subtitle="Highlighted work with stronger presentation and larger previews."
              />

              <div className="space-y-6">
                {featuredWebsites.map((website, index) => (
                  <FeaturedWebsiteCard
                    key={website.id}
                    website={website}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {regularWebsites.length > 0 && (
            <motion.section className="space-y-5" variants={itemVariants}>
              <SectionTitle
                icon={Globe}
                title="More Projects"
                subtitle="Additional builds, experiments, and production-ready websites."
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-4"
                  )}
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

          {filteredWebsites.length === 0 && (
            <motion.section
              variants={itemVariants}
              className="rounded-3xl border bg-card/70 p-8 sm:p-12 text-center shadow-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted/60">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                No projects found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm sm:text-base text-muted-foreground">
                Nothing matched your current search or filter settings. Try a
                different keyword or reset the filters.
              </p>

              <div className="mt-6">
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            </motion.section>
          )}
        </motion.div>
      </div>
    </main>
  );
}

function FeaturedWebsiteCard({
  website,
  index,
}: {
  website: Website;
  index: number;
}) {
  const { ref, inView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  });

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group"
    >
      <div className="overflow-hidden rounded-3xl border bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
          <div className="order-2 flex flex-col justify-center p-6 sm:p-8 lg:order-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Star className="mr-1.5 h-3.5 w-3.5" />
                Featured
              </span>

              <span className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                Live project
              </span>
            </div>

            <h3 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight transition-colors group-hover:text-primary">
              {website.title}
            </h3>

            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-muted-foreground">
              {website.description}
            </p>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Code2 className="h-4 w-4" />
                Built with
              </div>

              <div className="flex flex-wrap gap-2">
                {website.technologies.map((tech) => (
                  <TechPill key={tech} tech={tech} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="order-1 p-4 sm:p-5 lg:order-2 lg:p-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted/30">
              <WebsiteImage
                src={website.imageUrl}
                alt={website.title}
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function WebsiteCard({
  website,
  index,
  viewMode,
}: {
  website: Website;
  index: number;
  viewMode: ViewMode;
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        delay: index * 0.04,
      },
    },
  };

  if (viewMode === "list") {
    return (
      <motion.article
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="group"
      >
        <div className="flex flex-col gap-5 overflow-hidden rounded-2xl border bg-card/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:p-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted/30 sm:w-64">
            <WebsiteImage
              src={website.imageUrl}
              alt={website.title}
              sizes="(max-width: 640px) 100vw, 256px"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                {website.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {website.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {website.technologies.slice(0, 5).map((tech) => (
                  <TechPill key={tech} tech={tech} subtle />
                ))}
                {website.technologies.length > 5 ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    +{website.technologies.length - 5}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl">
                <Link
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="rounded-xl">
                <Link
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  New tab
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted/30">
          <WebsiteImage
            src={website.imageUrl}
            alt={website.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
              {website.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {website.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {website.technologies.slice(0, 4).map((tech) => (
                <TechPill key={tech} tech={tech} subtle />
              ))}
              {website.technologies.length > 4 ? (
                <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  +{website.technologies.length - 4}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="mr-2 h-4 w-4" />
                Visit Website
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}