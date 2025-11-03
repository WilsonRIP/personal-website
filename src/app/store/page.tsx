import { Suspense } from "react";
import CartSheet from "./components/CartSheet";
import ProductCard from "./components/ProductCard";
import { getProducts } from "./data";

export const metadata = {
  title: "Store",
  description: "Professional website development packages with customizable addons.",
};

async function ProductsGrid() {
  try {
    const products = await getProducts();

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available at the moment.</p>
          <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load products.</p>
        <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page.</p>
      </div>
    );
  }
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
