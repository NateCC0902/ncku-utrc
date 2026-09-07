import Link from "next/link";
import Image from "next/image";
import { SectionHeader, Kicker } from "@/components/primitives";
import { Reveal } from "@/components/Reveal";
import { CoreLoop } from "@/components/CoreLoop";
import { RovSchematic } from "@/components/RovSchematic";
import { CENTER } from "@/lib/center";
import { vehiclesByDepth, type Vehicle } from "@/lib/content";

export default function Home() {
  const fleet = vehiclesByDepth();
  return (
    <>
      <Hero />
      <Thesis />
      <FleetSection fleet={fleet} />
      <TechCore />
      <RndChain />
      <Applications />
    </>
  );
}

/* ---------------------------------------------------------------- Hero */
function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
      <div className="wrap">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Masthead */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">
                {CENTER.parentZh} · {CENTER.abbr}
              </p>
              <h1 className="mt-6">
                <span className="block text-base font-medium tracking-[0.02em] text-ink-soft sm:text-lg">
                  {CENTER.nameZh}
                  <span lang="en" className="ml-3 font-serif italic text-ink-muted">
                    {CENTER.nameEn}
                  </span>
                </span>
                <span className="mt-4 block text-balance font-serif text-[clamp(2.8rem,7vw,4.6rem)] font-medium leading-[1.04] tracking-[-0.015em] text-ink">
                  從水面<span className="text-tide">到海床</span>
                </span>
              </h1>
              <p
                lang="en"
                className="mt-4 font-serif text-lg italic text-ink-muted"
              >
                From surface to seabed
              </p>
              <p className="mt-7 max-w-xl text-balance text-[1.05rem] leading-relaxed text-ink-soft">
                涵蓋水面 USV、自主 AUV 與纜控 ROV
                的整合式海洋機器人平台；以共通的 ROS 與深度強化學習核心，
                貫穿設計、模擬到海試的一站式研發能量。
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href="#fleet"
                  className="group inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-tide"
                >
                  探索載具陣容
                  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
                    <path
                      d="M8 3v10M4 9l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  href="/capabilities"
                  className="group inline-flex items-center gap-2 border-b border-ink-muted pb-0.5 text-ink transition-colors hover:border-tide hover:text-tide"
                >
                  整體研發能量
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Hero figure */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <figure className="relative">
                <div className="relative aspect-[16/11] overflow-hidden rounded-sm border border-line bg-paper-2">
                  <Image
                    src="/vehicles/usv/hero.jpg"
                    alt="無人水面載具航行於水面，象徵從水面展開的下潛任務"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                  />
                  {/* depth marker */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm bg-paper/85 px-2.5 py-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-tide" />
                    <span className="mono text-[0.62rem] tracking-wide text-ink">
                      0 m · 水面 Surface
                    </span>
                  </div>
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="text-[0.78rem] leading-relaxed text-ink-muted">
                    USV — 2.8 公尺級雙體智慧無人船，本中心銜接水面與水下作業的平台。
                  </span>
                  <span className="mono shrink-0 text-[0.62rem] text-ink-faint">
                    Fig. 01
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* descend cue */}
        <div className="mt-14 hidden items-center gap-3 lg:flex">
          <span className="h-px w-10 bg-line-strong" />
          <span className="hud">向下 · Scroll</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="animate-bob text-tide"
            aria-hidden
          >
            <path
              d="M6 2v8M3 7l3 3 3-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Thesis */
function Thesis() {
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <Reveal>
            <Kicker>The Center · 中心定位</Kicker>
            <p className="mt-7 text-balance font-serif text-[clamp(1.45rem,2.7vw,2.05rem)] font-light leading-[1.45] text-ink">
              以「
              <span className="font-medium text-tide">
                從水面到海床、從設計到驗證
              </span>
              」為主軸，建立涵蓋水面、中深層水與近距離纜控的完整載具陣容，並以共通的軟體核心與水動力測試能量貫穿其中。
            </p>
            <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">
              {CENTER.aboutZh}
            </p>
          </Reveal>

          {/* Readout ledger */}
          <Reveal delay={0.1}>
            <div className="border-t-2 border-tide">
              <div className="grid grid-cols-2 border-x border-b border-line">
                {CENTER.readouts.map((r, i) => (
                  <div
                    key={r.label}
                    className={`p-5 ${i % 2 === 0 ? "border-r border-line" : ""} ${
                      i < 2 ? "border-b border-line" : ""
                    }`}
                  >
                    <div className="hud" lang="en">
                      {r.label}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="figure text-[2.1rem] font-medium leading-none text-ink">
                        {r.value}
                      </span>
                      {r.unit && (
                        <span className="text-sm text-ink-muted">{r.unit}</span>
                      )}
                    </div>
                    <div className="mt-2 text-[0.72rem] text-ink-muted">
                      {r.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Fleet */
function FleetSection({ fleet }: { fleet: Vehicle[] }) {
  return (
    <section id="fleet" className="relative scroll-mt-20 border-t border-line">
      <div className="wrap pt-16 sm:pt-20">
        <SectionHeader
          index="01"
          eyebrow="The Fleet · 載具陣容"
          titleZh={
            <>
              三型載具，
              <br className="sm:hidden" />
              沿著深度依序展開
            </>
          }
          titleEn="Three complementary vehicles, ordered by operating depth"
        />
      </div>
      <div className="mt-14 flex flex-col">
        {fleet.map((v, i) => (
          <VehicleBand key={v.slug} v={v} i={i} />
        ))}
      </div>
    </section>
  );
}

function VehicleBand({ v, i }: { v: Vehicle; i: number }) {
  const flip = i % 2 === 1;
  return (
    <div className="relative border-t border-line py-14 sm:py-20">
      <div className="wrap">
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* visual */}
          <Reveal y={24}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-paper-2">
              {v.images.hero ? (
                <Image
                  src={v.images.hero}
                  alt={v.images.heroAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="blueprint absolute inset-0 flex items-center justify-center p-8">
                  <RovSchematic className="h-full w-full max-w-md" />
                </div>
              )}
              <figcaption className="chip absolute left-4 top-4 bg-paper/85 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-tide" />
                {v.domainZh} · {v.depthLabel}
              </figcaption>
            </figure>
          </Reveal>

          {/* copy */}
          <Reveal delay={0.08}>
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-4xl font-medium text-ink sm:text-5xl">
                  {v.code}
                </span>
                <span className="mono text-xs text-ink-faint">
                  {String(i + 1).padStart(2, "0")} / 03
                </span>
              </div>
              <span className="figure text-right text-2xl font-medium leading-none text-ink-faint sm:text-3xl">
                {v.depthMeters}
                <span className="ml-0.5 text-sm">m</span>
              </span>
            </div>
            <h3 className="mt-4 font-serif text-2xl font-medium text-ink sm:text-[1.7rem]">
              {v.nameZh}
            </h3>
            <p lang="en" className="mt-1 font-serif text-[0.95rem] italic text-ink-muted">
              {v.nameEn}
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
              {v.taglineZh}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {v.tasks.slice(0, 4).map((t) => (
                <span key={t.zh} className="chip">
                  {t.zh}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href={`/vehicles/${v.slug}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-tide group-hover:bg-tide/5">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    aria-hidden
                    className="text-tide transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                深入了解 {v.code}
              </Link>
              <div className="mono text-xs text-ink-faint">{v.controlZh}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- TechCore */
function TechCore() {
  return (
    <section id="core" className="section scroll-mt-20 border-t border-line">
      <div className="wrap">
        <SectionHeader
          index="02"
          eyebrow="Shared Core · 共通技術核心"
          titleZh="一致的軟體與演算法架構"
          titleEn="A unified ROS + deep-RL core, reused across vehicles"
        />
        <div className="mt-12">
          <CoreLoop />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CENTER.core.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.06}>
              <div className="glass glass-hover h-full rounded-sm p-6">
                <div className="hud !text-tide" lang="en">
                  {c.titleEn}
                </div>
                <h3 className="mt-3 font-serif text-lg font-medium text-ink">
                  {c.titleZh}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {c.bodyZh}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- RndChain */
function RndChain() {
  return (
    <section id="rnd" className="section scroll-mt-20 border-t border-line">
      <div className="wrap">
        <SectionHeader
          index="03"
          eyebrow="R&D Chain · 研發與測試能量"
          titleZh="設計 → CFD／水槽 → 模擬 → 海試"
          titleEn="A closed loop from design to sea trial — not just operating vehicles"
        />

        <div className="mt-14 grid overflow-hidden rounded-sm border-t-2 border-tide md:grid-cols-5">
          {CENTER.rndChain.map((s, i) => (
            <Reveal
              key={s.step}
              delay={i * 0.06}
              className={`border-b border-l border-line bg-paper-2/50 ${
                i === CENTER.rndChain.length - 1 ? "border-r" : ""
              }`}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="figure text-2xl font-medium text-tide">
                    {s.step}
                  </span>
                  {i < 4 && (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-4 w-4 text-line-strong"
                      aria-hidden
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="mt-4 font-serif text-base font-medium text-ink">
                  {s.titleZh}
                </h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-ink-muted">
                  {s.method}
                </p>
                <p className="mono mt-auto pt-4 text-[0.68rem] text-tide">
                  → {s.useZh}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
          此一「設計 → CFD／水槽測試 → 模擬 →
          海試」的閉環，使中心能對外提供載具開發、水動力分析與控制演算法驗證等技術服務。
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Applications */
function Applications() {
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeader
              index="04"
              eyebrow="Applications · 應用領域"
              titleZh="從廣域搜索到精細檢視"
              titleEn="Fields & industry services"
            />
            <Reveal delay={0.1}>
              <div className="mt-10 rounded-sm border border-line bg-paper-2/50 p-6">
                <Kicker>Intellectual Property · 智慧財產</Kicker>
                <div className="mt-5 space-y-5">
                  <IpBlock
                    label="已取得專利"
                    items={CENTER.ipGranted}
                    tone="tide"
                  />
                  <IpBlock
                    label="專利申請中"
                    items={CENTER.ipPending}
                    tone="muted"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {CENTER.applications.map((a, i) => (
              <Reveal key={a.titleZh} delay={i * 0.05}>
                <div className="glass glass-hover h-full rounded-sm p-5">
                  <div className="flex items-start gap-3">
                    <span className="mono mt-1 text-[0.62rem] text-tide">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif font-medium text-ink">
                        {a.titleZh}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {a.descZh}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IpBlock({
  label,
  items,
  tone,
}: {
  label: string;
  items: readonly string[];
  tone: "tide" | "muted";
}) {
  return (
    <div>
      <div
        className={`mono text-[0.68rem] ${
          tone === "tide" ? "text-tide" : "text-ink-muted"
        }`}
      >
        {label} · {items.length}
      </div>
      <ul className="mt-2 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
            <span
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                tone === "tide" ? "bg-tide" : "bg-ink-faint"
              }`}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
