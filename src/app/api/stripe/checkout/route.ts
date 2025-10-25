import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fetchCart } from "../../../store/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(_req: NextRequest) {
  try {
    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured. Please set up Stripe API keys." },
        { status: 500 }
      );
    }

    // Get cart data
    const cartResponse = await fetchCart();

    if (cartResponse.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for Stripe using Price IDs or creating dynamic prices
    const lineItems = [];

    for (const item of cartResponse.items) {
      // Calculate addon prices
      let totalAddonPrice = 0;
      if (item.selectedAddons && item.product.addons) {
        totalAddonPrice = item.selectedAddons.reduce((sum: number, addonId: string) => {
          const addon = item.product.addons?.find((a: { id: string; name: string; description: string; price: number; tags?: string[] }) => a.id === addonId);
          return sum + (addon?.price || 0);
        }, 0);
      }

      const totalPriceInCents = Math.round((item.product.price + totalAddonPrice) * 100);

      // Create a dynamic price for this product with addons
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: item.product.image.startsWith('http')
              ? [item.product.image]
              : [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${item.product.image}`],
          },
          unit_amount: totalPriceInCents,
        },
        quantity: item.quantity,
      });

      // Add addon line items separately if they exist
      if (item.selectedAddons && item.product.addons) {
        item.selectedAddons.forEach((addonId: string) => {
          const addon = item.product.addons?.find((a: { id: string; name: string; description: string; price: number; tags?: string[] }) => a.id === addonId);
          if (addon) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${addon.name} (Addon)`,
                  description: addon.description,
                },
                unit_amount: Math.round(addon.price * 100),
              },
              quantity: item.quantity,
            });
          }
        });
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/checkout/cancel`,
      metadata: {
        cart_items: JSON.stringify(cartResponse.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedAddons: item.selectedAddons,
        }))),
      },
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
