/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/Forge',
  assetPrefix: '/Forge',
  reactStrictMode: true,
  images: {
    unoptimized: true, // Requerido para export estático
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
