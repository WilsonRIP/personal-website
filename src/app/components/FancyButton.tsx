"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface FancyButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  withIcon?: boolean;
  withAnimation?: boolean;
}

export default function FancyButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  withIcon = false,
  withAnimation = true,
}: FancyButtonProps) {
  // Generate classes based on variant
  const variantClass = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    accent: "bg-accent text-accent-foreground hover:bg-accent/80",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10",
    ghost: "bg-transparent hover:bg-secondary/50",
  }[variant];

  // Generate classes based on size
  const sizeClass = {
    sm: "text-sm px-3 py-1.5 rounded-full",
    md: "text-base px-4 py-2 rounded-full",
    lg: "text-lg px-6 py-3 rounded-full",
  }[size];

  // Animation class
  const animationClass = withAnimation ? "button-pop" : "";

  // Icon spacing if button has icon
  const iconSpacing = withIcon ? "inline-flex items-center gap-2" : "";

  // Common classes
  const commonClasses = `
    font-medium transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
    ${variantClass} ${sizeClass} ${animationClass} ${iconSpacing} ${className}
  `;

  // If href is provided, render as Link
  if (href) {
    return (
      <Link 
        href={href} 
        className={commonClasses}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={commonClasses}
    >
      {children}
    </button>
  );
}
