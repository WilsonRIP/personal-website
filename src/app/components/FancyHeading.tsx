"use client";

import { ReactNode } from "react";

interface FancyHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  className?: string;
  variant?: "fancy" | "bold" | "stylish";
  withAnimation?: boolean;
}

export default function FancyHeading({
  as = "h2",
  children,
  className = "",
  variant = "fancy", 
  withAnimation = false,
}: FancyHeadingProps) {
  const fontClass = {
    fancy: "font-extrabold tracking-tight",
    bold: "font-bold tracking-normal",
    stylish: "font-semibold tracking-wide",
  }[variant];

  const animationClass = withAnimation ? "slide-up" : "";
  
  const Element = as;

  const baseStyles = {
    h1: "text-4xl sm:text-5xl md:text-6xl",
    h2: "text-3xl sm:text-4xl md:text-5xl",
    h3: "text-2xl sm:text-3xl md:text-4xl",
    h4: "text-xl sm:text-2xl md:text-3xl",
    h5: "text-lg sm:text-xl md:text-2xl",
    h6: "text-base sm:text-lg md:text-xl",
  }[as];

  return (
    <Element className={`${baseStyles} ${fontClass} ${animationClass} ${className}`}>
      {children}
    </Element>
  );
}
