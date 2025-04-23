"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";
import { useInView } from "react-intersection-observer";
import { Website, websites } from "../data";

export default function MyWebsitesClient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues by only showing animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-10 lg:p-16 bg-theme-gradient">
      <div className="w-full max-w-6xl space-y-10">
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-3">
            My Websites
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A collection of websites I&apos;ve designed and developed. Each site
            represents my skills in web development and design.
          </p>
        </motion.header>

        {/* Featured Website (if any) */}
        {websites.some((website) => website.featured) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`group relative overflow-hidden rounded-xl border dark:border-gray-700 border-gray-200 ${
              theme === "dark" ? "bg-gray-800/70" : "bg-white/90"
            } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8`}
          >
            {websites
              .filter((website) => website.featured)
              .map((website) => (
                <div
                  key={website.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 relative"
                >
                  {/* Enhanced background gradient */}
                  <div
                    className={`absolute top-0 right-0 w-[500px] h-[500px] -mr-64 -mt-64 rounded-full bg-gradient-to-br ${website.color} opacity-5 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                  ></div>

                  <div className="space-y-4 relative z-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors duration-300">
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {website.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {website.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {website.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/70 dark:text-gray-200 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium transition-all hover:shadow-md group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 hover:from-blue-600 hover:to-teal-600"
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
                      </a>
                    </div>
                  </div>

                  <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                    {/* Add overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                    <Image
                      src={website.imageUrl}
                      alt={website.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/640x360?text=Website+Preview";
                        target.onerror = null; // Prevent infinite error loop
                      }}
                    />

                    {/* Live badge that appears on hover */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
          animate={mounted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-center space-x-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              My Projects
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
              {websites.filter((website) => !website.featured).length}
            </span>
            <div className="h-px flex-grow bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent"></div>
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative overflow-hidden rounded-xl border dark:border-gray-700 border-gray-200 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Card background gradient - more vibrant on hover */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-gradient-to-br ${website.color} opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
      ></div>

      {/* Image container with aspect ratio */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        <Image
          src={website.imageUrl}
          alt={website.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/640x360?text=Website+Preview";
            target.onerror = null; // Prevent infinite error loop
          }}
        />

        {/* Image overlay with gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 relative z-10">
        {/* Enhanced title with smoother hover transition */}
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {website.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">
          {website.description}
        </p>

        {/* Technology tags with improved styling */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {website.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
          {website.technologies.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
              +{website.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Enhanced CTA link with better hover effect */}
        <div className="flex items-center justify-between">
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 group-hover:translate-x-1 transition-transform duration-300"
          >
            Visit Website
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5"
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

          {/* Preview badge with subtle animation */}
          <span className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Preview
          </span>
        </div>
      </div>
    </motion.div>
  );
}
