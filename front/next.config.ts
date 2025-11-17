import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
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
      // Superhero API images
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/gh/akabab/superhero-api@0.3.0/api/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.superherodb.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Otimizações de performance
  experimental: {
    optimizePackageImports: ['react-icons', 'recharts'],
    // Code splitting otimizado
    webpackBuildWorker: true,
  },
  // Compressão
  compress: true,
  // Code splitting otimizado
  webpack: (config, { dev, isServer }) => {
    // Otimizações para produção
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks separados
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // React e React-DOM separados
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          // Next.js separado
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next',
            chunks: 'all',
            priority: 20,
          },
          // Charts separados
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
          },
          // Icons separados
          icons: {
            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 15,
          },
          // Utils separados
          utils: {
            test: /[\\/]node_modules[\\/](lodash|papaparse|zod)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 10,
          },
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
