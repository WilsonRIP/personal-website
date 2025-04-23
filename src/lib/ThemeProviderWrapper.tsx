'use client';

import { ThemeProvider } from '@/lib/ThemeContext';
import React from 'react';

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
