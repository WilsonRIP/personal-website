"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider props extending the NextThemesProvider props
 * This allows us to pass through all props to the underlying provider
 * while maintaining type safety
 */
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Application theme provider that wraps NextThemesProvider with sensible defaults
 * and exposes theme context to the application
 */
export function ThemeProvider({ 
  children, 
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}