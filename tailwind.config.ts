import type { Config } from "tailwindcss";

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
      },
      // Add custom colors for light/dark themes if needed
      colors: {
        // Example: Define semantic colors
        // background: 'hsl(var(--background))',
        // foreground: 'hsl(var(--foreground))',
        // primary: 'hsl(var(--primary))',
        // ...
      },
    },
  },
  plugins: [],
};
export default config;
