"use client";

import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withPadding?: boolean;
  withMaxWidth?: boolean;
  withBackground?: boolean;
  centerContent?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  withPadding = true,
  withMaxWidth = true,
  withBackground = true,
  centerContent = false,
}: PageContainerProps) {
  // Padding classes
  const paddingClass = withPadding ? "px-4 py-8 md:px-6 md:py-12 lg:py-16" : "";
  
  // Max width constraint
  const maxWidthClass = withMaxWidth ? "mx-auto max-w-7xl w-full" : "";
  
  // Background styling
  const backgroundClass = withBackground ? "bg-background" : "";
  
  // Content alignment
  const contentClass = centerContent ? "flex flex-col items-center justify-center" : "";

  return (
    <div className={`${paddingClass} ${maxWidthClass} ${backgroundClass} ${contentClass} ${className}`}>
      {children}
    </div>
  );
}
