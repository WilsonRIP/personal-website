import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

export const stripePromise = loadStripe(stripePublishableKey);

export const formatAmountForStripe = (amount: number, currency: string = 'usd'): number => {
  // Stripe expects amounts in the smallest currency unit (cents for USD)
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number, currency: string = 'usd'): number => {
  // Convert from Stripe's smallest currency unit back to dollars
  return amount / 100;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};
