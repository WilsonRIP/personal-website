"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crimson_Text } from "next/font/google";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

const crimsonText = Crimson_Text({
  weight: "400",
  subsets: ["latin"],
});

// Removed unused Poetsen One font definition
// const poetsen = Poetsen_One({
//   weight: "400",
//   subsets: ["latin"],
// });

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/my-websites", label: "My Websites", shortLabel: "Websites" },
  { href: "/showcase", label: "Showcase" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Theme detection
  const isDark = resolvedTheme === "dark";
  
  // Only render component after mounting on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCompactView(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();

    // Add resize event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Add scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent hydration mismatch by rendering a placeholder until client-side
  if (!mounted) {
    return (
      <header className={`${crimsonText.className} sticky top-0 z-50 backdrop-blur-lg py-3 bg-gradient-to-br from-background/90 via-blue-900/10 to-teal-900/20 dark:from-slate-900/90 dark:via-teal-900/20 dark:to-blue-900/10 shadow-sm`}>
        <div className="container mx-auto flex items-center px-4 md:px-6 h-14"></div>
      </header>
    );
  }

  return (
    <header
      className={`${
        crimsonText.className
      } sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "py-2" : "py-3"
      } 
      ${isDark ? 'bg-gradient-to-br from-slate-900/95 via-teal-900/30 to-blue-900/20 backdrop-blur-md text-white' : 'bg-gradient-to-br from-background/95 via-blue-900/20 to-teal-900/30 backdrop-blur-md text-gray-800'} 
      ${
        isScrolled
          ? `shadow-md ${isDark ? 'shadow-gray-700' : ''}`
          : `shadow-sm ${isDark ? 'shadow-gray-800' : ''}`
      }`}
    >
      <div className="container mx-auto flex items-center px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-xl md:text-2xl font-semibold tracking-wide mr-8"
        >
          <Image
            src="/icon.png"
            alt="Cat"
            width={32}
            height={32}
            className="w-7 h-7 rounded-full"
            priority
          />
          <span
            className={`font-arista-bold ml-2 hidden sm:inline text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500`}
          >
            Wilson
          </span>
        </Link>

        {/* Desktop Navigation - Moved to the left */}
        {!isMobile && (
          <div className="flex items-center justify-between w-full">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-5 lg:gap-x-6">
              {navLinks.map(({ href, label, shortLabel }) => {
                const isActive = pathname === href;
                // Use short label for compact view if available
                const displayLabel = (isCompactView && shortLabel) ? shortLabel : label;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`font-arista-bold relative px-2 py-1.5 text-sm md:text-base md:px-3 md:py-2 font-medium transition-colors duration-200 rounded-full whitespace-nowrap ${
                        isActive
                          ? `text-teal-500 ${isDark ? 'text-teal-400' : ''} bg-teal-400/20 ${isDark ? 'bg-teal-400/20' : ''}`
                          : `${isDark ? 'text-gray-100' : 'text-gray-800'} font-medium hover:text-teal-500 ${isDark ? 'hover:text-teal-400' : ''} hover:bg-teal-400/20 ${isDark ? 'hover:bg-teal-400/20' : ''}`
                      }`}
                    >
                      {displayLabel}
                      {isActive && (
                        <span className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded bg-teal-500 dark:bg-teal-400" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Theme Toggle */}
            <ThemeToggle className="ml-auto" />
          </div>
        )}

        {/* Mobile Content (Theme Toggle + Menu Button) */}
        {isMobile && (
          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-center items-center space-y-1.5 z-50"
              aria-label="Toggle Menu"
            >
              <span
                className={`w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-800'} block transition-all duration-300 ${
                  isOpen ? "transform rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-800'} block transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-800'} block transition-all duration-300 ${
                  isOpen ? "transform -rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isOpen && (
        <div
          className={`md:hidden absolute top-full left-0 right-0 ${isDark ? 'bg-gradient-to-br from-slate-900/95 via-teal-900/20 to-blue-900/10' : 'bg-gradient-to-br from-background/95 via-blue-900/30 to-teal-900/30'} backdrop-blur-md shadow-md ${isDark ? 'shadow-gray-700' : ''}`}
        >
          <ul className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map(({ href, label, shortLabel }) => {
              const isActive = pathname === href;
              const displayLabel = isMobile && shortLabel ? shortLabel : label;
              return (
                <li key={href} className="w-full text-center">
                  <Link
                    href={href}
                    className={`font-arista-bold block py-2 mx-4 text-lg font-medium transition-colors rounded-full ${
                      isActive
                        ? `text-teal-500 ${isDark ? 'text-teal-400' : ''} bg-teal-400/30 ${isDark ? 'bg-teal-400/20' : ''}`
                        : `${isDark ? 'text-gray-100' : 'text-gray-800'} font-medium hover:text-teal-500 ${isDark ? 'hover:text-teal-400' : ''} hover:bg-teal-400/20 ${isDark ? 'hover:bg-teal-400/20' : ''}`
                    }`}
                  >
                    {displayLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
