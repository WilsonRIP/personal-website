"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "../CartContext";
import { Minus, Plus, ShoppingCart, Trash2, ShieldCheck, FileDown } from "lucide-react";

export default function CartSheet() {
  const { items, subtotal, totalItems, updateQuantity, removeItem, clear } = useCart();

  const hasItems = items.length > 0;
  const formattedSubtotal = useMemo(() => `$${subtotal.toFixed(2)}`, [subtotal]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Open cart"
          className="gap-2 border-[#e5e7eb] dark:border-[#1f2937] text-[#0f172a] dark:text-[#e5e7eb] hover:bg-[#f8fafc] dark:hover:bg-[#0b1220]"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart ({totalItems})
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-full sm:max-w-md overflow-x-hidden">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription className="text-[#6b7280] dark:text-[#94a3b8]">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {!hasItems && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <ShoppingCart className="h-8 w-8 text-[#9ca3af] dark:text-[#64748b]" />
              <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Your cart is empty.</p>
              <Link
                href="/store"
                className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
              >
                Continue shopping
              </Link>
            </div>
          )}
          {items.map(({ product, quantity }) => {
            const lineTotal = (product.price * quantity).toFixed(2);
            return (
              <Card key={product.id} className="border-[#e5e7eb] dark:border-[#1f2937]">
                <div className="flex gap-3 p-4 items-start">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={72}
                    height={72}
                    className="rounded-md object-cover border border-[#e5e7eb] dark:border-[#1f2937]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{product.name}</div>
                        <div className="text-xs text-[#6b7280] dark:text-[#94a3b8] truncate">
                          ${product.price.toFixed(2)} each
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => removeItem(product.id)}
                        className="text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fee2e2]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="border-[#e5e7eb] dark:border-[#1f2937] bg-[#f1f5f9] dark:bg-[#0f172a] hover:bg-[#e2e8f0] dark:hover:bg-[#111827] text-[#0f172a] dark:text-[#e5e7eb]"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="border-[#e5e7eb] dark:border-[#1f2937] bg-[#f1f5f9] dark:bg-[#0f172a] hover:bg-[#e2e8f0] dark:hover:bg-[#111827] text-[#0f172a] dark:text-[#e5e7eb]"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm font-semibold">${lineTotal}</div>
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
              <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Subtotal</span>
              <span className="font-semibold">{formattedSubtotal}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6b7280] dark:text-[#94a3b8]">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure checkout (coming soon)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6b7280] dark:text-[#94a3b8]">
              <FileDown className="h-4 w-4" />
              <span>Instant digital delivery</span>
            </div>
          </div>
          <div className="flex w-full gap-2 flex-col sm:flex-row">
            <Button
              className="flex-1 min-w-0 bg-[#14b8a6] hover:bg-[#0d9488]"
              disabled={!hasItems}
              onClick={clear}
            >
              Clear
            </Button>
            {hasItems ? (
              <Button asChild className="flex-1 min-w-0 bg-[#2563eb] hover:bg-[#1d4ed8]">
                <Link href="/store/checkout">Checkout</Link>
              </Button>
            ) : (
              <Button className="flex-1 min-w-0 bg-[#2563eb] opacity-50" disabled>
                Checkout
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}


