"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GithubRepo } from "@/lib/github";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface ProjectsListProps {
  initialRepos: GithubRepo[];
}

export default function ProjectsList({ initialRepos }: ProjectsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 6;

  // Calculate total pages
  const totalPages = Math.ceil(initialRepos.length / reposPerPage);

  // Get current repositories
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = initialRepos.slice(indexOfFirstRepo, indexOfLastRepo);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of projects section
    document
      .getElementById("projects-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="projects-section" className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-blue-500">
          Repository Showcase
        </h2>
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
          {initialRepos.length}
        </span>
        <div className="h-px flex-grow bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRepos.map((repo, index) => (
          <ProjectCard key={repo.id} repo={repo} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav
            className="inline-flex items-center rounded-xl shadow-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-1.5 border border-gray-200 dark:border-gray-700"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex items-center border-l border-r border-gray-200 dark:border-gray-700">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
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
        duration: 0.4,
        delay: index * 0.1,
      },
    },
  };

  // Map common languages to colors
  const getLanguageColor = (language: string | null) => {
    if (!language) return "#8B8B8B"; // Default gray

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

  const languageColor = getLanguageColor(repo.language);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group relative overflow-hidden rounded-xl border dark:border-gray-700 border-gray-200 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Card background gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-300"
        style={{ backgroundColor: languageColor }}
      ></div>

      <div className="p-6 relative z-10">
        {repo.language && (
          <div className="flex items-center mb-4">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: languageColor }}
            ></span>
            <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700/70 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {repo.language}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {repo.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">
          {repo.description || "No description provided"}
        </p>

        <div className="flex items-center mb-5">
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mr-4 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {repo.stargazers_count}
          </span>

          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            {repo.forks_count}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all flex items-center group-hover:translate-x-1 duration-300"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Code
          </Link>

          {repo.homepage && (
            <Link
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm transition-all flex items-center hover:shadow-md"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Live Demo
            </Link>
          )}

          {/* Updated date */}
          <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Updated{" "}
            {new Date(repo.pushed_at).toLocaleDateString("en-US", {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
