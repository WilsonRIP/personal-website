import type { Product, Addon } from "./types";

// Cache for products to avoid repeated API calls
// Note: In serverless environments, this cache is per-instance only
let productsCache: Product[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch products from Stripe API
 * Works in both server and client contexts
 */
async function fetchProductsFromStripe(): Promise<Product[]> {
  try {
    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY not found, using fallback products');
      return getFallbackProducts();
    }

    // In server components, we can use absolute URL or relative URL
    // For production builds, prefer relative URL to avoid issues with NEXT_PUBLIC_BASE_URL
    const baseUrl = typeof window === 'undefined' 
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
      : window.location.origin;
    
    const apiUrl = `${baseUrl}/api/stripe/products`;
    
    // Create abort controller for timeout (works in all environments)
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller 
      ? setTimeout(() => controller.abort(), 10000) // 10 second timeout
      : null;
    
    try {
      const response = await fetch(apiUrl, {
        cache: 'no-store',
        signal: controller?.signal,
      } as RequestInit);
      
      if (timeoutId) clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stripeProducts = await response.json();

      // Validate response is an array
      if (!Array.isArray(stripeProducts)) {
        console.warn('Products API returned non-array response, using fallback');
        return getFallbackProducts();
      }

      // Transform Stripe products to our Product format
      return stripeProducts.map((product: { id: string; name: string; description: string; price: number; image: string; tags: string[]; addons?: unknown[] }) => {
        // Validate and type addons
        let addons: Addon[] = [];
        if (product.addons && Array.isArray(product.addons)) {
          addons = product.addons.filter((addon): addon is Addon => {
            return (
              typeof addon === 'object' &&
              addon !== null &&
              'id' in addon &&
              'name' in addon &&
              'description' in addon &&
              'price' in addon &&
              typeof (addon as { id: unknown }).id === 'string' &&
              typeof (addon as { name: unknown }).name === 'string' &&
              typeof (addon as { description: unknown }).description === 'string' &&
              typeof (addon as { price: unknown }).price === 'number'
            );
          }) as Addon[];
        }

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          tags: product.tags,
          addons: addons,
        };
      });
    } catch (error: unknown) {
      if (timeoutId) clearTimeout(timeoutId);
      
      // Log the error type
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        console.warn('Products API request timed out, using fallback');
      } else {
        console.error('Error fetching products:', error);
      }
      
      // Return fallback products for any error
      return getFallbackProducts();
    }
  } catch (error) {
    // This outer catch handles any unexpected errors outside the fetch
    console.error('Unexpected error in fetchProductsFromStripe:', error);
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

/**
 * Get products with caching
 * Works in both server and client contexts
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const now = Date.now();

    // Return cached products if they're still fresh
    if (productsCache && (now - lastFetchTime) < CACHE_DURATION) {
      return productsCache;
    }

    // Fetch fresh products from Stripe
    const freshProducts = await fetchProductsFromStripe();
    
    // Validate products array
    if (!Array.isArray(freshProducts) || freshProducts.length === 0) {
      console.warn('No products returned, using fallback');
      const fallback = getFallbackProducts();
      productsCache = fallback;
      lastFetchTime = now;
      return fallback;
    }

    productsCache = freshProducts;
    lastFetchTime = now;

    return freshProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    // Return fallback on any error
    return getFallbackProducts();
  }
}

// For backward compatibility, export a products getter
export const products: Product[] = [];

/**
 * Fetch a single product by ID from Stripe
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stripe/products/${productId}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product = await response.json();
    return product as Product;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Fetch price data by Price ID from Stripe
 */
export async function getPriceById(priceId: string): Promise<{
  priceId: string;
  productId: string;
  product: Product | null;
  unitAmount: number | null;
  currency: string;
  price: number;
} | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stripe/prices/${priceId}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const priceData = await response.json();
    return priceData;
  } catch (error) {
    console.error(`Error fetching price ${priceId}:`, error);
    return null;
  }
}