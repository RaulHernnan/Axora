/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.30.105'],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;