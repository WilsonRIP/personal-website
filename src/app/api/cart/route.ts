import { NextRequest, NextResponse } from "next/server";
import { addOrIncrement, readRawCart, removeItem, setCartAndRespond, setQuantity, toDetailedCart, writeRawCart } from "./_shared";

export async function GET() {
  const raw = await readRawCart();
  const detail = await toDetailedCart(raw);
  return NextResponse.json(detail);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { productId, quantity = 1, selectedAddons = [] } = body ?? {};
  if (typeof productId !== "string" || typeof quantity !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (!Array.isArray(selectedAddons)) {
    return NextResponse.json({ error: "selectedAddons must be an array" }, { status: 400 });
  }
  const raw = await readRawCart();
  const updated = addOrIncrement(raw, productId, quantity, selectedAddons);
  return setCartAndRespond(updated);
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { productId, quantity } = body ?? {};
  if (typeof productId !== "string" || typeof quantity !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const raw = await readRawCart();
  const updated = setQuantity(raw, productId, quantity);
  return setCartAndRespond(updated);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const clearAll = url.searchParams.get("all");
  const raw = await readRawCart();

  if (clearAll === "1") {
    return writeRawCart([]);
  }

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  const updated = removeItem(raw, productId);
  return setCartAndRespond(updated);
}


