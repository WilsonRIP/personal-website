import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract cart items from metadata
        const cartItemsMetadata = session.metadata?.cart_items;
        if (cartItemsMetadata) {
          try {
            const cartItems: Array<{
              productId: string;
              quantity: number;
              selectedAddons: string[];
            }> = JSON.parse(cartItemsMetadata);

            // Here you would typically:
            // 1. Save the order to your database
            // 2. Send confirmation email
            // 3. Clear the cart
            // 4. Update inventory if applicable

            console.log("Order completed:", {
              sessionId: session.id,
              paymentStatus: session.payment_status,
              cartItems,
            });

            // For now, we'll just log the successful payment
            // In a real application, you'd want to:
            // - Save order to database
            // - Send confirmation email
            // - Clear cart
            // - Update inventory

          } catch (parseError) {
            console.error("Failed to parse cart items metadata:", parseError);
          }
        }
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
