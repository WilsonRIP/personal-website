"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poetsen_One } from "next/font/google";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/lib/ThemeContext";
import Image from "next/image";

// Load Poetsen One (Google Font) at build‑time
const poetsen = Poetsen_One({
  weight: "400",
  subsets: ["latin"],
});

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/my-websites", label: "My Websites" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
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

  const { theme } = useTheme();

  return (
    <header
      className={`${
        poetsen.className
      } sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "py-2" : "py-3"
      } ${theme === "dark" ? "bg-gray-900/70" : "bg-white/70"} ${
        theme === "dark" ? "text-white" : "text-gray-800"
      } ${isScrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="container mx-auto flex items-center px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-xl md:text-2xl font-semibold tracking-wide mr-8"
        >
          <Image
            src="/icons8-cat-100.png"
            alt="Cat"
            width={32}
            height={32}
            className="w-7 h-7 rounded-full"
            priority
          />
          <span className="ml-2 hidden sm:inline text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Wilson
          </span>
        </Link>

        {/* Desktop Navigation - Moved to the left */}
        {!isMobile && (
          <div className="flex items-center justify-between w-full">
            <ul className="flex gap-6">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                        isActive
                          ? "text-teal-500 bg-teal-400/5"
                          : "hover:text-teal-400 hover:bg-teal-400/5"
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded bg-teal-400" />
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
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-gray-800"
                } block transition-all duration-300 ${
                  isOpen ? "transform rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-gray-800"
                } block transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-gray-800"
                } block transition-all duration-300 ${
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
          className={`md:hidden absolute top-full left-0 right-0 ${
            theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-md shadow-md`}
        >
          <ul className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href} className="w-full text-center">
                  <Link
                    href={href}
                    className={`block py-3 mx-4 text-lg font-medium transition-colors rounded-md ${
                      isActive
                        ? "text-teal-500 bg-teal-400/5"
                        : `hover:text-teal-400 hover:bg-teal-400/5 ${
                            theme === "dark" ? "" : "text-gray-800"
                          }`
                    }`}
                  >
                    {label}
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
