"use client";

import React from "react";
import { motion } from "framer-motion";
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
  TestTube,
  LucideIcon
} from 'lucide-react';


/* ––––––––– Types & Interfaces  ––––––––– */

interface Skill {
  title: string;
  icon: LucideIcon;
}

interface DevStackCategory {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  items: string[];
}

interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface Stat {
  label: string;
  value: string;
}

interface TabItem {
  value: string;
  label: string;
}

/* ––––––––– Constants  ––––––––– */

const NAME = "Luke (WilsonIIRIP)";

const USER_SKILLS: Skill[] = [
  { title: "Professional Full Stack Developer", icon: Code },
  { title: "Creative Coder", icon: Code2 },
  { title: "Photographer", icon: Camera },
  { title: "Video Editor", icon: Video },
  { title: "Photo Editor", icon: Palette },
  { title: "Content Creator (Streaming & YouTube)", icon: Radio },
];

const DEV_STACK: DevStackCategory[] = [
  { 
    name: "Frontend", 
    icon: Code,
    color: "text-primary",
    bgColor: "bg-primary/10",
    items: ["Next.js (React)", "Tailwind CSS", "Framer Motion", "TypeScript"] 
  },
  { 
    name: "Backend", 
    icon: Settings,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    items: ["Node.js", "Express", "Python (Flask/Django – exploring)"] 
  },
  { 
    name: "Database", 
    icon: Database,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    items: ["PostgreSQL (with Prisma)", "MongoDB", "Supabase"] 
  },
  { 
    name: "DevOps/Tools", 
    icon: Settings,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    items: ["Docker", "Git/GitHub", "Vercel", "GitHub Actions"] 
  },
  { 
    name: "Testing", 
    icon: TestTube,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    items: ["Jest", "React Testing Library", "Cypress (exploring)"] 
  },
];

const SOCIAL_LINKS: SocialLink[] = [
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
    color: "hover:text-foreground",
    bgColor: "hover:bg-muted"
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

const STATS: Stat[] = [
  { label: "Months Coding", value: "4+" },
  { label: "Projects", value: "50+" },
  { label: "Technologies", value: "20+" },
  { label: "Sparkling Ice ", value: "∞" }
];

const TAB_ITEMS: TabItem[] = [
  { value: "journey", label: "My Journey" },
  { value: "skills", label: "Skills" },
  { value: "stack", label: "Tech Stack" }
];

/* ––––––––– Utility Functions  ––––––––– */

const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
};

const getFirstName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.split(" ")[0] || '';
};

/* ––––––––– Components  ––––––––– */

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = React.memo(({ skill, index }) => {
  const IconComponent = skill.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {skill.title}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SkillCard.displayName = 'SkillCard';

interface DevStackCardProps {
  category: DevStackCategory;
  index: number;
}

const DevStackCard: React.FC<DevStackCardProps> = React.memo(({ category, index }) => {
  const IconComponent = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
            <IconComponent className={`h-6 w-6 ${category.color}`} />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {category.name}
          </h3>
        </CardHeader>
        
        <CardContent className="pt-0">
          <ul className="space-y-3">
            {category.items.map((item) => (
              <li
                key={item}
                className="flex items-center text-sm text-muted-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-3 text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
});

DevStackCard.displayName = 'DevStackCard';

interface SocialLinkProps {
  social: SocialLink;
  index: number;
}

const SocialLink: React.FC<SocialLinkProps> = ({ social, index }) => {
  const IconComponent = social.icon;
  
  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`group flex items-center gap-3 px-6 py-3 rounded-lg bg-muted/50 border hover:shadow-md transition-all duration-300 ${social.bgColor} ${social.color}`}
    >
      <IconComponent className="h-5 w-5 transition-colors duration-300" />
      <span className="font-semibold text-foreground group-hover:text-current transition-colors duration-300">
        {social.name}
      </span>
    </motion.a>
  );
};

interface StatCardProps {
  stat: Stat;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.1 }}
    className="text-center p-4 rounded-lg bg-transparent border border-primary/50 backdrop-blur-sm hover:border-primary transition-all duration-300"
  >
    <div className="text-2xl font-bold text-primary">{stat.value}</div>
    <div className="text-sm text-muted-foreground">{stat.label}</div>
  </motion.div>
);

/* ––––––––– Main Component  ––––––––– */

export default function AboutPage(): React.JSX.Element {
  const [mounted, setMounted] = React.useState<boolean>(false);
  
  React.useEffect(() => { 
    setMounted(true); 
  }, []);
  
  // Early return for SSR hydration
  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="w-full max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <div className="h-8 bg-muted rounded-full w-48 mx-auto animate-pulse"></div>
              <div className="h-12 bg-muted rounded w-64 mx-auto animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  const initials = getInitials(NAME);
  const firstName = getFirstName(NAME);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="w-full max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              Get to know me
            </motion.div>

            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              About {firstName}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <span className="font-semibold">Professional Developer</span>
              <span className="mx-2">•</span>
              <span className="font-semibold">Creative Mind</span>
            </p>
          </motion.header>

          {/* Intro Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <Card className="border shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="relative"
                  >
                    <Avatar className="w-32 h-32 lg:w-40 lg:h-40 border-4 border-border shadow-lg">
                      <AvatarImage
                        src="/cat.png"
                        alt={`${NAME} profile picture`}
                        className="object-cover"
                        onError={(e) => {
                          const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><rect width='160' height='160' fill='#cbd5e1'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='#475569'>Profile</text></svg>";
                          (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                        }}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Bio */}
                  <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-4">
                        Who I Am
                      </h2>
                      <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                        <p>
                          Hi there! I&apos;m <span className="font-semibold text-primary">{NAME}</span>, a Professional Developer based in the United States. I specialize in building robust and engaging digital experiences, combining technical skill with creative coding.
                        </p>
                        <p>
                          Outside of development, I&apos;m passionate about photography, video/photo editing, and content creation through streaming and YouTube. I thrive on learning and exploring new technologies.
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                      {STATS.map((stat, index) => (
                        <StatCard key={stat.label} stat={stat} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Tabs Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <motion.h2 
              className="text-3xl font-bold text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Explore My Expertise
            </motion.h2>

            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="flex w-full max-w-md mx-auto bg-muted p-1 rounded-lg">
                {TAB_ITEMS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:scale-105"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Journey Tab */}
              <TabsContent value="journey" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border shadow-sm">
                    <CardContent className="p-8">
                      <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                        <p className="text-xl">
                        Full‑stack dev focused on TypeScript/React/Next.js, building fast, delightful UIs with Tailwind CSS v4 and shipping backends on Node/Express + Supabase. Experimenting with AI tooling and robust testing to ship with confidence.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {USER_SKILLS.map((skill, index) => (
                    <SkillCard key={skill.title} skill={skill} index={index} />
                  ))}
                </motion.div>
              </TabsContent>

              {/* Stack Tab */}
              <TabsContent value="stack" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Below is the tool-chain I&apos;m currently enjoying (always evolving):
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DEV_STACK.map((category, index) => (
                      <DevStackCard key={category.name} category={category} index={index} />
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Let&apos;s Connect!
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Interested in discussing a project or collaboration? Feel free to reach out via the contact page or find me on these platforms:
              </p>
            </div>

            {/* Social Links */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {SOCIAL_LINKS.map((social, index) => (
                <SocialLink key={social.name} social={social} index={index} />
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="px-8 py-3 rounded-lg font-semibold"
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