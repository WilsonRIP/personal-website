import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { products } from "@/app/store/data";
import type { CartItem, Product } from "@/app/store/types";

type RawCartItem = { 
  id: string; 
  quantity: number; 
  selectedAddons?: string[];
};

const CART_COOKIE = "cart";

export async function readRawCart(): Promise<RawCartItem[]> {
  try {
    const store = await cookies();
    const raw = store.get(CART_COOKIE)?.value;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RawCartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((it) => typeof it?.id === "string" && typeof it?.quantity === "number");
  } catch {
    return [];
  }
}

export function writeRawCart(rawItems: RawCartItem[]): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CART_COOKIE, JSON.stringify(rawItems), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export function toDetailedCart(rawItems: RawCartItem[]): { items: CartItem[]; subtotal: number; totalItems: number } {
  const productIndex = new Map<string, Product>(products.map((p) => [p.id, p]));
  const items: CartItem[] = [];
  for (const ri of rawItems) {
    const product = productIndex.get(ri.id);
    if (!product) continue;
    if (ri.quantity <= 0) continue;
    items.push({ 
      product, 
      quantity: ri.quantity, 
      selectedAddons: ri.selectedAddons || []
    });
  }
  
  const subtotal = Number(
    items.reduce((acc, it) => {
      const basePrice = it.product.price * it.quantity;
      const addonPrice = it.selectedAddons?.reduce((addonAcc, addonId) => {
        const addon = it.product.addons?.find(a => a.id === addonId);
        return addonAcc + (addon?.price || 0);
      }, 0) || 0;
      return acc + basePrice + (addonPrice * it.quantity);
    }, 0).toFixed(2)
  );
  
  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
  return { items, subtotal, totalItems };
}

export function setCartAndRespond(rawItems: RawCartItem[]) {
  const detail = toDetailedCart(rawItems);
  const res = NextResponse.json(detail);
  res.cookies.set(CART_COOKIE, JSON.stringify(rawItems), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export function addOrIncrement(rawItems: RawCartItem[], productId: string, quantity: number, selectedAddons: string[] = []) {
  const items = [...rawItems];
  const idx = items.findIndex((it) => it.id === productId);
  
  if (idx >= 0) {
    // Product already exists in cart
    const existingItem = items[idx];
    const product = products.find(p => p.id === productId);
    
    // If the product has addons and we're trying to add it again with different addons,
    // update the existing item with the new addon selection instead of incrementing quantity
    if (product?.addons && product.addons.length > 0 && selectedAddons.length > 0) {
      items[idx] = { 
        id: productId, 
        quantity: existingItem.quantity, // Keep existing quantity
        selectedAddons: selectedAddons // Update with new addon selection
      };
    } else {
      // For products without addons or when no new addons are selected, increment quantity
      items[idx] = { 
        id: productId, 
        quantity: existingItem.quantity + quantity,
        selectedAddons: selectedAddons.length > 0 ? selectedAddons : existingItem.selectedAddons
      };
    }
  } else {
    // Product doesn't exist, add it to cart
    items.push({ id: productId, quantity, selectedAddons });
  }
  
  return items.filter((it) => it.quantity > 0);
}

export function setQuantity(rawItems: RawCartItem[], productId: string, quantity: number) {
  const items = [...rawItems];
  const idx = items.findIndex((it) => it.id === productId);
  if (idx >= 0) {
    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx] = { 
        id: productId, 
        quantity,
        selectedAddons: items[idx].selectedAddons
      };
    }
  } else if (quantity > 0) {
    items.push({ id: productId, quantity });
  }
  return items;
}

export function removeItem(rawItems: RawCartItem[], productId: string) {
  return rawItems.filter((it) => it.id !== productId);
}


