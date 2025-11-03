import Stripe from "stripe";
import type { Product } from "@/app/store/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

/**
 * Fetch a product by ID from Stripe (server-side)
 */
export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return null;
    }

    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    const defaultPrice = product.default_price as Stripe.Price;
    const price = defaultPrice ? defaultPrice.unit_amount! / 100 : 0;

    // Parse addons from metadata
    let addons = [];
    if (product.metadata?.addons) {
      try {
        addons = JSON.parse(product.metadata.addons);
        if (!Array.isArray(addons)) {
          addons = [];
        }
      } catch (error) {
        console.warn(`Failed to parse addons for product ${product.id}:`, error);
        addons = [];
      }
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: price,
      image: product.images[0] || '/window.svg',
      tags: product.metadata?.tags?.split(',') || [],
      addons: addons,
    };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Fetch a price by ID from Stripe (server-side)
 */
export async function fetchPriceById(priceId: string): Promise<{
  priceId: string;
  productId: string;
  product: Product | null;
  unitAmount: number | null;
  currency: string;
  price: number;
} | null> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return null;
    }

    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    const product = price.product as Stripe.Product;
    const productData: Product | null = typeof product === 'string' 
      ? null 
      : {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          image: product.images[0] || '/window.svg',
          tags: product.metadata?.tags?.split(',') || [],
          addons: [],
        };

    return {
      priceId: price.id,
      productId: typeof product === 'string' ? product : product.id,
      product: productData,
      unitAmount: price.unit_amount,
      currency: price.currency,
      price: price.unit_amount ? price.unit_amount / 100 : 0,
    };
  } catch (error) {
    console.error(`Error fetching price ${priceId}:`, error);
    return null;
  }
}

