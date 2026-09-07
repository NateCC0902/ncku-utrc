import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: lets phones/laptops on the LAN load /_next dev resources.
  allowedDevOrigins: ["192.168.50.*", "*.local"],
};

export default nextConfig;
