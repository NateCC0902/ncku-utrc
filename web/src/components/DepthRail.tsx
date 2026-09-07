"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const MAX_DEPTH = 300; // m — the seabed floor of the fleet's operating envelope
const TICKS = [0, 50, 100, 150, 200, 250, 300];

// The rail crosses onto the deep-ink footer at the end of the page. Rather
// than hiding the instrument there, it is drawn twice — ink on paper and
// paper on ledger — and the two copies are clipped against the footer's
// viewport edge, so every tick and the live readout flip palette exactly
// at the seabed line and stay legible from surface to colophon.
const PALETTES = {
  ink: {
    line: "bg-line-strong",
    traversed: "bg-tide",
    tickText: "text-ink-faint",
    markerRing: "ring-paper",
    readoutRule: "border-line-strong",
    readoutFigure: "text-ink",
    readoutUnit: "text-ink-muted",
    readoutSub: "text-ink-faint",
    header: "",
  },
  paper: {
    line: "bg-paper/30",
    traversed: "bg-tide-bright",
    tickText: "text-paper-dim",
    markerRing: "ring-ledger",
    readoutRule: "border-paper/60",
    readoutFigure: "text-paper",
    readoutUnit: "text-paper/85",
    readoutSub: "text-paper/85",
    header: "!text-paper-dim",
  },
} as const;

type Palette = (typeof PALETTES)[keyof typeof PALETTES];

function RailScale({
  palette,
  markerTop,
  depth,
  pressure,
}: {
  palette: Palette;
  markerTop: MotionValue<string>;
  depth: number;
  pressure: string;
}) {
  return (
    <div className="relative flex h-[46vh] max-h-[560px] min-h-[380px] flex-col">
      {/* Header */}
      <div className="mb-4">
        <span
          className={`hud !text-[0.55rem] !tracking-[0.22em] ${palette.header}`}
        >
          Sounding · m
        </span>
      </div>

      {/* Track */}
      <div className="relative flex-1">
        {/* sounding line */}
        <div className={`absolute left-[5px] top-0 h-full w-px ${palette.line}`} />
        {/* traversed depth, inked in */}
        <motion.div
          className={`absolute left-[5px] top-0 w-px origin-top ${palette.traversed}`}
          style={{ height: markerTop }}
        />

        {/* ticks */}
        {TICKS.map((t) => (
          <div
            key={t}
            className="absolute left-[5px] flex items-center gap-2"
            style={{ top: `${(t / MAX_DEPTH) * 100}%` }}
          >
            <span className={`block h-px w-2.5 ${palette.line}`} />
            <span
              className={`mono text-[0.55rem] leading-none ${palette.tickText}`}
            >
              {t}
            </span>
          </div>
        ))}

        {/* live marker — the single rare crimson signal */}
        <motion.div
          className="absolute left-[5px] z-10 -translate-x-1/2"
          style={{ top: markerTop }}
        >
          <span
            className={`block h-2 w-2 -translate-y-1/2 rounded-full bg-signal ring-2 ${palette.markerRing}`}
          />
        </motion.div>
      </div>

      {/* Readout — fixed-width numeric slots so the units stay put as
          the digit count grows (0 → 300 m) while scrolling. */}
      <div className={`mt-4 border-l pl-3 ${palette.readoutRule}`}>
        <div className="flex items-baseline gap-1">
          <span
            className={`figure inline-block min-w-[3ch] text-right text-[1.65rem] font-medium tabular-nums ${palette.readoutFigure}`}
          >
            {depth}
          </span>
          <span className={`mono text-[0.7rem] ${palette.readoutUnit}`}>m</span>
        </div>
        <div
          className={`mono mt-0.5 text-[0.6rem] tabular-nums ${palette.readoutSub}`}
        >
          <span className="inline-block min-w-[3ch] text-right">{pressure}</span>{" "}
          bar
        </div>
      </div>
    </div>
  );
}

export function DepthRail() {
  const { scrollY, scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });
  // Under reduced motion the marker tracks the scroll directly — a lagging
  // spring reads as motion, and a stalled frame loop must never strand it.
  const markerSource = reduceMotion ? scrollYProgress : smooth;
  const markerTop = useTransform(markerSource, [0, 1], ["0%", "100%"]);
  const edgeHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Footer boundary in viewport coordinates, re-measured on scroll and on
  // layout shifts (fonts, images). Raw scroll only — no spring — so the
  // palette split can never lag behind the page under the reader's hands.
  // Sentinel must stay finite: an Infinity here would render as
  // "calc(100% - Infinitypx)", which CSS rejects, leaving both copies
  // unclipped on first paint.
  const OFFSCREEN = 1e6;
  const boundary = useMotionValue(OFFSCREEN);
  const railRef = useRef<HTMLDivElement>(null);
  const measure = () => {
    const footer = document.querySelector("footer");
    boundary.set(footer ? footer.getBoundingClientRect().top : OFFSCREEN);
  };
  useMotionValueEvent(scrollY, "change", measure);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clip the ink copy to above the seabed line and the paper copy to below
  // it. Insets overshoot sideways so the marker's ring and labels survive.
  const inkClip = useTransform(boundary, (b) => {
    const top = railRef.current?.getBoundingClientRect().top ?? 0;
    const local = Math.max(0, b - top);
    return `inset(-24px -48px calc(100% - ${local}px) -24px)`;
  });
  const paperClip = useTransform(boundary, (b) => {
    const top = railRef.current?.getBoundingClientRect().top ?? 0;
    const local = Math.max(0, b - top);
    return `inset(${local}px -48px -24px -24px)`;
  });
  const edgeInkClip = useTransform(
    boundary,
    (b) => `inset(-1px 0 calc(100% - ${Math.max(0, b)}px) 0)`,
  );
  const edgePaperClip = useTransform(
    boundary,
    (b) => `inset(${Math.max(0, b)}px 0 -1px 0)`,
  );

  const [depth, setDepth] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setDepth(Math.round(v * MAX_DEPTH));
  });
  const pressure = (1 + depth / 10).toFixed(1);

  return (
    <>
      {/* Mobile / tablet: minimal left-edge sounding line */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 h-screen w-px lg:hidden"
      >
        <motion.div className="absolute inset-0" style={{ clipPath: edgeInkClip }}>
          <div className="absolute inset-0 bg-line-strong" />
          <motion.div
            className="absolute left-0 top-0 w-full origin-top bg-tide"
            style={{ height: edgeHeight }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: edgePaperClip }}
        >
          <div className="absolute inset-0 bg-paper/25" />
          <motion.div
            className="absolute left-0 top-0 w-full origin-top bg-tide-bright"
            style={{ height: edgeHeight }}
          />
        </motion.div>
      </div>

      {/* Desktop: full sounding scale in the left gutter */}
      <div
        aria-hidden
        ref={railRef}
        className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-8"
      >
        <motion.div style={{ clipPath: inkClip }}>
          <RailScale
            palette={PALETTES.ink}
            markerTop={markerTop}
            depth={depth}
            pressure={pressure}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: paperClip }}
        >
          <RailScale
            palette={PALETTES.paper}
            markerTop={markerTop}
            depth={depth}
            pressure={pressure}
          />
        </motion.div>
      </div>
    </>
  );
}
