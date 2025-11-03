# Setting Up Addons in Stripe Products

Yes, you can add addons to Stripe products! This guide shows you how to configure addons using Stripe's metadata feature.

## How It Works

Addons are stored in the Stripe product's metadata as a JSON string. When the application fetches products from Stripe, it automatically parses the addons metadata and includes them in the product structure.

## Setting Up Addons in Stripe Dashboard

### Step 1: Create or Edit Your Product

1. Go to **Stripe Dashboard > Products**
2. Select your product (or create a new one)
3. Click on the product to edit it

### Step 2: Add Addons to Metadata

1. Scroll down to the **Metadata** section
2. Click **Add metadata**
3. Add a new metadata field:
   - **Key**: `addons`
   - **Value**: A JSON array of addon objects

### Step 3: Format the Addons JSON

The addons metadata should be a JSON string containing an array of addon objects. Each addon should have:

- `id` (string): Unique identifier for the addon
- `name` (string): Display name
- `description` (string): Description of the addon
- `price` (number): Price in USD (not cents)
- `tags` (array, optional): Array of tag strings

#### Example Metadata Value:

```json
[{"id":"ecommerce","name":"E-commerce Integration","description":"Add shopping cart, payment processing, and product management","price":15.0,"tags":["ecommerce","payment","shopping"]},{"id":"blog","name":"Blog System","description":"Content management system with blog functionality","price":10.0,"tags":["blog","cms","content"]},{"id":"analytics","name":"Analytics & SEO","description":"Advanced analytics, SEO optimization, and performance monitoring","price":12.0,"tags":["analytics","seo","performance"]}]
```

#### Formatted for Readability:

```json
[
  {
    "id": "ecommerce",
    "name": "E-commerce Integration",
    "description": "Add shopping cart, payment processing, and product management",
    "price": 15.0,
    "tags": ["ecommerce", "payment", "shopping"]
  },
  {
    "id": "blog",
    "name": "Blog System",
    "description": "Content management system with blog functionality",
    "price": 10.0,
    "tags": ["blog", "cms", "content"]
  },
  {
    "id": "analytics",
    "name": "Analytics & SEO",
    "description": "Advanced analytics, SEO optimization, and performance monitoring",
    "price": 12.0,
    "tags": ["analytics", "seo", "performance"]
  }
]
```

### Step 4: Save the Product

1. Click **Save** to update the product
2. The addons will now be automatically included when fetching products via the API

## Example: Complete Product Setup

For a product with ID `prod_TIVNhDgIWzSqxt`:

**Product Details:**
- Name: "Website Package"
- Description: "Professional website development package..."
- Price: $30.00

**Metadata:**
- `tags`: `website,development,package`
- `addons`: `[{"id":"ecommerce","name":"E-commerce Integration","description":"Add shopping cart, payment processing, and product management","price":15.0},{"id":"blog","name":"Blog System","description":"Content management system with blog functionality","price":10.0}]`

## Alternative: Separate Stripe Products for Addons

Instead of using metadata, you can also:

1. Create separate Stripe products for each addon
2. Store the addon product IDs in the main product's metadata
3. Update the code to fetch addon products separately

This approach gives you more flexibility but requires more complex logic.

## Testing

After setting up addons in Stripe:

1. Fetch products via `/api/stripe/products` or `/api/stripe/products/[productId]`
2. The response should include the `addons` array with all configured addons
3. The addons will appear in the product card and checkout flow

## Notes

- Prices in addons should be in USD (e.g., 15.0 for $15.00), not cents
- The metadata value must be valid JSON
- If the JSON is invalid, addons will default to an empty array
- Addons are optional - products work fine without them

