/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  // Configuración para desarrollo - proxy para evitar CORS
  async rewrites() {
    // Solo usar proxy si NEXT_PUBLIC_USE_PROXY no está en 'false'
    const useProxy = process.env.NEXT_PUBLIC_USE_PROXY !== 'false'
    
    if (!useProxy) {
      return []
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'
    
    // Remover /api del destino ya que ya está en la URL
    const baseUrl = apiUrl.replace(/\/api$/, '')
    
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;
