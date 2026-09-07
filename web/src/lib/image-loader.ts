/**
 * Prefixes image sources with the deployment's base path.
 *
 * `next/image` does not apply `basePath` to an unoptimized source — it hands
 * the raw `src` straight to the browser — so on a GitHub Pages project site
 * every image would be requested from the domain root and 404. A custom loader
 * is the one hook that covers every <Image> without touching call sites.
 *
 * Static export has no optimiser, so width and quality are ignored.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }): string {
  return src.startsWith("/") ? `${BASE}${src}` : src;
}
