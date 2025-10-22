import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**', // Permite qualquer imagem do diretório /t/p/
      },
      // NOVO: Adicione este objeto para as imagens das HQs
      {
        protocol: 'https',
        hostname: 'comicvine.gamespot.com',
        port: '',
        pathname: '/a/uploads/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Otimizações de performance
  experimental: {
    optimizePackageImports: ['react-icons', 'recharts'],
  },
  // Compressão
  compress: true,
};

export default withBundleAnalyzer(nextConfig);
