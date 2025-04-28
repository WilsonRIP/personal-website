// components/MyWebsitesClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Website, websites } from "../data"; // Assuming data.ts is in the parent directory

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

  // Debug theme state during development - consider removing in production
  // useEffect(() => {
  //   if (mounted && resolvedTheme) {
  //     console.log(`Current theme: ${resolvedTheme}`);
  //   }
  // }, [mounted, resolvedTheme]);

  // Fix hydration issues by only showing animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a minimal placeholder until mounted
  if (!mounted) {
    return (
      <div
        className="flex min-h-screen flex-col items-center p-6 md:p-10 lg:p-16 bg-bg-primary"
        suppressHydrationWarning
      >
        {/* Optional: Add a loading spinner or skeleton here */}
      </div>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center p-6 md:p-10 lg:p-16 bg-bg-primary text-color-primary" // Use theme background and default text color
      suppressHydrationWarning
    >
      <div className="w-full max-w-6xl space-y-10">
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DEFAULTS.duration }}
        >
          {/* Title gradient - adjust colors if needed */}
          <h1 className="font-arista-bold text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-3">
            My Websites
          </h1>
          {/* Description text color */}
          <p className="text-color-secondary max-w-3xl mx-auto">
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
            // Theme background, border, and shadows
            className={`group relative overflow-hidden rounded-xl border border-border-base bg-bg-card shadow-lg hover:shadow-xl transition-all ${TRANSITION_DEFAULTS.durationShort} p-6 md:p-8`}
          >
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
                  ></div>

                  <div className="space-y-4 relative z-10">
                    {/* Featured tag colors - already has dark variants */}
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
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
                    {/* Title text color */}
                    <h2
                      className={`text-2xl font-bold text-color-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
                    >
                      {website.title}
                    </h2>
                    {/* Description text color */}
                    <p
                      className={`text-color-secondary group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
                    >
                      {website.description}
                    </p>

                    {/* Tech tag colors - already has dark variants */}
                    <div className="flex flex-wrap gap-2">
                      {website.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-gray-700/70 text-blue-700 dark:text-gray-200 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4">
                      {/* Button colors - already has dark variants */}
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium transition-all hover:shadow-md group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:ring-opacity-50 hover:from-blue-600 hover:to-teal-600`}
                      >
                        <span
                          className={`group-hover:translate-x-0.5 transition-transform ${TRANSITION_DEFAULTS.durationShort}`}
                        >
                          Visit Website
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform ${TRANSITION_DEFAULTS.durationShort}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Image container border and shadow */}
                  <div
                    className={`relative aspect-video overflow-hidden rounded-xl border border-border-base shadow-sm group-hover:shadow-md transition-all ${TRANSITION_DEFAULTS.durationShort}`}
                  >
                    {/* Placeholder animation color - already has dark variants */}
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    {/* Add overlay gradient on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${TRANSITION_DEFAULTS.durationShort} z-10`}
                    ></div>

                    <Image
                      src={website.imageUrl}
                      alt={website.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover group-hover:scale-105 transition-transform ${TRANSITION_DEFAULTS.durationMedium} ease-in-out`}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                      suppressHydrationWarning
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/640x360?text=Website+Preview";
                        target.onerror = null; // Prevent infinite error loop
                      }}
                    />

                    {/* Live badge that appears on hover - already has dark variants */}
                    <div
                      className={`absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity ${TRANSITION_DEFAULTS.durationShort}`}
                    >
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
            {/* Section title text color */}
            <h2 className="text-xl md:text-2xl font-bold text-color-primary">
              My Projects
            </h2>
            {/* Count badge colors - already has dark variants */}
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
              {websites.filter((website) => !website.featured).length}
            </span>
            {/* Separator line color */}
            <div className="h-px flex-grow bg-gradient-to-r from-border-base to-transparent"></div>
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
    </main>
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
      // Theme background, border, and shadows
      className={`group relative overflow-hidden rounded-lg border border-border-base bg-bg-card shadow-sm hover:shadow-md transition-all ${TRANSITION_DEFAULTS.durationShort} p-5`}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* Card background gradient - uses website.color prop */}
      <div
        className={`absolute top-0 right-0 w-[300px] h-[300px] ${CARD_GRADIENT_OFFSET} rounded-full bg-gradient-to-br ${website.color} opacity-5 group-hover:opacity-10 blur-3xl transition-opacity ${TRANSITION_DEFAULTS.durationMedium}`}
      ></div>

      {/* Website preview image container border */}
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-md border border-border-base mb-4`}
      >
        {/* Placeholder animation color - already has dark variants */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <Image
          src={website.imageUrl}
          alt={website.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform ${TRANSITION_DEFAULTS.durationMedium} ease-in-out`}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          suppressHydrationWarning
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/640x360?text=Website+Preview";
            target.onerror = null;
          }}
        />
        {/* Image hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${TRANSITION_DEFAULTS.durationShort}`}
        ></div>
      </div>

      {/* Website info */}
      {/* Title text color */}
      <h3
        className={`text-lg font-semibold text-color-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${TRANSITION_DEFAULTS.durationShort} mb-1`}
      >
        {website.title}
      </h3>
      {/* Description text color */}
      <p className={`text-sm text-color-secondary mb-3 line-clamp-2`}>
        {website.description}
      </p>

      {/* Tech tags - colors already have dark variants */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {website.technologies.slice(0, TECH_TAG_LIMIT).map((tech) => (
          <span
            key={tech}
            className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-gray-700/70 text-blue-700 dark:text-gray-200 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
          >
            {tech}
          </span>
        ))}
        {website.technologies.length > TECH_TAG_LIMIT && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-gray-700/70 text-blue-600 dark:text-gray-400 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
          >
            +{website.technologies.length - TECH_TAG_LIMIT} more
          </span>
        )}
      </div>

      {/* Visit website link - colors already have dark variants */}
      <a
        href={website.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors ${TRANSITION_DEFAULTS.durationShort}`}
      >
        <span
          className={`group-hover:translate-x-0.5 transition-transform ${TRANSITION_DEFAULTS.durationShort}`}
        >
          Visit Website
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform ${TRANSITION_DEFAULTS.durationShort}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </motion.div>
  );
}
