"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <main className="container mx-auto px-4 md:px-6 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Cancel Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Cancel Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">Your Cart is Still Available</span>
            </div>

            <div className="text-sm text-muted-foreground text-left">
              <p>• All items in your cart have been preserved</p>
              <p>• You can return to checkout at any time</p>
              <p>• Your selections and quantities remain unchanged</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/store/checkout">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Checkout
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/store">
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-muted-foreground">
          <p>Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </main>
  );
}
