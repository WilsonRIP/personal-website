"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";



const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/my-websites", label: "My Websites", shortLabel: "Websites" },
  { href: "/showcase", label: "Showcase" },
  { href: "/store", label: "Store" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Theme detection
  const isDark = resolvedTheme === "dark";

  // Only render component after mounting on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCompactView(window.innerWidth < 1024);
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

  // Prevent hydration mismatch by rendering a placeholder until client-side
  if (!mounted) {
    return (
      <header
        className={cn(
          "sticky top-0 z-50 h-16 md:h-[68px] backdrop-blur-lg"
        )}
      >
        <div className="container mx-auto flex items-center px-4 md:px-6 h-full"></div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ease-in-out",
        isScrolled ? "py-2 shadow-md" : "py-3 shadow-sm",
        isDark
          ? "bg-gradient-to-br from-slate-900/95 via-teal-900/30 to-blue-900/20 text-white shadow-gray-700/30"
          : "bg-gradient-to-br from-background/95 via-blue-900/20 to-teal-900/30 text-gray-800 shadow-black/10"
      )}
    >
      <div className="container mx-auto flex items-center h-10 md:h-12 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-xl md:text-2xl font-semibold tracking-wide mr-auto md:mr-8 group"
        >
          <Image
            src="/icon.png"
            alt="Cat"
            width={32}
            height={32}
            className="w-7 h-7 rounded-full transition-transform duration-300 group-hover:scale-110"
            priority
          />
          <span
            className={cn(
              "font-bold ml-2 hidden sm:inline text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
            )}
          >
            Wilson
          </span>
        </Link>

        {/* Desktop Navigation - Use NavigationMenu */}
        {!isMobile && (
          <NavigationMenu className="hidden md:flex flex-grow justify-center">
            <NavigationMenuList className="flex flex-wrap gap-x-1 lg:gap-x-2">
              {navLinks.map(({ href, label, shortLabel }) => {
                const isActive = pathname === href;
                const displayLabel =
                  isCompactView && shortLabel ? shortLabel : label;
                return (
                  <NavigationMenuItem key={href}>
                    <Link
                      href={href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-bold text-sm lg:text-base whitespace-nowrap relative group transition-colors duration-200 ease-in-out",
                        isActive
                          ? "text-teal-500 dark:text-teal-400 bg-teal-400/10 dark:bg-teal-400/15"
                          : "text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-400/10 dark:hover:bg-teal-400/15"
                      )}
                      data-state={isActive ? "active" : "inactive"}
                    >
                      {displayLabel}
                      <span
                        className={cn(
                          "absolute left-0 -bottom-[1px] h-0.5 w-full rounded bg-teal-500 dark:bg-teal-400",
                          "transform origin-left scale-x-0 transition-transform duration-300 ease-out",
                          "group-hover:scale-x-100",
                          isActive && "scale-x-100"
                        )}
                      />
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Theme Toggle */}
        {!isMobile && (
          <div className="ml-auto pl-4">
            <ThemeToggle aria-label="Toggle theme" />
          </div>
        )}

        {/* Mobile Content (Theme Toggle + Menu Button) */}
        {isMobile && (
          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle aria-label="Toggle theme" />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="z-50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className={cn(
                  "w-3/4 sm:w-1/2 backdrop-blur-md shadow-lg border-r",
                  isDark
                    ? "bg-slate-900/95 border-slate-700"
                    : "bg-background/95 border-slate-200"
                )}
              >
                <SheetHeader className="mb-4 border-b pb-4 dark:border-slate-700">
                  <SheetTitle className="text-center">
                    <Link
                      href="/"
                      className="flex items-center justify-center gap-2 group"
                    >
                      <Image
                        src="/icon.png"
                        alt="Cat"
                        width={24}
                        height={24}
                        className="rounded-full transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Wilson
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav>
                  <ul className="flex flex-col items-center py-2 space-y-1">
                    {navLinks.map(({ href, label }, index) => {
                      const isActive = pathname === href;
                      return (
                        <li key={href} className="w-full text-center">
                          {index > 0 && (
                            <hr className="my-1 border-slate-200 dark:border-slate-700 mx-4" />
                          )}
                          <SheetClose asChild>
                            <Link
                              href={href}
                                                  className={cn(
                      "font-bold block py-3 mx-4 text-base rounded-md transition-all duration-200 ease-in-out",
                                isActive
                                  ? "text-teal-600 dark:text-teal-400 bg-teal-400/20 dark:bg-teal-400/20 scale-105 shadow-inner"
                                  : "text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-400/10 dark:hover:bg-teal-400/15 hover:translate-x-1"
                              )}
                            >
                              {label}
                            </Link>
                          </SheetClose>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
