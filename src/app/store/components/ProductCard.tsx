"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "../types";
import { useCart } from "../CartContext";
import AddonModal from "./AddonModal";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [showAddonModal, setShowAddonModal] = useState(false);

  // Check if this product is already in the cart
  const existingCartItem = items.find(item => item.product.id === product.id);
  const isInCart = !!existingCartItem;
  const hasAddons = product.addons && product.addons.length > 0;

  const handleAddToCart = () => {
    if (hasAddons) {
      setShowAddonModal(true);
    } else {
      addItem(product, 1);
    }
  };

  const handleAddonSelection = (selectedAddons: string[]) => {
    addItem(product, 1, selectedAddons);
    setShowAddonModal(false);
  };

  const handleSkipAddons = () => {
    addItem(product, 1);
    setShowAddonModal(false);
  };

  const getButtonText = () => {
    if (isInCart && hasAddons) {
      return "Update Addons";
    } else if (isInCart) {
      return "In Cart";
    } else if (hasAddons) {
      return "Add to Cart";
    } else {
      return "Add to Cart";
    }
  };

  const getButtonDisabled = () => {
    return isInCart && !hasAddons; // Disable if in cart and no addons
  };

  return (
    <>
      <Card className="border-[#e5e7eb] dark:border-[#1f2937]">
        <CardHeader>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <CardAction>
            <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
          </CardAction>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-[#e5e7eb] dark:border-[#1f2937]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          </div>
          
          {product.tags && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md border border-[#e5e7eb] dark:border-[#1f2937] text-[#0f172a] dark:text-[#e5e7eb] bg-[#f8fafc] dark:bg-[#0b1220]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {hasAddons && (
            <div className="text-xs text-[#0ea5e9] dark:text-[#38bdf8] font-medium">
              ⚡ Customizable with addons available
            </div>
          )}

          {isInCart && (
            <div className="text-xs text-[#16a34a] dark:text-[#22c55e] font-medium">
              ✓ {existingCartItem?.quantity} in cart
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            className={`${
              isInCart && hasAddons 
                ? "bg-[#f59e0b] hover:bg-[#d97706]" 
                : isInCart 
                ? "bg-[#6b7280] hover:bg-[#4b5563] cursor-not-allowed" 
                : "bg-[#0ea5e9] hover:bg-[#0284c7]"
            }`}
            onClick={handleAddToCart}
            disabled={getButtonDisabled()}
            aria-label={`${getButtonText()} for ${product.name}`}
          >
            {getButtonText()}
          </Button>
        </CardFooter>
      </Card>

      {showAddonModal && (
        <AddonModal
          product={product}
          onConfirm={handleAddonSelection}
          onSkip={handleSkipAddons}
          onClose={() => setShowAddonModal(false)}
          isUpdate={isInCart}
        />
      )}
    </>
  );
}


