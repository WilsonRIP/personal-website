'use client';

import { useTheme } from '@/lib/ThemeContext';
import { useState, useEffect } from 'react';

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
  
  if (!mounted) return <div className={`w-10 h-6 ${className}`} />; // Placeholder to prevent layout shift
  
  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
        theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
      } w-12 h-6 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          theme === 'dark' ? 'translate-x-6 bg-gray-800' : 'translate-x-1 bg-white'
        } inline-block w-4 h-4 transform rounded-full transition-transform duration-300 shadow-lg`}
      />
      
      {/* Sun icon */}
      <span 
        className={`absolute left-1 top-1/2 -translate-y-1/2 text-yellow-400 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ fontSize: '10px' }}
      >
        ☀️
      </span>
      
      {/* Moon icon */}
      <span 
        className={`absolute right-1 top-1/2 -translate-y-1/2 text-gray-100 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ fontSize: '10px' }}
      >
        🌙
      </span>
    </button>
  );
}
