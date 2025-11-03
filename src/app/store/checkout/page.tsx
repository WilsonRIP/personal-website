"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Trash2, Loader2, Plus, Minus, X } from "lucide-react";
import type { Addon, CartItem } from "../types";
import AddonModal from "../components/AddonModal";

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clear, removeItem, updateQuantity, updateAddons } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingAddonsFor, setEditingAddonsFor] = useState<string | null>(null);

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

  const handleRemoveAddon = (productId: string, addonId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (!item) return;
    
    const updatedAddons = item.selectedAddons?.filter(id => id !== addonId) || [];
    updateAddons(productId, updatedAddons);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find(i => i.product.id === productId);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity(productId, newQuantity);
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
          <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={clear} disabled={items.length === 0}>
            Clear Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            </Card>
          ) : (
            items.map((item) => {
              const selectedAddons = getSelectedAddons(item);
              const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

              return (
                <Card key={item.product.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover border border-border"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate text-foreground">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </div>
                          {addonTotal > 0 && (
                            <div className="text-xs text-primary mt-1">
                              +${addonTotal.toFixed(2)} addons
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="font-semibold text-foreground">${getLineTotal(item)}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Remove ${item.product.name}`}
                            onClick={() => removeItem(item.product.id)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <div className="flex items-center gap-1 border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.product.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Addons List with Remove Buttons */}
                      {selectedAddons.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">Addons:</div>
                          {selectedAddons.map((addon: Addon) => (
                            <div key={addon.id} className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-muted p-2 rounded-md">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                <span>{addon.name}</span>
                                <span className="text-primary">(+${addon.price.toFixed(2)})</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => handleRemoveAddon(item.product.id, addon.id)}
                                aria-label={`Remove ${addon.name}`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Edit Addons Button */}
                      {item.product.addons && item.product.addons.length > 0 && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setEditingAddonsFor(item.product.id)}
                          >
                            {selectedAddons.length > 0 ? "Edit Addons" : "Add Addons"}
                          </Button>
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
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Order Summary</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-6">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium text-foreground">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <Button
              className="mt-6 w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
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

      {/* Addon Modal */}
      {editingAddonsFor && (() => {
        const item = items.find(i => i.product.id === editingAddonsFor);
        if (!item) return null;
        return (
          <AddonModal
            product={item.product}
            onConfirm={(selectedAddons) => {
              updateAddons(item.product.id, selectedAddons);
              setEditingAddonsFor(null);
            }}
            onSkip={() => {
              updateAddons(item.product.id, []);
              setEditingAddonsFor(null);
            }}
            onClose={() => setEditingAddonsFor(null)}
            isUpdate={true}
          />
        );
      })()}
    </main>
  );
}
