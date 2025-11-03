import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  try {
    const { priceId } = await params;

    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Fetch price from Stripe with product expanded
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    const product = price.product as Stripe.Product;

    // Transform to a format that includes both product and price info
    const transformedData = {
      priceId: price.id,
      productId: typeof product === 'string' ? product : product.id,
      product: typeof product === 'string' 
        ? null 
        : {
            id: product.id,
            name: product.name,
            description: product.description || '',
            image: product.images[0] || '/window.svg',
            tags: product.metadata?.tags?.split(',') || [],
          },
      unitAmount: price.unit_amount,
      currency: price.currency,
      price: price.unit_amount ? price.unit_amount / 100 : 0,
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching price from Stripe:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      if (error.statusCode === 404) {
        return NextResponse.json(
          { error: "Price not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}

