/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.155'],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;