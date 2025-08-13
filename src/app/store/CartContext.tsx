"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "./types";
import { addToCart, clearCart, fetchCart, removeFromCart, setCartQuantity } from "./api";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchCart()
      .then((res) => {
        if (!mounted) return;
        setItems(res.items);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    addToCart(product.id, quantity)
      .then((res) => setItems(res.items))
      .catch(() => {
        // best-effort fallback
        setItems((prev) => {
          const existing = prev.find((ci) => ci.product.id === product.id);
          if (existing) {
            return prev.map((ci) =>
              ci.product.id === product.id ? { ...ci, quantity: ci.quantity + quantity } : ci
            );
          }
          return [...prev, { product, quantity }];
        });
      });
  }, []);

  const removeItem = useCallback((productId: string) => {
    removeFromCart(productId)
      .then((res) => setItems(res.items))
      .catch(() => setItems((prev) => prev.filter((ci) => ci.product.id !== productId)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartQuantity(productId, quantity)
      .then((res) => setItems(res.items))
      .catch(() =>
        setItems((prev) =>
          prev
            .map((ci) => (ci.product.id === productId ? { ...ci, quantity } : ci))
            .filter((ci) => ci.quantity > 0)
        )
      );
  }, []);

  const clear = useCallback(() => {
    clearCart().finally(() => setItems([]));
  }, []);

  const totalItems = useMemo(() => items.reduce((acc, ci) => acc + ci.quantity, 0), [items]);
  const subtotal = useMemo(
    () => Number(items.reduce((acc, ci) => acc + ci.product.price * ci.quantity, 0).toFixed(2)),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear, subtotal, totalItems }),
    [items, addItem, removeItem, updateQuantity, clear, subtotal, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


