"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "../types";
import { useCart } from "../CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
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
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          className="bg-[#0ea5e9] hover:bg-[#0284c7]"
          onClick={() => addItem(product, 1)}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}


