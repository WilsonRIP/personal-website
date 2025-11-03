import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Fetch product from Stripe
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    // Get the default price
    const defaultPrice = product.default_price as Stripe.Price;
    const price = defaultPrice ? defaultPrice.unit_amount! / 100 : 0;

    // Parse addons from metadata
    // Addons can be stored in metadata as JSON string with key "addons"
    let addons = [];
    if (product.metadata?.addons) {
      try {
        addons = JSON.parse(product.metadata.addons);
        // Ensure addons is an array
        if (!Array.isArray(addons)) {
          addons = [];
        }
      } catch (error) {
        console.warn(`Failed to parse addons for product ${product.id}:`, error);
        addons = [];
      }
    }

    // Transform to our Product type
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: price,
      image: product.images[0] || '/window.svg',
      tags: product.metadata?.tags?.split(',') || [],
      addons: addons, // Parse from metadata
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Error fetching product from Stripe:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      if (error.statusCode === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

