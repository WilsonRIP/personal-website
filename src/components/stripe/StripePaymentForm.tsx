"use client";

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: any) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
};

export function StripePaymentForm({
  amount,
  currency = 'usd',
  onSuccess,
  onError
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (methodError) {
        setError(methodError.message || 'An error occurred');
        onError?.(methodError);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        '{{CLIENT_SECRET}}', // This would need to be passed as a prop
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onError?.(confirmError);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}
