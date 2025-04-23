'use client';

import React from 'react';
import { WEBSITE_NAME } from '@/lib/types';
import { useTheme } from '@/lib/ThemeContext';

// UI Configuration for easy customization
const UI = {
  spacing: {
    cardGap: 'gap-8',
  }
};

export default function Home() {
  const { theme } = useTheme();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 lg:p-24 bg-theme-gradient overflow-hidden">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-6">
          {WEBSITE_NAME}
        </h1>
      </div>
    </main>
  );
}
