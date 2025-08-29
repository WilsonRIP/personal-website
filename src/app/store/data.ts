import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "website-package",
    name: "Website Package",
    description: "Professional website development package. Includes responsive design, SEO optimization, and modern UI/UX. Perfect for businesses, portfolios, or personal projects.",
    price: 30.0,
    image: "/window.svg",
    tags: ["service", "website", "package", "development"],
    addons: [
      {
        id: "ecommerce",
        name: "E-commerce Integration",
        description: "Add shopping cart, payment processing, and product management",
        price: 15.0,
        tags: ["ecommerce", "payment", "shopping"],
      },
      {
        id: "blog",
        name: "Blog System",
        description: "Content management system with blog functionality",
        price: 10.0,
        tags: ["blog", "cms", "content"],
      },
      {
        id: "analytics",
        name: "Analytics & SEO",
        description: "Advanced analytics, SEO optimization, and performance monitoring",
        price: 12.0,
        tags: ["analytics", "seo", "performance"],
      },
      {
        id: "custom-design",
        name: "Custom Design",
        description: "Fully custom design tailored to your brand and preferences",
        price: 20.0,
        tags: ["design", "custom", "branding"],
      },
      {
        id: "hosting",
        name: "Hosting Setup",
        description: "Domain setup, hosting configuration, and deployment",
        price: 8.0,
        tags: ["hosting", "domain", "deployment"],
      },
      {
        id: "maintenance",
        name: "3-Month Maintenance",
        description: "3 months of updates, security patches, and technical support",
        price: 25.0,
        tags: ["maintenance", "support", "updates"],
      },
    ],
  },
];


