import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../_utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const { sessionId } = await params;

    const resolvedSessionId = sessionId || req.nextUrl.searchParams.get('session_id');

    if (!resolvedSessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(resolvedSessionId, {
      expand: ['payment_intent'],
    });

    if (!stripeSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: stripeSession });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
