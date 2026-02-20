import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { Alfa_Slab_One } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { WEBSITE_NAME } from "@/lib/types";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

// Optimize font loading
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const alfaSlabOne = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alfa-slab-one",
  display: "swap",
});

const aristaProBold = localFont({
  src: "../../public/fonts/Arista-Pro-Bold-trial.ttf",
  display: "swap",
  variable: "--font-arista-pro-bold",
});

// Enhanced viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1c1f" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Enhanced metadata configuration
export const metadata: Metadata = {
  title: {
    template: `%s | ${WEBSITE_NAME}`,
    default: WEBSITE_NAME,
  },
  description: `Official website for ${WEBSITE_NAME}`,
  icons: {
    icon: "/icon.ico",
    apple: "/apple-touch-icon.png",
  },
  // Update with your actual domain when deploying
  metadataBase: new URL("https://example.com"),
  openGraph: {
    type: "website",
    siteName: WEBSITE_NAME,
    title: WEBSITE_NAME,
    description: `Official website for ${WEBSITE_NAME}`,
    images: [
      {
        url: "/icon.ico",
        width: 1200,
        height: 630,
        alt: WEBSITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WEBSITE_NAME,
    description: `Official website for ${WEBSITE_NAME}`,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to required origins for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${archivo.variable} ${geistMono.variable} ${alfaSlabOne.variable} ${aristaProBold.variable} antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="website-theme"
        >
          <div className="noise-overlay" />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
