/**
 * Paper ground for the editorial system. Static and SSR-safe — no particles,
 * no scroll-linked darkening, no motion (the previous abyss layer caused a
 * hydration freeze; this one renders identically on server and client).
 *
 * Three fixed layers: the warm paper base, a faint cool settling toward the
 * lower edge (a quiet nod to depth), and a subtle grain so the surface reads
 * as paper rather than flat vector.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function PaperBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* warm paper base with a faint cool settling at the base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(178deg, #f6f3ea 0%, #f2efe5 58%, #ece8db 100%)",
        }}
      />
      {/* soft warm light from the top */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, rgba(255,252,244,0.7), transparent 60%)",
        }}
      />
      {/* paper grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
      />
    </div>
  );
}
