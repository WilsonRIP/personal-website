// Define the website data structure
export interface Website {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  technologies: string[];
  color: string;
  featured?: boolean;
}

// Sample websites data (replace with your actual websites)
export const websites: Website[] = [
  {
    id: "EYN",
    title: "EYN",
    description:
      "Developer tools and utilities platform. Built for productivity and workflow optimization.",
    imageUrl: "/websites/eyn.png",
    url: "https://eyn.tools",
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
    color: "from-violet-500 to-purple-600",
    featured: true,
  },
  {
    id: "Wilson RIP Lag",
    title: "Wilson RIP Lag",
    description:
      "Personal website with project updates, portfolio, and creative work showcase.",
    imageUrl: "/websites/wilsonriplag.png",
    url: "https://wilsonriplag.com",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    color: "from-amber-500 to-orange-600",
    featured: true,
  },
  {
    id: "Speedtype",
    title: "Speedtype",
    description:
      "A typing game that challenges your typing speed and accuracy with custom modes.",
    imageUrl: "/websites/speedtype.png",
    url: "https://speedtype.net",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Shadcn UI",
    ],
    color: "from-blue-500 to-indigo-600",
    featured: false,
  },
  {
    id: "Word Counter",
    title: "Word Counter",
    description: "A simple website to count words, characters, and more.",
    imageUrl: "/websites/word-counter.png",
    url: "https://word-counter-website-gules.vercel.app/",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    color: "from-green-500 to-teal-600",
    featured: false,
  },
];
