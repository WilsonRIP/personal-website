This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Stripe Integration Setup

This project includes Stripe integration for the store checkout process. To set up Stripe:

1. **Create a Stripe Account**: Sign up at [https://stripe.com](https://stripe.com)

2. **Get API Keys**: Go to your Stripe Dashboard > Developers > API Keys
   - Copy your **Publishable Key** (starts with `pk_test_`)
   - Copy your **Secret Key** (starts with `sk_test_`)

3. **Set Environment Variables**: Create a `.env.local` file in the project root with:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

4. **Set Up Webhooks** (for production):
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Copy the webhook secret to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Dynamic Stripe Products Setup

This project now supports dynamic Stripe products instead of hardcoded packages. Here's how to set up your products in Stripe:

### Creating Products in Stripe Dashboard

1. **Go to Stripe Dashboard > Products**
2. **Create a Product** for each service/package:
   - **Name**: Your product name (e.g., "Website Package")
   - **Description**: Detailed description of the service
   - **Images**: Upload product images
   - **Metadata**: Add tags like `tags: website,development,package` (comma-separated)

3. **Set Pricing**:
   - Click on the product and go to "Pricing"
   - Create a price: Set amount in USD (e.g., $30.00 = 3000 cents)
   - Choose "One-time" for services
   - Make the price active

4. **For Addons** (Optional):
   - Create separate products for addons
   - Or use metadata to define addon options
   - The current implementation treats addons as separate line items

### Example Stripe Product Structure

```
Product: "Website Package"
├── Name: Website Package
├── Description: Professional website development...
├── Price: $30.00 (one-time)
└── Metadata: tags = "website,development,package"

Addons (separate products):
├── E-commerce Integration ($15.00)
├── Blog System ($10.00)
└── Custom Design ($20.00)
```

### Using the API

The `/api/stripe/products` endpoint will automatically fetch and display your Stripe products. The system includes fallback products for development when Stripe API is not available.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
