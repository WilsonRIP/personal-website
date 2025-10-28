"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "../../CartContext";

// Separate component for the content that uses useSearchParams
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const [orderDetails, setOrderDetails] = useState<{
    sessionId: string;
    amount: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    // Get session ID from URL parameters
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      // Fetch order details from Stripe session
      fetch(`/api/stripe/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.session) {
            setOrderDetails({
              sessionId,
              amount: data.session.amount_total / 100, // Convert from cents
              currency: data.session.currency,
            });
          }
        })
        .catch(error => {
          console.error('Error fetching session details:', error);
        });

      // Clear the cart since the order was successful
      clear();
    }
  }, [searchParams, clear]);

  return (
    <main className="container mx-auto px-4 md:px-6 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <Card className="p-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Order Details</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <div className="text-muted-foreground">Order ID</div>
                  <div className="font-mono text-xs">
                    {orderDetails.sessionId.slice(-8).toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-semibold">
                    ${orderDetails.amount.toFixed(2)} {orderDetails.currency.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">What&apos;s Next?</span>
            </div>

            <div className="text-sm text-muted-foreground space-y-2 text-left">
              <p>• We&apos;ll send you a confirmation email with your order details</p>
              <p>• Your website project will begin processing within 1-2 business days</p>
              <p>• You&apos;ll receive regular updates on the progress of your project</p>
              <p>• Feel free to contact us if you have any questions</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/store">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
