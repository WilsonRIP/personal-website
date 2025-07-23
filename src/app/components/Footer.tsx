"use client";

import { useState, useEffect, memo } from "react";
import { socialLinks, SocialLink } from "../data/socials";
import Link from "next/link";
import Image from "next/image";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { useTheme } from "next-themes";



// Useful links for the footer
const footerLinks = [
  {
    title: "Navigation",
    links: [
      { name: "Home", url: "/" },
      { name: "Projects", url: "/projects" },
      { name: "About", url: "/about" },
      { name: "Contact", url: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", url: "#" },
      { name: "Portfolio", url: "/projects" },
      { name: "Resume", url: "/resume" },
    ],
  },
];

// Memoized Footer component for better performance
const Footer = memo(function Footer() {
  const { resolvedTheme } = useTheme();
  const [currentYear] = useState(new Date().getFullYear());
  const [mounted, setMounted] = useState(false);
  
  // Only render component after mounting on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = resolvedTheme === 'dark';
  
  // Prevent hydration mismatch by rendering a placeholder until client-side
  if (!mounted) {
    return (
      <footer className={`py-16`}>
        <div className="container mx-auto px-6 md:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-8"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-md mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 max-w-md"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <footer className={`${isDark ? 'bg-gradient-to-br from-slate-900 via-teal-900/20 to-blue-900/10 text-white' : 'bg-gradient-to-br from-background via-blue-900/30 to-teal-900/30 text-gray-800'} py-16 transition-colors duration-300`}>
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Website Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Wilson&apos;s Website
            </h2>
            <p className={`text-sm max-w-md transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              A passionate developer focused on creating intuitive and engaging digital experiences.
            </p>

            {/* Social Media */}
            <div className="flex flex-wrap gap-4 pt-2">
              {socialLinks.map((social: SocialLink) => (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={social.name}
                  className="relative group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </motion.div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:flex md:justify-end"
          >
            <div className="space-y-6">
              <h3 className={`text-xl font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Navigation
              </h3>
              <ul className="space-y-3">
                {footerLinks[0].links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className={`transition-colors duration-200 ${isDark ? 'text-slate-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`mt-12 pt-6 border-t text-center md:text-left text-sm transition-colors duration-300 ${isDark ? 'border-slate-800 text-slate-500' : 'border-gray-200 text-gray-500'}`}
        >
          &copy; {currentYear} Wilson&apos;s Website. All rights reserved.
        </motion.div>
      </div>
    </footer>
    </LazyMotion>
  );
});

export default Footer;
