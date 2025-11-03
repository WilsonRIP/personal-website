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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <CardAction>
            <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
          </CardAction>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-border">
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
                  className="text-xs px-2 py-1 rounded-md border border-border text-foreground bg-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {hasAddons && (
            <div className="text-xs text-primary font-medium">
              ⚡ Customizable with addons available
            </div>
          )}

          {isInCart && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ {existingCartItem?.quantity} in cart
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            className={`${
              isInCart && hasAddons 
                ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white" 
                : isInCart 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
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


