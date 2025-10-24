import type { Product } from "./types";

// Cache for products to avoid repeated API calls
let productsCache: Product[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchProductsFromStripe(): Promise<Product[]> {
  try {
    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY not found, using fallback products');
      return getFallbackProducts();
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stripe/products`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stripeProducts = await response.json();

    // Transform Stripe products to our Product format
    return stripeProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      tags: product.tags,
      addons: product.addons || [],
    }));
  } catch (error) {
    console.error('Error fetching products from Stripe:', error);
    // Return fallback products if API fails
    return getFallbackProducts();
  }
}

function getFallbackProducts(): Product[] {
  return [
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
}

export async function getProducts(): Promise<Product[]> {
  const now = Date.now();

  // Return cached products if they're still fresh
  if (productsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return productsCache;
  }

  // Fetch fresh products from Stripe
  const freshProducts = await fetchProductsFromStripe();
  productsCache = freshProducts;
  lastFetchTime = now;

  return freshProducts;
}

// For backward compatibility, export a products getter
export const products: Product[] = [];
