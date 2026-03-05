"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync sheet state for accessibility (optional, if you need to know if it's open)
  const handleOpenChange = (open: boolean) => {
    setIsMobileMenuOpen(open);
  };

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl md:w-[90%] md:max-w-4xl",
        "transition-all duration-500 ease-in-out rounded-full",
        "bg-background/70 backdrop-blur-xl border border-white/10 dark:border-white/5",
        isScrolled ? "py-2 px-4 shadow-2xl" : "py-3 px-4 md:px-6 shadow-xl",
        "text-foreground"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-10 md:h-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 -ml-2"
          aria-label="Wilson Home"
        >
          <Image
            src="/icon.png"
            alt=""
            width={32}
            height={32}
            className="w-7 h-7 rounded-full transition-transform duration-300 group-hover:scale-110"
            priority
          />
          <span className="font-bold text-lg md:text-xl tracking-wide text-foreground hidden sm:inline-block">
            Wilson
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center"
        >
          <ul className="flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ href, label, shortLabel }) => {
              const isActive = pathname === href;
              // Simple logic to shorten text on smaller desktop screens if needed
              const displayLabel = label;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {displayLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle aria-label="Toggle theme" />
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle aria-label="Toggle theme" />
            <Sheet open={isMobileMenuOpen} onOpenChange={handleOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Open main menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] backdrop-blur-xl bg-background/95 border-l border-border"
              >
                <SheetHeader className="mb-6 border-b border-border pb-4">
                  <SheetTitle className="flex items-center gap-2 justify-start text-foreground">
                    <Image
                      src="/icon.png"
                      alt=""
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="font-bold text-lg">Wilson</span>
                  </SheetTitle>
                </SheetHeader>

                <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                  {navLinks.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center w-full px-4 py-3 text-base font-medium rounded-md transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          {label}
                          {isActive && (
                            <span className="ml-auto text-xs opacity-70">
                              Current
                            </span>
                          )}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}