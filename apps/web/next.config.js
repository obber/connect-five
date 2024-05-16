/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@c5/api-client"],
  images: {
    remotePatterns: [
      {
        hostname: "via.placeholder.com",
      },
      {
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

module.exports = nextConfig;
