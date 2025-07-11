/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    urlImports: ['https://fonts.googleapis.com']
  }
};

module.exports = nextConfig;