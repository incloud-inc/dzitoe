/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: [
    "@dzitoe/shared",
    "@dzitoe/ui",
    "@dzitoe/db",
    "@dzitoe/auth",
    "@dzitoe/theme",
    "@dzitoe/utils"
  ],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
