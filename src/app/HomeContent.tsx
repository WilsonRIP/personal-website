"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Code,
  Terminal,
  Cpu,
  MonitorPlay,
  Star,
  Github,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { WEBSITE_NAME } from "@/lib/types";
import { type GithubUserStats } from "@/lib/githubStats";
import RotatingStatsCards from "./components/RotatingStatsCards";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
};

function HomeStats({ stats }: { stats: GithubUserStats }) {
  const quickStats = [
    { label: "REPOSITORIES", value: stats.totalRepos, icon: Github, color: "text-primary text-glow" },
    { label: "TOTAL STARS", value: stats.totalStars, icon: Star, color: "text-accent text-glow-accent" },
    { label: "LANGUAGES", value: stats.topLanguages.length, icon: Code, color: "text-destructive text-glow" },
    { label: "ACTIVE YEARS", value: "1+", icon: TrendingUp, color: "text-foreground" },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:mt-32 border-t border-border pt-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {quickStats.map((stat, idx) => (
        <motion.div key={stat.label} variants={itemVariants} className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-bold">{stat.label}</span>
          </div>
          <div className={`text-5xl md:text-6xl font-bold tracking-tighter ${stat.color} font-mono`}>
            {stat.value}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function HomeContent({ githubStats }: { githubStats: GithubUserStats }) {
  return (
    <div className="relative pt-24 pb-16 md:pt-32">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none" />

      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center md:items-start text-center md:text-left w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-primary hidden md:block"></span>
          <span className="text-sm md:text-base tracking-[0.3em] uppercase text-primary font-bold">Vibe Coder / Content Creator</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="display-text text-[12vw] leading-[0.85] text-foreground relative z-10 break-words"
          style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
        >
          LUKE <br className="hidden md:block" />WILSON
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl font-mono leading-relaxed"
        >
          Crafting <span className="text-foreground font-bold border-b border-primary">unforgettable</span> digital experiences. I build bold, distinctive web applications that refuse to look like everything else.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mt-8 w-full md:w-auto">
          <Button asChild size="lg" className="h-14 px-8 bg-foreground text-background hover:bg-muted-foreground rounded-none shadow-[4px_4px_0_var(--accent)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_var(--accent)] transition-all">
            <Link href="/projects" className="uppercase tracking-widest font-bold text-sm">
              Explore Work
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 border-border text-foreground hover:bg-secondary rounded-none shadow-[4px_4px_0_var(--primary)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_var(--primary)] transition-all">
            <Link href="/contact" className="uppercase tracking-widest font-bold text-sm">
              Contact Me
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Quick Stats */}
      <HomeStats stats={githubStats} />

      {/* What I Do Section - Staggered List Layout */}
      <motion.section
        className="mt-32 space-y-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6">
          <h2 className="display-text text-5xl md:text-7xl">THE ARSENAL</h2>
          <p className="text-muted-foreground font-mono mt-4 md:mt-0 md:text-right max-w-xs uppercase text-xs tracking-widest">
            Specialized in building end-to-end production tools and cinematic frontends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 space-y-4">
          {[
            { tag: "01", title: "FRONTEND ENGINEERING", desc: "React, Next.js, and raw CSS crafting distinctive, non-generic user interfaces.", icon: MonitorPlay },
            { tag: "02", title: "CREATIVE CODING", desc: "Framer Motion, advanced visual effects, and pushing browser rendering limits.", icon: Cpu },
            { tag: "03", title: "FULL-STACK ARCHITECTURE", desc: "Robust APIs, real-time databases, and scalable backend services.", icon: Terminal }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 10 }}
              className="group flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-card border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-6 md:gap-12">
                <span className="font-mono text-muted-foreground text-xl border-b border-transparent group-hover:border-primary pb-1 group-hover:text-primary transition-colors">{item.tag}</span>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight uppercase group-hover:text-glow transition-all">{item.title}</h3>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-6 w-full md:w-1/3 justify-between md:justify-end">
                <p className="text-sm text-muted-foreground font-mono hidden md:block max-w-[250px]">{item.desc}</p>
                <div className="p-4 bg-secondary group-hover:bg-primary/20 rounded-full transition-colors">
                  <item.icon className="w-6 h-6 text-foreground group-hover:text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Rotating Analytics Section */}
      <motion.section
        className="mt-32 space-y-12 bg-secondary/30 p-8 md:p-16 border border-border relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="absolute -right-20 -bottom-20 rotate-12 opacity-5 pointer-events-none">
          <Github className="w-[400px] h-[400px] text-foreground" />
        </div>

        <motion.div variants={itemVariants} className="space-y-4 relative z-10">
          <h2 className="display-text text-4xl md:text-6xl">TELEMETRY</h2>
          <p className="text-muted-foreground font-mono uppercase tracking-widest text-sm max-w-xl">
            Real-time GitHub activity tracking and repository analytics synced automatically.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="relative z-10 box-glow overflow-visible">
          <RotatingStatsCards stats={githubStats} autoRotate={true} rotationInterval={3500} />
        </motion.div>
      </motion.section>
    </div>
  );
}