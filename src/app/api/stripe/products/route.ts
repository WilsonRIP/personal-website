import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function GET() {
  try {
    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY not found, returning fallback products');
      // Return fallback products when Stripe is not configured
      return NextResponse.json([
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
      ]);
    }

    // Fetch all products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Transform Stripe products to our Product type
    const transformedProducts = products.data.map(stripeProduct => {
      const defaultPrice = stripeProduct.default_price as Stripe.Price;
      const price = defaultPrice ? defaultPrice.unit_amount! / 100 : 0; // Convert cents to dollars

      // Parse addons from metadata
      // Addons can be stored in metadata as JSON string with key "addons"
      // Format: {"addons": "[{\"id\":\"ecommerce\",\"name\":\"E-commerce\",\"description\":\"...\",\"price\":15.0}]"}
      let addons = [];
      if (stripeProduct.metadata?.addons) {
        try {
          addons = JSON.parse(stripeProduct.metadata.addons);
          // Ensure addons is an array
          if (!Array.isArray(addons)) {
            addons = [];
          }
        } catch (error) {
          console.warn(`Failed to parse addons for product ${stripeProduct.id}:`, error);
          addons = [];
        }
      }

      return {
        id: stripeProduct.id,
        name: stripeProduct.name,
        description: stripeProduct.description || '',
        price: price,
        image: stripeProduct.images[0] || '/window.svg', // Use first image or fallback
        tags: stripeProduct.metadata?.tags?.split(',') || [],
        addons: addons, // Parse from metadata
      };
    });

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching products from Stripe:", error);

    // Return fallback products on error to prevent crashes
    return NextResponse.json([
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
    ]);
  }
}
