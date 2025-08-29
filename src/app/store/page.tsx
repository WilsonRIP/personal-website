import { Suspense } from "react";
import CartSheet from "./components/CartSheet";
import ProductCard from "./components/ProductCard";
import { products } from "./data";

export const metadata = {
  title: "Store",
  description: "Professional website development packages with customizable addons.",
};

function ProductsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default function StorePage() {
  return (
      <main className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Store</h1>
            <p className="text-sm text-muted-foreground">Professional website development packages with customizable addons</p>
          </div>
          <div className="ml-auto">
            <CartSheet />
          </div>
        </div>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading products…</p>}>
          <ProductsGrid />
        </Suspense>
      </main>
  );
}


