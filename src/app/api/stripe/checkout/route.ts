import { NextResponse } from "next/server";
import Stripe from "stripe";
import { readRawCart, toDetailedCart } from "../../cart/_shared";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST() {
  try {
    // Check if Stripe keys are available
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured. Please set up Stripe API keys." },
        { status: 500 }
      );
    }

    // Get cart data directly from shared functions
    const rawCart = await readRawCart();
    const cartResponse = await toDetailedCart(rawCart);

    if (cartResponse.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for Stripe using Price IDs or creating dynamic prices
    const lineItems = [];

    for (const item of cartResponse.items) {
      // Create line item for the base product (without addons)
      const productData: {
        name: string;
        description?: string;
        images: string[];
      } = {
        name: item.product.name,
        images: item.product.image.startsWith('http')
          ? [item.product.image]
          : [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${item.product.image}`],
      };

      // Only include description if it's not empty (Stripe doesn't allow empty strings)
      if (item.product.description && item.product.description.trim().length > 0) {
        productData.description = item.product.description;
      }

      // Add base product line item (addons will be added as separate line items)
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      });

      // Add addon line items separately if they exist
      if (item.selectedAddons && item.product.addons) {
        item.selectedAddons.forEach((addonId: string) => {
          const addon = item.product.addons?.find((a: { id: string; name: string; description: string; price: number; tags?: string[] }) => a.id === addonId);
          if (addon) {
            const addonProductData: {
              name: string;
              description?: string;
            } = {
              name: `${addon.name} (Addon)`,
            };

            // Only include description if it's not empty (Stripe doesn't allow empty strings)
            if (addon.description && addon.description.trim().length > 0) {
              addonProductData.description = addon.description;
            }

            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: addonProductData,
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
