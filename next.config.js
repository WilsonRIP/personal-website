/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Optimize production builds
  swcMinify: true,
  
  // Enable gzip compression
  compress: true,
  
  // Increase static file caching duration
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|gif|js|css)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
    ];
  },
  
  // Enable React strict mode
  reactStrictMode: true,
};

module.exports = nextConfig;
