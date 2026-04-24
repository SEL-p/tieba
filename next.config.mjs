/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Suppress the crossOrigin warning from layout
  experimental: {},
};

export default nextConfig;
