'use client';

import { useTheme } from '@/lib/ThemeContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration issues by rendering after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div className={`w-14 h-7 ${className}`} />; // Placeholder to prevent layout shift
  
  const isDark = theme === 'dark';
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-700 to-indigo-800 border-blue-500' 
          : 'bg-gradient-to-r from-amber-300 to-orange-300 border-amber-400'
      } w-16 h-8 border ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Toggle circle/thumb */}
      <motion.div
        animate={{
          translateX: isDark ? 32 : 2,
          rotate: isDark ? 180 : 0,
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
        }}
        className="absolute top-1 z-10 w-6 h-6 rounded-full shadow-md flex items-center justify-center"
      >
        {/* Icon inside the circle */}
        <motion.div 
          animate={{ 
            opacity: 1,
            scale: [0.8, 1.1, 1]
          }}
          transition={{ 
            duration: 0.3,
            times: [0, 0.7, 1]
          }}
          className="w-4 h-4 flex items-center justify-center"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFB700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </motion.div>
      </motion.div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-full">
        {/* Stars for dark mode */}
        <motion.div 
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={false}
              animate={{
                opacity: isDark ? [0.2, 0.8, 0.2] : 0,
                scale: isDark ? [0.8, 1, 0.8] : 0.8,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 60}%`,
              }}
            />
          ))}
        </motion.div>
        
        {/* Sun rays for light mode */}
        <motion.div 
          className="absolute inset-0 flex items-center"
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-yellow-200 opacity-60 rounded-full"
              initial={false}
              animate={{
                scale: isDark ? 1 : [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                width: `${10 + i * 10}px`,
                height: `${10 + i * 10}px`,
                left: `${25 - i * 6}%`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.button>
  );
}
