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

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // in cents
  selectedAddons: Addon[];
  addonPrice: number; // in cents
  totalPrice: number; // in cents
};

export type Order = {
  id: string;
  sessionId: string;
  items: OrderItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  createdAt: Date;
  customerEmail?: string;
};

export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
};
