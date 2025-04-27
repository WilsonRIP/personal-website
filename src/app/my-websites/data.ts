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
    id: "Speedtype",
    title: "Speedtype",
    description:
      "A typing game that challenges your typing speed and accuracy.",
    imageUrl: "/websites/speedtype.png",
    url: "https://speedtype.net",
    technologies: [
      "Typescript",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Shadcn UI",
    ],
    color: "from-blue-500 to-indigo-600",
    featured: true,
  },
  // Add the new Word Counter website
  {
    id: "Word Counter",
    title: "Word Counter",
    description: "A simple website to count words, characters, and more.",
    imageUrl: "/websites/word-counter.png", // Add image to public/websites/
    url: "https://word-counter-website-gules.vercel.app/",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    color: "from-green-500 to-teal-600",
    featured: false,
  },
];
