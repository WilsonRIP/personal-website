"use client";

import { ReactNode } from "react";

interface FancyCardProps {
  children: ReactNode;
  className?: string;
  withHoverEffect?: boolean;
  withBorder?: boolean;
  withShadow?: boolean;
  withAnimation?: "fade" | "scale" | "slide" | "none";
}

export default function FancyCard({
  children,
  className = "",
  withHoverEffect = true,
  withBorder = true,
  withShadow = true,
  withAnimation = "none",
}: FancyCardProps) {
  // Animation class based on the selected animation type
  const animationClass = {
    fade: "fade-in",
    scale: "scale-in",
    slide: "slide-up",
    none: "",
  }[withAnimation];

  // Hover effect class
  const hoverClass = withHoverEffect ? "hover-lift" : "";
  
  // Border class
  const borderClass = withBorder ? "border border-border" : "";
  
  // Shadow class with dark mode consideration
  const shadowClass = withShadow ? "shadow-md dark:shadow-lg" : "";

  return (
    <div
      className={`
        rounded-xl bg-card text-card-foreground p-6
        ${borderClass}
        ${shadowClass}
        ${hoverClass}
        ${animationClass}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
