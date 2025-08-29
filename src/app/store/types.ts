export type Addon = {
  id: string;
  name: string;
  description: string;
  price: number; // price in USD
  tags?: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // price in USD
  image: string; // path under public/
  tags?: string[];
  addons?: Addon[];
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedAddons?: string[]; // array of addon IDs
};

export type CartItemWithAddons = {
  product: Product;
  quantity: number;
  selectedAddons: Addon[];
};


