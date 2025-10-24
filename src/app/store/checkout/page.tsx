"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import type { Addon, CartItem } from "../types";

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clear, removeItem } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const getLineTotal = (item: CartItem) => {
    const basePrice = item.product.price * item.quantity;
    const addonPrice = item.selectedAddons?.reduce((sum: number, addonId: string) => {
      const addon = item.product.addons?.find((a: Addon) => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0) || 0;
    return (basePrice + (addonPrice * item.quantity)).toFixed(2);
  };

  const getSelectedAddons = (item: CartItem): Addon[] => {
    if (!item.selectedAddons || item.selectedAddons.length === 0) return [];
    return item.product.addons?.filter((addon: Addon) =>
      item.selectedAddons?.includes(addon.id)
    ) || [];
  };

  const handleStripeCheckout = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // You could add error handling here, like showing a toast notification
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted-foreground">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button asChild variant="outline">
            <Link href="/store">Back to Store</Link>
          </Button>
          <Button className="bg-[#ef4444] hover:bg-[#dc2626]" onClick={clear} disabled={items.length === 0}>
            Clear Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <Card className="p-6 border-[#e5e7eb] dark:border-[#1f2937]">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            </Card>
          ) : (
            items.map((item) => {
              const selectedAddons = getSelectedAddons(item);
              const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

              return (
                <Card key={item.product.id} className="p-4 border-[#e5e7eb] dark:border-[#1f2937]">
                  <div className="flex items-start gap-4">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover border border-[#e5e7eb] dark:border-[#1f2937]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{item.product.name}</div>
                          <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                            Qty {item.quantity} · ${item.product.price.toFixed(2)} each
                          </div>
                          {addonTotal > 0 && (
                            <div className="text-xs text-[#0ea5e9] dark:text-[#38bdf8] mt-1">
                              +${addonTotal.toFixed(2)} addons
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="font-semibold">${getLineTotal(item)}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Remove ${item.product.name}`}
                            onClick={() => removeItem(item.product.id)}
                            className="text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fee2e2]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {selectedAddons.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {selectedAddons.map((addon: Addon) => (
                            <div key={addon.id} className="text-xs text-[#6b7280] dark:text-[#94a3b8] flex items-center gap-1">
                              <span className="w-1 h-1 bg-[#0ea5e9] rounded-full"></span>
                              {addon.name} (+${addon.price.toFixed(2)})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>

        <aside className="space-y-4">
          <Card className="p-6 border-[#e5e7eb] dark:border-[#1f2937]">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-6">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <Button
              className="mt-6 w-full bg-[#22c55e] hover:bg-[#16a34a]"
              disabled={items.length === 0 || isProcessing}
              onClick={handleStripeCheckout}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${subtotal.toFixed(2)}`
              )}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Secure payment powered by Stripe
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
