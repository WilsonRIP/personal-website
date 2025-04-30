"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Website, websites } from "../data";
import FancyHeading from "@/app/components/FancyHeading";
import FancyCard from "@/app/components/FancyCard";
import FancyButton from "@/app/components/FancyButton";

// --- Configuration Constants ---
const ANIMATION_DEFAULTS = {
  duration: 0.6,
  delayShort: 0.1,
  delayMedium: 0.2,
};

const CARD_ANIMATION = {
  duration: 0.4,
  staggerDelay: 0.1,
};

const TRANSITION_DEFAULTS = {
  durationShort: "duration-300",
  durationMedium: "duration-500",
};

const TECH_TAG_LIMIT = 3;
// Keep gradients relative to container, adjust offset as needed
const FEATURED_GRADIENT_OFFSET = "-mr-64 -mt-64";
const CARD_GRADIENT_OFFSET = "-mr-16 -mt-16";

// --- Component ---
export default function MyWebsitesClient() {
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues by only showing animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a minimal placeholder until mounted
  if (!mounted) {
    return <div suppressHydrationWarning />;
  }

  return (
    <div className="w-full space-y-10">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DEFAULTS.duration }}
      >
        <FancyHeading 
          as="h1" 
          variant="bold" 
          className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3"
          withAnimation
        >
          My Websites
        </FancyHeading>
        <p className="text-foreground/80 max-w-3xl mx-auto">
          A collection of websites I&apos;ve designed and developed. Each site
          represents my skills in web development and design.
        </p>
      </motion.header>

      {/* Featured Website (if any) */}
      {websites.some((website) => website.featured) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DEFAULTS.duration,
            delay: ANIMATION_DEFAULTS.delayShort,
          }}
        >
          <FancyCard withAnimation="fade" withHoverEffect className="p-6 md:p-8">
            {websites
              .filter((website) => website.featured)
              .map((website) => (
                <div
                  key={website.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 relative"
                >
                  {/* Enhanced background gradient - uses website.color prop */}
                  <div
                    className={`absolute top-0 right-0 w-[500px] h-[500px] ${FEATURED_GRADIENT_OFFSET} rounded-full bg-gradient-to-br ${website.color} opacity-5 group-hover:opacity-10 blur-3xl transition-opacity ${TRANSITION_DEFAULTS.durationMedium}`}
                  />

                  <div className="space-y-4 relative z-10">
                    {/* Featured tag colors */}
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground transition-colors duration-300 border border-primary/10 dark:border-primary/20 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 bg-blue-50 dark:bg-blue-600/70"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7.993-9.998a1 1 0 01.783.293l3 3a1 1 0 01-1.414 1.414l-3-3a1 1 0 01.631-1.707zM15 8a1 1 0 110 2H9a1 1 0 110-2h6zm0 6a1 1 0 110 2H9a1 1 0 110-2h6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Featured Project
                    </div>
                    
                    {/* Title */}
                    <h2
                      className="text-2xl font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors duration-300"
                    >
                      {website.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-foreground/80 group-hover:text-foreground dark:group-hover:text-foreground/90 transition-colors duration-300">
                      {website.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {website.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/15 to-primary/25 dark:from-primary/25 dark:to-primary/35 text-primary dark:text-primary-foreground border border-primary/10 dark:border-primary/20 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4">
                      <FancyButton
                        href={website.url}
                        variant="ghost"
                        withIcon
                        withAnimation
                        className="bg-gradient-to-r from-purple-500/90 to-indigo-500/90 hover:from-purple-600 hover:to-indigo-600 text-white border border-purple-400/30 shadow-sm hover:shadow-md hover:border-purple-400/50 dark:border-purple-500/40 dark:hover:border-purple-500/60"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          Visit Website
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </FancyButton>
                    </div>
                  </div>

                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-all duration-300">
                    {/* Placeholder animation */}
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    
                    {/* Add overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    <Image
                      src={website.imageUrl}
                      alt={website.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                      suppressHydrationWarning
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/640x360?text=Website+Preview";
                        target.onerror = null; // Prevent infinite error loop
                      }}
                    />

                    {/* Live badge */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </FancyCard>
        </motion.div>
      )}

      {/* All Websites Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: ANIMATION_DEFAULTS.duration,
          delay: ANIMATION_DEFAULTS.delayMedium,
        }}
        className="space-y-8"
      >
        <div className="flex items-center space-x-3">
          <FancyHeading as="h2" variant="stylish" className="text-sm md:text-xl text-foreground">
            My Projects
          </FancyHeading>
          {/* Count badge */}
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground">
            {websites.filter((website) => !website.featured).length}
          </span>
          {/* Separator line */}
          <div className="h-px flex-grow bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites
            .filter((website) => !website.featured)
            .map((website, index) => (
              <WebsiteCard key={website.id} website={website} index={index} />
            ))}
        </div>
      </motion.div>
    </div>
  );
}

function WebsiteCard({ website, index }: { website: Website; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render null or a minimal placeholder if not mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: CARD_ANIMATION.duration,
        delay: index * CARD_ANIMATION.staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <FancyCard withHoverEffect withAnimation="scale" className="p-5 overflow-visible">
        {/* Card background gradient */}
        <div
          className={`absolute top-0 right-0 w-[300px] h-[300px] ${CARD_GRADIENT_OFFSET} rounded-full bg-gradient-to-br ${website.color} opacity-5 group-hover:opacity-10 blur-3xl transition-opacity ${TRANSITION_DEFAULTS.durationMedium}`}
        />

        {/* Website preview image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border mb-4">
          {/* Placeholder animation */}
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <Image
            src={website.imageUrl}
            alt={website.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            suppressHydrationWarning
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/640x360?text=Website+Preview";
              target.onerror = null;
            }}
          />
          {/* Image hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Website info */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors duration-300 mb-1">
          {website.title}
        </h3>
        <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
          {website.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {website.technologies.slice(0, TECH_TAG_LIMIT).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary/15 to-primary/25 dark:from-primary/25 dark:to-primary/35 text-primary dark:text-primary-foreground border border-primary/10 dark:border-primary/20 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30"
            >
              {tech}
            </span>
          ))}
          {website.technologies.length > TECH_TAG_LIMIT && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-secondary/40 to-secondary/60 dark:from-secondary/25 dark:to-secondary/40 text-secondary-foreground border border-secondary/20 dark:border-secondary/30 shadow-sm transition-all duration-300">
              +{website.technologies.length - TECH_TAG_LIMIT} more
            </span>
          )}
        </div>

        {/* Visit website link */}
        <FancyButton
          href={website.url}
          variant="ghost"
          size="sm"
          withAnimation
          withIcon
          className="bg-gradient-to-r from-purple-500/90 to-indigo-500/90 hover:from-purple-600 hover:to-indigo-600 text-white px-2 py-1 border border-purple-400/30 shadow-sm hover:shadow-md hover:border-purple-400/50 dark:border-purple-500/40 dark:hover:border-purple-500/60"
        >
          <span className="group-hover:translate-x-0.5 transition-transform duration-300">
            Visit Website
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </FancyButton>
      </FancyCard>
    </motion.div>
  );
}
