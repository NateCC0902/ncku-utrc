"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { UsvModel, type Anchor } from "./UsvModel";
import { Kicker } from "./primitives";

/**
 * The four subsystems, each pinned to the part of the hull it describes.
 *
 * Positions are in the GLB's own model space — Y up, +Z forward, normalised to
 * a 1-unit bounding box — and were read off the mesh itself (mast head, deck
 * centreline, the transom, the starboard topside amidships)
 * rather than eyeballed, so a marker sits on its hardware from every heading.
 */
const HOTSPOTS: readonly (Anchor & {
  zh: string;
  en: string;
  lead: string;
  specs: readonly (readonly [string, string])[];
})[] = [
  {
    id: "sensing",
    position: [0, 0.262, 0.19],
    normal: [0, 1, 0.12],
    zh: "感測陣列",
    en: "Sensing",
    lead: "桅杆集中佈署光學、測距與水下感測，多感測器融合建構高精度環境模型。",
    specs: [
      ["光學", "雙目視覺 AI 相機、紅外線熱像儀"],
      ["測距", "三維光達、77 GHz 毫米波雷達"],
      ["水下", "側掃聲納、聲納測深儀"],
      ["定位", "INS／IMU、GNSS RTK（u-blox F9P）"],
    ],
  },
  {
    id: "compute",
    position: [0, 0.132, 0.12],
    normal: [0, 1, 0.15],
    zh: "運算與控制",
    en: "Compute",
    lead: "甲板控制箱內為 NVIDIA Jetson 中控電腦，以 CANBUS 連結運動控制與側推模組。",
    specs: [
      ["中控", "NVIDIA Jetson + CANBUS"],
      ["框架", "ROS"],
      ["演算法", "TD3 深度強化學習、ALOS 導引"],
      ["通訊", "4G／5G／WiFi 多路備援"],
    ],
  },
  {
    id: "drive",
    position: [0, -0.09, -0.45],
    normal: [0, 0.2, -1],
    zh: "推進與電力",
    en: "Propulsion",
    lead: "雙舷外機提供主推力，兩具側推負責低速橫移與動態定位駐留。",
    specs: [
      ["主推進", "舷外機 ×2（各 20 HP）"],
      ["側推", "側推器 ×2（各 2.04 HP）"],
      ["電力", "LiFePO4 48 V／約 600 Ah"],
    ],
  },
  {
    id: "hull",
    position: [0.29, -0.02, 0.05],
    normal: [1, 0.1, 0],
    zh: "雙體船殼",
    en: "Hull",
    lead: "2.8 公尺級玻璃纖維（FRP）雙體構型，寬扁的雙浮體換來高橫向穩度。",
    specs: [
      ["尺寸", "2.8 × 1.7 × 1.2 m"],
      ["材質", "玻璃纖維 FRP"],
      ["構型", "雙體（Catamaran）"],
    ],
  },
];

const RAD = Math.PI / 180;
const YAW_START = 35;
/** A full turn plus a quarter, so the far side comes round inside the track. */
const YAW_SWEEP = 450;

function useWideViewport() {
  const query = "(min-width: 1024px) and (min-height: 640px)";
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The vessel as the page's subject.
 *
 * On a viewport with room, it is a pinned stage the hull turns in as the reader
 * scrolls, and the subsystem detail lives in markers pinned to the hardware
 * rather than in prose beside it — nothing is ever laid over the model except a
 * card the reader asked for, so the render is never dimmed to make room for
 * text. Narrower viewports cannot carry that: the markers would land on top of
 * each other and on the copy, so the same content is listed under a still.
 *
 * The two are separate components because the pinned one's `useScroll` must
 * bind to a track that is actually mounted.
 */
export function UsvExplorer() {
  const wide = useWideViewport();
  return wide ? <PinnedExplorer /> : <ExplorerList />;
}

function ExplorerList() {
  const yawRef = useRef(YAW_START * RAD);
  const pitchRef = useRef(0);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <section id="anatomy" className="section scroll-mt-20 border-t border-line">
      <div className="wrap">
        <Kicker>載具解構 · ANATOMY</Kicker>
        <h2 className="mt-4 font-serif text-[clamp(1.6rem,5vw,2.2rem)] font-medium leading-[1.16] text-ink">
          繞行一圈<span className="text-tide">無人水面載具</span>
        </h2>
        <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-paper-2">
          <UsvModel
            yawRef={yawRef}
            pitchRef={pitchRef}
            onReady={onReady}
            className="absolute inset-0"
          />
          {!ready && <div className="blueprint absolute inset-0 opacity-60" />}
        </div>
        <div className="mt-10 space-y-9">
          {HOTSPOTS.map((h, i) => (
            <div key={h.id}>
              <div className="flex items-baseline gap-3">
                <span className="mono text-[0.7rem] font-medium text-tide">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-[1.2rem] font-medium text-ink">
                  {h.zh}
                </h3>
                <span lang="en" className="hud">
                  {h.en}
                </span>
              </div>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
                {h.lead}
              </p>
              <dl className="mt-3 divide-y divide-line border-t border-line">
                {h.specs.map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-1.5">
                    <dt className="hud w-16 shrink-0 pt-0.5">{k}</dt>
                    <dd className="text-[0.85rem] leading-relaxed text-ink-soft">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PinnedExplorer() {
  const trackRef = useRef<HTMLDivElement>(null);
  const yawRef = useRef(YAW_START * RAD);
  const pitchRef = useRef(0);
  const dollyRef = useRef(1);
  const [open, setOpen] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [heading, setHeading] = useState<number>(YAW_START);

  const reduce = useReducedMotion();
  const onReady = useCallback(() => setReady(true), []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const deg = YAW_START + p * YAW_SWEEP;
    yawRef.current = deg * RAD;
    // Reduced motion keeps the turn — it is scrubbed by the reader's own
    // scrolling — but drops the tilt and the apparent zoom.
    pitchRef.current = reduce ? 0 : Math.sin(p * Math.PI) * 6 * RAD;
    dollyRef.current = reduce ? 1 : 1 - 0.1 * Math.sin(p * Math.PI);
    setHeading(Math.round(deg) % 360);
  });

  return (
    <section
      id="anatomy"
      className="scroll-mt-20 border-t border-line"
      aria-label="無人水面載具三維解構"
    >
      <div ref={trackRef} className="relative h-[320svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Header sits in the top-left gutter, clear of the hull. */}
          <div className="wrap pointer-events-none absolute inset-x-0 top-0 z-20 pt-24">
            <Kicker>載具解構 · ANATOMY</Kicker>
            <h2 className="mt-4 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-[1.16] text-ink">
              繞行一圈<span className="text-tide">無人水面載具</span>
            </h2>
            <p className="mono mt-3 text-[0.62rem] text-ink-faint">
              HDG {String(heading).padStart(3, "0")}° · 點選標記展開細節
            </p>
          </div>

          {/* The stage: the model owns the whole viewport, undimmed. */}
          <div className="absolute inset-0">
            {/* Each marker is pinned to its anchor by the renderer; the card
                grows out of the dot and is the only thing that ever covers the
                hull, and only while the reader has asked for it. */}
            <UsvModel
              yawRef={yawRef}
              pitchRef={pitchRef}
              dollyRef={dollyRef}
              anchors={HOTSPOTS}
              renderMarker={(a) => {
                const h = HOTSPOTS.find((x) => x.id === a.id);
                if (!h || !ready) return null;
                return (
                  <Marker
                    hotspot={h}
                    open={open === h.id}
                    onToggle={() => setOpen(open === h.id ? null : h.id)}
                  />
                );
              }}
              onReady={onReady}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marker({
  hotspot: h,
  open,
  onToggle,
}: {
  hotspot: (typeof HOTSPOTS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${h.zh} ${h.en}`}
        className="group relative grid h-11 w-11 place-items-center rounded-full"
      >
        {/* 44px hit area around an 11px dot, per touch-target guidance. */}
        <span
          className={`absolute h-[11px] w-[11px] rounded-full ring-1 transition-all duration-300 ${
            open
              ? "scale-125 bg-tide ring-paper"
              : "bg-signal ring-paper/90 group-hover:scale-125"
          }`}
        />
        <span
          className={`absolute h-9 w-9 rounded-full border transition-all duration-500 ${
            open ? "border-tide/50 opacity-100" : "border-signal/40 opacity-70"
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute top-1/2 w-[19rem] -translate-y-1/2 rounded-sm border border-line-strong bg-paper/95 p-4 shadow-[0_18px_40px_-24px_rgba(24,34,44,0.55)] backdrop-blur-sm left-8 group-data-[side=left]:left-auto group-data-[side=left]:right-8"
        >
          <div className="flex items-baseline gap-3">
            <h3 className="font-serif text-[1.15rem] font-medium text-ink">
              {h.zh}
            </h3>
            <span lang="en" className="hud">
              {h.en}
            </span>
          </div>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">
            {h.lead}
          </p>
          <dl className="mt-3 divide-y divide-line border-t border-line">
            {h.specs.map(([k, v]) => (
              <div key={k} className="flex gap-3 py-1.5">
                <dt className="hud w-16 shrink-0 pt-0.5">{k}</dt>
                <dd className="text-[0.8rem] leading-relaxed text-ink-soft">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
