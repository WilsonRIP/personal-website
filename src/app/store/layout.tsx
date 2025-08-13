"use client";

import { CartProvider } from "./CartContext";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}


