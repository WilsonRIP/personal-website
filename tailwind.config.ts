// tailwind.config.ts
import type { Config } from "tailwindcss";
// Removed unused import
// import colors from "tailwindcss/colors";
import animatePlugin from "tailwindcss-animate"; // Import the plugin

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // "theme-gradient": "linear-gradient(to bottom, var(--gradient-start), var(--gradient-end))", // Example using CSS vars
      },
      colors: {
        // Map Tailwind color names to CSS variables defined in globals.css
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Keep the old theme colors commented or remove if fully replaced by CSS variables
        // "bg-primary": {
        //   light: colors.gray[50],
        //   dark: colors.gray[900],
        // },
        // "bg-card": {
        //   light: colors.white,
        //   dark: colors.gray[800],
        // },
        // "border-base": {
        //   light: colors.gray[200],
        //   dark: colors.gray[700],
        // },
        // "color-primary": {
        //   light: colors.gray[800],
        //   dark: colors.gray[100],
        // },
        // "color-secondary": {
        //   light: colors.gray[600],
        //   dark: colors.gray[400],
        // },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ... other extensions like keyframes if needed
    },
  },
  plugins: [animatePlugin], // Use the imported plugin
};

export default config;
