export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // price in USD
  image: string; // path under public/
  tags?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};


