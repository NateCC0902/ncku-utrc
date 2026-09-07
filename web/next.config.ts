import type { NextConfig } from "next";

// GitHub Pages serves a project site under /<repo>, so every asset URL needs
// that prefix. Set by the deploy workflow; empty locally, where the site is
// served from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Pages is static hosting: no server, so prerender everything to HTML.
  output: "export",
  basePath,
  // Emits <page>/index.html rather than <page>.html, which Pages resolves
  // without relying on its implicit .html fallback.
  trailingSlash: true,
  images: {
    // The optimiser is a server route and cannot run on Pages, so images are
    // served as-is. `unoptimized: true` would do that but short-circuits the
    // loader, and the loader is what re-applies basePath — which next/image
    // otherwise drops for un-optimised sources.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  // Dev-only: lets phones/laptops on the LAN load /_next dev resources.
  allowedDevOrigins: ["192.168.50.*", "*.local"],
};

export default nextConfig;
