"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "../CartContext";
import { Minus, Plus, ShoppingCart, Trash2, ShieldCheck, FileDown } from "lucide-react";
import type { Addon, CartItem } from "../types";

export default function CartSheet() {
  const { items, subtotal, totalItems, updateQuantity, removeItem, clear } = useCart();

  const hasItems = items.length > 0;
  const formattedSubtotal = useMemo(() => `$${subtotal.toFixed(2)}`, [subtotal]);

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Open cart"
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart ({totalItems})
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-full sm:max-w-md overflow-x-hidden">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {!hasItems && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Link
                href="/store"
                className="text-sm font-semibold text-primary hover:text-primary/80"
              >
                Continue shopping
              </Link>
            </div>
          )}
          {items.map((item) => {
            const lineTotal = getLineTotal(item);
            const selectedAddons = getSelectedAddons(item);
            const addonTotal = selectedAddons.reduce((sum: number, addon: Addon) => sum + addon.price, 0);
            
            return (
              <Card key={item.product.id}>
                <div className="flex gap-3 p-4 items-start">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={72}
                    height={72}
                    className="rounded-md object-cover border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate text-foreground">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          ${item.product.price.toFixed(2)} each
                        </div>
                        {addonTotal > 0 && (
                          <div className="text-xs text-primary">
                            +${addonTotal.toFixed(2)} addons
                          </div>
                        )}
                      </div>
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
                    
                    {selectedAddons.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {selectedAddons.map((addon: Addon) => (
                          <div key={addon.id} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {addon.name} (+${addon.price.toFixed(2)})
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm w-8 text-center text-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm font-semibold text-foreground">${lineTotal}</div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <SheetFooter>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formattedSubtotal}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure checkout (coming soon)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileDown className="h-4 w-4" />
              <span>Instant digital delivery</span>
            </div>
          </div>
          <div className="flex w-full gap-2 flex-col sm:flex-row">
            <Button
              className="flex-1 min-w-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={!hasItems}
              onClick={clear}
            >
              Clear
            </Button>
            {hasItems ? (
              <Button asChild className="flex-1 min-w-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/store/checkout">Checkout</Link>
              </Button>
            ) : (
              <Button className="flex-1 min-w-0 bg-primary opacity-50 text-primary-foreground" disabled>
                Checkout
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}


