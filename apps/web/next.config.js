/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/Forge',
  assetPrefix: '/Forge',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Ignorar errores de TypeScript y ESLint en el build de producción
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
