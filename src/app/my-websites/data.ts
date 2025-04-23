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
];
