"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

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
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out rounded-full",
        "bg-background/70 backdrop-blur-xl border border-white/10 dark:border-white/5",
        isScrolled ? "py-2 px-6 shadow-2xl w-[90%] max-w-4xl" : "py-3 px-6 md:px-8 shadow-xl w-[95%] max-w-5xl",
        "text-foreground"
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
              "font-bold ml-2 hidden sm:inline text-foreground"
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
                        "font-bold text-sm lg:text-base whitespace-nowrap relative group transition-all duration-300 ease-in-out bg-transparent",
                        isActive
                          ? "text-primary text-glow"
                          : "text-muted-foreground hover:text-foreground hover:text-glow-accent"
                      )}
                      data-state={isActive ? "active" : "inactive"}
                    >
                      {displayLabel}
                      <span
                        className={cn(
                          "absolute left-1/2 -bottom-[2px] h-[2px] rounded-full bg-primary",
                          "transform -translate-x-1/2 scale-x-0 transition-transform duration-500 ease-out",
                          "group-hover:scale-x-100 group-hover:bg-accent group-hover:shadow-[0_0_10px_var(--accent)]",
                          isActive && "scale-x-50 shadow-[0_0_10px_var(--primary)]"
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
                  className="z-50"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className={cn(
                  "w-3/4 sm:w-1/2 backdrop-blur-md shadow-lg border-r border-border bg-background/95"
                )}
              >
                <SheetHeader className="mb-4 border-b border-border pb-4">
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
                      <span className="font-bold text-lg text-foreground">
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
                            <hr className="my-1 border-border mx-4" />
                          )}
                          <SheetClose asChild>
                            <Link
                              href={href}
                              className={cn(
                                "font-bold block py-3 mx-4 text-base rounded-md transition-all duration-200 ease-in-out",
                                isActive
                                  ? "text-primary bg-primary/20 scale-105 shadow-inner"
                                  : "text-foreground hover:text-primary hover:bg-primary/10 hover:translate-x-1"
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
