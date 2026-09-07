import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages is static hosting: no server, so prerender everything to HTML.
  // The org site is served from the domain root, so no basePath is needed.
  output: "export",
  // Emits <page>/index.html rather than <page>.html, which Pages resolves
  // without relying on its implicit .html fallback.
  trailingSlash: true,
  // The optimiser is a server route and cannot run on Pages.
  images: { unoptimized: true },
  // Dev-only: lets phones/laptops on the LAN load /_next dev resources.
  allowedDevOrigins: ["192.168.50.*", "*.local"],
};

export default nextConfig;
