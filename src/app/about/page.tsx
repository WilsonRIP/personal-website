"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Youtube, 
  Twitch, 
  MessageCircle,
  Code,
  Camera,
  Video,
  Palette,
  Radio,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Code2,
  Database,
  Settings,
  TestTube
} from 'lucide-react';
import { useTheme } from "next-themes";

/* ––––––––– Config  ––––––––– */

const NAME = "Luke (WilsonIIRIP)";

const userSkills = [
  { title: "Professional Full Stack Developer", icon: Code },
  { title: "Creative Coder", icon: Code2 },
  { title: "Photographer", icon: Camera },
  { title: "Video Editor", icon: Video },
  { title: "Photo Editor", icon: Palette },
  { title: "Content Creator (Streaming & YouTube)", icon: Radio },
];

const devStack = [
  { 
    name: "Frontend", 
    icon: Code,
    gradient: "from-blue-500 to-indigo-600",
    items: ["Next.js (React)", "Tailwind CSS", "Framer Motion", "TypeScript"] 
  },
  { 
    name: "Backend", 
    icon: Settings,
    gradient: "from-emerald-500 to-teal-600",
    items: ["Node.js", "Express", "Python (Flask/Django – exploring)"] 
  },
  { 
    name: "Database", 
    icon: Database,
    gradient: "from-violet-500 to-purple-600",
    items: ["PostgreSQL (with Prisma)", "MongoDB", "Supabase"] 
  },
  { 
    name: "DevOps/Tools", 
    icon: Settings,
    gradient: "from-orange-500 to-red-600",
    items: ["Docker", "Git/GitHub", "Vercel", "GitHub Actions"] 
  },
  { 
    name: "Testing", 
    icon: TestTube,
    gradient: "from-pink-500 to-rose-600",
    items: ["Jest", "React Testing Library", "Cypress (exploring)"] 
  },
];

const socialLinks = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/@wilsonrip",
    icon: Youtube,
    color: "hover:text-red-500",
    bgColor: "hover:bg-red-50 dark:hover:bg-red-900/20"
  },
  {
    name: "GitHub",
    url: "https://github.com/WilsonRIP",
    icon: Github,
    color: "hover:text-slate-800 dark:hover:text-white",
    bgColor: "hover:bg-slate-100 dark:hover:bg-slate-800"
  },
  {
    name: "Twitch",
    url: "https://www.twitch.tv/wilsoniirip",
    icon: Twitch,
    color: "hover:text-purple-500",
    bgColor: "hover:bg-purple-50 dark:hover:bg-purple-900/20"
  },
  {
    name: "Discord",
    url: "https://discord.gg/wKHnwHYgzF",
    icon: MessageCircle,
    color: "hover:text-indigo-500",
    bgColor: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
  },
];

/* ––––––––– Animations  ––––––––– */

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1 
    } 
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    } 
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

/* ––––––––– Page  ––––––––– */

export default function AboutPage() {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) {
    return (
      <main className={
        resolvedTheme === "dark"
          ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
      }>
        {/* Loading skeleton or fallback here if needed */}
      </main>
    );
  }
  const initials = NAME.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <main className={
      resolvedTheme === "dark"
        ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden"
        : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 relative overflow-hidden"
    }>
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      {/* Animated background blobs */}
      <div className="absolute top-20 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-teal-400/20 to-green-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="w-full max-w-6xl space-y-16 lg:space-y-20">
          
          {/* 1️⃣ Enhanced Header */}
          <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center space-y-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              Get to know me
            </motion.div>

            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent leading-tight" 
              style={{ fontFamily: "KOMIKAX, sans-serif" }}
            >
              About {NAME.split(" ")[0]}
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Professional Developer</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Creative Mind</span>
            </p>
          </motion.header>

          {/* 2️⃣ Enhanced Intro Section */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="relative"
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
              
              <CardContent className="relative z-10 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  {/* Enhanced Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <Avatar className="relative w-40 h-40 lg:w-48 lg:h-48 border-4 border-white dark:border-slate-700 shadow-2xl">
                      <AvatarImage
                        src="/cat.png"
                        alt={`${NAME} profile picture`}
                        className="object-cover"
                        onError={(e) => {
                          const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><rect width='160' height='160' fill='#cbd5e1'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='#475569'>Profile</text></svg>";
                          (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                        }}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Enhanced Bio */}
                  <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Who I Am
                      </h2>
                      <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p>
                          Hi there! I&apos;m <span className="font-semibold text-blue-600 dark:text-blue-400">{NAME}</span>, a Professional Developer based in the United States. I specialize in building robust and engaging digital experiences, combining technical skill with creative coding.
                        </p>
                        <p>
                          Outside of development, I&apos;m passionate about photography, video/photo editing, and content creation through streaming and YouTube. I thrive on learning and exploring new technologies.
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                      {[
                        { label: "Months Coding", value: "4+" },
                        { label: "Projects", value: "50+" },
                        { label: "Technologies", value: "20+" },
                        { label: "Sparkling Ice ", value: "∞" }
                      ].map((stat, statIndex) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + statIndex * 0.1 }}
                          className="text-center p-3 rounded-xl bg-slate-100/50 dark:bg-slate-700/50"
                        >
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 3️⃣ Enhanced Tabs Section */}
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="space-y-8"
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
              variants={fadeIn}
            >
              Explore My Expertise
            </motion.h2>

            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="flex w-full max-w-md mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                {[
                  { value: "journey", label: "My Journey" },
                  { value: "skills", label: "Skills" },
                  { value: "stack", label: "Tech Stack" }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 transition-all duration-300
                               hover:text-slate-900 dark:hover:text-white
                               data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900
                               data-[state=active]:text-slate-900 dark:data-[state=active]:text-white
                               data-[state=active]:shadow-lg data-[state=active]:scale-105"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Journey Tab */}
              <TabsContent value="journey" className="mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="journey"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
                      <CardContent className="relative z-10 p-8 lg:p-12">
                        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                          <p className="text-xl">
                            My journey into code began with a fascination for how websites worked. After mastering HTML, CSS, and vanilla JS, I embraced React and the Next.js framework, then ventured server-side with Node and Express.
                          </p>
                          <p className="text-xl">
                            Today I&apos;m experimenting with Supabase and advanced testing strategies while aiming to build delightful, performant apps that make a difference in users&apos; lives.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* Enhanced Skills Tab */}
              <TabsContent value="skills" className="mt-8">
                <motion.div
                  key="skills-content"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {userSkills.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <motion.div
                        key={skill.title}
                        variants={itemFade}
                        whileHover="hover"
                        initial="rest"
                        className="group"
                      >
                        <motion.div variants={cardHover}>
                          <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:bg-white/90 dark:group-hover:bg-slate-800/90">
                            <CardContent className="p-6 text-center space-y-4">
                              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="font-semibold text-lg text-slate-900 dark:text-white leading-tight">
                                {skill.title}
                              </h3>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>

              {/* Enhanced Stack Tab */}
              <TabsContent value="stack" className="mt-8">
                <motion.div
                  key="stack"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                      Below is the tool-chain I&apos;m currently enjoying (always evolving):
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devStack.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <motion.div
                          key={category.name}
                          variants={itemFade}
                          whileHover="hover"
                          initial="rest"
                          className="group"
                        >
                          <motion.div variants={cardHover}>
                            <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                              
                              <CardHeader className="relative z-10 pb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                  {category.name}
                                </h3>
                              </CardHeader>
                              
                              <CardContent className="relative z-10 pt-0">
                                <ul className="space-y-3">
                                  {category.items.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-center text-sm text-slate-700 dark:text-slate-300"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* 4️⃣ Enhanced CTA Section */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Let&apos;s Connect!
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Interested in discussing a project or collaboration? Feel free to reach out via the contact page or find me on these platforms:
              </p>
            </div>

            {/* Enhanced Social Links */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemFade}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 ${social.bgColor} ${social.color}`}
                  >
                    <IconComponent className="h-5 w-5 transition-colors duration-300" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-current transition-colors duration-300">
                      {social.name}
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 border-0"
              >
                <a href="/contact" className="flex items-center gap-2">
                  Contact Me
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}