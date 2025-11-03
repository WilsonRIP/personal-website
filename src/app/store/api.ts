import type { CartItem } from "./types";

export type CartResponse = {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchCart(): Promise<CartResponse> {
  const res = await fetch("/api/cart", { cache: "no-store" });
  return handle<CartResponse>(res);
}

export async function addToCart(productId: string, quantity = 1, selectedAddons: string[] = []): Promise<CartResponse> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, selectedAddons }),
  });
  return handle<CartResponse>(res);
}

export async function setCartQuantity(productId: string, quantity: number): Promise<CartResponse> {
  const res = await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  return handle<CartResponse>(res);
}

export async function updateCartItemAddons(productId: string, selectedAddons: string[]): Promise<CartResponse> {
  const res = await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, selectedAddons }),
  });
  return handle<CartResponse>(res);
}

export async function removeFromCart(productId: string): Promise<CartResponse> {
  const res = await fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, { method: "DELETE" });
  return handle<CartResponse>(res);
}

export async function clearCart(): Promise<void> {
  await fetch(`/api/cart?all=1`, { method: "DELETE" });
}


