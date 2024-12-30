import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Esto ignorará los errores de ESLint durante el build
  },
};

export default nextConfig;
