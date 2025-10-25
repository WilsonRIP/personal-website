import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceIds, quantities, successUrl, cancelUrl } = body;

    if (!priceIds || !Array.isArray(priceIds) || priceIds.length === 0) {
      return NextResponse.json({ error: "Price IDs required" }, { status: 400 });
    }

    if (!quantities || !Array.isArray(quantities) || quantities.length !== priceIds.length) {
      return NextResponse.json({ error: "Quantities must match price IDs" }, { status: 400 });
    }

    // Fetch price details from Stripe
    const lineItems = [];
    for (let i = 0; i < priceIds.length; i++) {
      const price = await stripe.prices.retrieve(priceIds[i], {
        expand: ['product'],
      });

      if (!price) {
        return NextResponse.json({ error: `Price ${priceIds[i]} not found` }, { status: 404 });
      }

      lineItems.push({
        price: priceIds[i], // Use existing price ID
        quantity: quantities[i],
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
