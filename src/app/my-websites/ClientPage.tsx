"use client";

import { useState, useEffect } from "react";
import MyWebsitesClient from "./components/MyWebsitesClient";

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);

  // Only use this effect for hydration mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-theme-gradient"
        suppressHydrationWarning
      ></div>
    );
  }

  return <MyWebsitesClient />;
}
