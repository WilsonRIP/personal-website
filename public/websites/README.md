# Website Screenshots

This directory is used to store screenshots of your websites for the "My Websites" page.

## Adding Your Website Screenshots

1. Take high-quality screenshots of your websites (recommended resolution: 1280×720 or similar 16:9 aspect ratio)
2. Name your files with a descriptive name (e.g., `portfolio-screenshot.jpg`, `blog-screenshot.jpg`)
3. Place the files in this directory
4. Update the website data in `src/app/my-websites/components/MyWebsitesClient.tsx` to reference your images

## Recommended Naming Convention

Follow this pattern:

- `[website-name]-screenshot.[extension]`

Example:

- `portfolio-screenshot.jpg`
- `blog-screenshot.png`
- `ecommerce-screenshot.webp`

## Image Optimization

The website uses Next.js Image component which automatically optimizes your images. For best performance:

- Use modern formats like WebP or AVIF when possible
- Keep file sizes reasonable (under 500KB recommended)
- Maintain consistent aspect ratios (16:9 works best with the current design)
