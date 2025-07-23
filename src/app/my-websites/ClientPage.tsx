"use client";

import { useState, useEffect } from "react";
import MyWebsitesClient from "./components/MyWebsitesClient.fixed";
import PageContainer from "@/app/components/PageContainer";

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);

  // Only use this effect for hydration mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10"
        suppressHydrationWarning
      ></div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PageContainer>
        <MyWebsitesClient />
      </PageContainer>
    </main>
  );
}
