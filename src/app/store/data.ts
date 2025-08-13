import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "basic-website",
    name: "Basic Website Package",
    description: "A clean 1–3 page site: home, about, contact. Responsive, fast, and SEO-ready.",
    price: 50.0,
    image: "/window.svg",
    tags: ["service", "website", "package"],
  },
  {
    id: "speedtype-pro",
    name: "SpeedType Pro Theme",
    description: "Premium theme pack for SpeedType with custom layouts and effects.",
    price: 14.99,
    image: "/websites/speedtype.png",
    tags: ["theme", "typing", "ui"],
  },
  {
    id: "word-counter-plus",
    name: "Word Counter Plus",
    description: "Extended features for Word Counter with exports and analytics.",
    price: 9.99,
    image: "/websites/word-counter.png",
    tags: ["productivity", "tool"],
  },
  {
    id: "creator-pack",
    name: "Creator Asset Pack",
    description: "Handpicked overlays, transitions, and graphics for streamers and videos.",
    price: 24.0,
    image: "/cat.png",
    tags: ["stream", "assets"],
  },
];


