"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "./types";
import { addToCart, clearCart, fetchCart, removeFromCart, setCartQuantity, updateCartItemAddons } from "./api";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedAddons?: string[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateAddons: (productId: string, selectedAddons: string[]) => void;
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

  const addItem = useCallback((product: Product, quantity = 1, selectedAddons: string[] = []) => {
    addToCart(product.id, quantity, selectedAddons)
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
          return [...prev, { product, quantity, selectedAddons }];
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

  const updateAddons = useCallback((productId: string, selectedAddons: string[]) => {
    updateCartItemAddons(productId, selectedAddons)
      .then((res) => setItems(res.items))
      .catch(() =>
        setItems((prev) =>
          prev.map((ci) => (ci.product.id === productId ? { ...ci, selectedAddons } : ci))
        )
      );
  }, []);

  const clear = useCallback(() => {
    clearCart().finally(() => setItems([]));
  }, []);

  const totalItems = useMemo(() => items.reduce((acc, ci) => acc + ci.quantity, 0), [items]);
  
  const subtotal = useMemo(() => {
    return Number(
      items.reduce((acc, ci) => {
        const basePrice = ci.product.price * ci.quantity;
        const addonPrice = ci.selectedAddons?.reduce((addonAcc, addonId) => {
          const addon = ci.product.addons?.find(a => a.id === addonId);
          return addonAcc + (addon?.price || 0);
        }, 0) || 0;
        return acc + basePrice + (addonPrice * ci.quantity);
      }, 0).toFixed(2)
    );
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, updateAddons, clear, subtotal, totalItems }),
    [items, addItem, removeItem, updateQuantity, updateAddons, clear, subtotal, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


