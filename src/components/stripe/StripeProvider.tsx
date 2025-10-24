"use client";

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const options = {
    // Stripe Elements options
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter:400,500,600',
      },
    ],
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
