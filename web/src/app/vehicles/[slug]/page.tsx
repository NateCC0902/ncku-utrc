import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionHeader, Kicker } from "@/components/primitives";
import { Reveal } from "@/components/Reveal";
import { RovSchematic } from "@/components/RovSchematic";
import { UsvExplorer } from "@/components/UsvExplorer";
import {
  VEHICLES,
  getVehicle,
  vehiclesByDepth,
  type Vehicle,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return {};
  return {
    title: `${v.code} · ${v.nameZh}`,
    description: v.taglineZh,
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) notFound();

  const order = vehiclesByDepth();
  const idx = order.findIndex((x) => x.slug === v.slug);
  const prev = order[idx - 1];
  const next = order[idx + 1];

  // Only the USV has a converted CAD model to explore.
  const hasModel = v.slug === "usv";

  return (
    <div className="relative">
      <div className="relative z-10">
        <VehicleHero v={v} idx={idx} />
        {hasModel && <UsvExplorer />}
        <Tasks v={v} />
        <Sensors v={v} />
        <Architecture v={v} />
        <SpecsAndIp v={v} />
        <Gallery v={v} />
        <VehicleNav prev={prev} next={next} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Hero */
function VehicleHero({ v, idx }: { v: Vehicle; idx: number }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32">
      <div className="wrap relative">
        <Reveal>
          <Link
            href="/#fleet"
            className="mono inline-flex items-center gap-2 text-xs text-ink-muted transition-colors hover:text-tide"
          >
            <span aria-hidden>←</span> 載具陣容
          </Link>
        </Reveal>

        <div className="mt-8 grid items-end gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-5xl font-medium text-ink sm:text-6xl">
                {v.code}
              </span>
              <span className="mono text-xs text-ink-faint">
                {String(idx + 1).padStart(2, "0")} / 03 · {v.domainEn}
              </span>
            </div>
            <h1 className="mt-4 font-serif text-[clamp(1.9rem,4.5vw,3rem)] font-medium leading-tight text-ink">
              {v.nameZh}
            </h1>
            <p lang="en" className="mt-2 font-serif text-lg italic text-ink-muted">
              {v.nameEn}
            </p>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-soft">
              {v.taglineZh}
            </p>

            <dl className="mt-9 grid max-w-md grid-cols-3 border-t-2 border-tide">
              <HeroStat label="作業範圍" value={v.depthLabel} first />
              <HeroStat label="作業域" value={v.domainZh} />
              <HeroStat label="操控模式" value={v.controlZh} />
            </dl>
          </Reveal>

          <Reveal delay={0.1} y={24}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-paper-2">
              {v.images.hero ? (
                <Image
                  src={v.images.hero}
                  alt={v.images.heroAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="blueprint absolute inset-0 flex items-center justify-center p-6">
                  <RovSchematic className="h-full w-full max-w-lg" />
                </div>
              )}
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  first,
}: {
  label: string;
  value: string;
  first?: boolean;
}) {
  return (
    <div className={`border-b border-line p-4 ${first ? "" : "border-l"}`}>
      <dt className="hud !text-[0.52rem]">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium leading-snug text-ink">
        {value}
      </dd>
    </div>
  );
}

/* --------------------------------------------------------------- Tasks */
function Tasks({ v }: { v: Vehicle }) {
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <SectionHeader
          index="01"
          eyebrow="Missions · 能執行哪些任務"
          titleZh="任務模式"
          titleEn="What it can do"
        />
        <Reveal>
          <p className="mt-6 max-w-3xl leading-relaxed text-ink-soft">
            {v.summary}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {v.tasks.map((t, i) => (
            <Reveal key={t.zh} delay={i * 0.05}>
              <div className="glass glass-hover flex h-full flex-col rounded-sm p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg font-medium text-ink">
                    {t.zh}
                  </h3>
                  <span lang="en" className="hud !text-tide">
                    {t.en}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {t.detail}
                </p>
                <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                  <span className="h-1 w-1 rounded-full bg-tide" />
                  <span className="text-[0.78rem] text-ink-soft">{t.value}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {v.tasksNote && (
          <Reveal>
            <p className="mono mt-6 max-w-3xl border-l-2 border-tide/40 pl-4 text-[0.78rem] leading-relaxed text-ink-muted">
              {v.tasksNote}
            </p>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12">
            <Kicker>延伸應用場景 · Extended use</Kicker>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {v.extendedApplications.map((a) => (
                <span
                  key={a}
                  className="rounded-sm border border-line bg-paper-2/60 px-3.5 py-2 text-sm text-ink-soft"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Sensors */
function Sensors({ v }: { v: Vehicle }) {
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <SectionHeader
          index="02"
          eyebrow="Payload · 感測器與酬載"
          titleZh="感測與酬載配置"
          titleEn="Sensing & payload"
        />
        <div className="mt-12 overflow-hidden rounded-sm border border-line">
          {v.sensors.map((s, i) => (
            <Reveal key={s.category} delay={Math.min(i * 0.04, 0.3)}>
              <div
                className={`grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-[minmax(9rem,12rem)_1fr] sm:gap-6 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-tide" />
                  <span className="font-medium text-ink">{s.category}</span>
                </div>
                <div className="text-ink-soft">{s.config}</div>
              </div>
            </Reveal>
          ))}
        </div>
        {v.sensorsNote && (
          <Reveal>
            <p className="mt-6 max-w-3xl leading-relaxed text-ink-muted">
              {v.sensorsNote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Architecture */
function Architecture({ v }: { v: Vehicle }) {
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <SectionHeader
          index="03"
          eyebrow="Architecture · 系統架構與控制"
          titleZh="構型、電力與控制核心"
          titleEn="System architecture & control"
        />
        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {v.architecture.map((block, i) => (
            <Reveal key={block.title} delay={i * 0.07}>
              <div className="glass h-full rounded-sm p-6">
                <div className="flex items-center gap-3">
                  <span className="mono text-xs text-tide">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif font-medium text-ink">
                    {block.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {block.points.map((p) => (
                    <li
                      key={p}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tide" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Specs + IP */
function SpecsAndIp({ v }: { v: Vehicle }) {
  const hasIp = v.ipGranted?.length || v.ipPending?.length || v.platforms?.length;
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* spec table */}
          <div>
            <SectionHeader
              index="04"
              eyebrow="Specifications · 規格總表"
              titleZh="規格總表"
              titleEn="Specifications"
            />
            <Reveal>
              <dl className="mt-10 overflow-hidden rounded-sm border-t-2 border-tide">
                {v.specs.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex flex-col gap-1 border-x border-b border-line px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                      i % 2 ? "bg-paper-2/50" : ""
                    }`}
                  >
                    <dt className="text-sm text-ink-muted">{row.label}</dt>
                    <dd className="mono text-sm text-ink sm:text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* IP + platforms */}
          {hasIp && (
            <div className="lg:pt-4">
              <Reveal>
                <Kicker>Technology & IP · 技術能量與智財</Kicker>
              </Reveal>
              <div className="mt-8 space-y-8">
                {v.ipGranted && v.ipGranted.length > 0 && (
                  <IpList
                    label="已取得專利"
                    en="Granted"
                    items={v.ipGranted}
                    strong
                  />
                )}
                {v.ipPending && v.ipPending.length > 0 && (
                  <IpList label="專利申請中" en="Pending" items={v.ipPending} />
                )}
                {v.platforms && v.platforms.length > 0 && (
                  <Reveal>
                    <div>
                      <div className="mono text-[0.68rem] text-tide">
                        測試平台 · Test platforms
                      </div>
                      <div className="mt-3 space-y-3">
                        {v.platforms.map((p) => (
                          <div
                            key={p.name}
                            className="rounded-sm border border-line bg-paper-2/50 p-4"
                          >
                            <div className="text-sm font-medium text-ink">
                              {p.name}
                            </div>
                            <div className="mt-1 text-[0.8rem] leading-relaxed text-ink-muted">
                              {p.detail}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          )}
        </div>

        <Reveal>
          <p className="mono mt-12 max-w-3xl border-l-2 border-line-strong pl-4 text-[0.74rem] leading-relaxed text-ink-faint">
            {v.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function IpList({
  label,
  en,
  items,
  strong,
}: {
  label: string;
  en: string;
  items: string[];
  strong?: boolean;
}) {
  return (
    <Reveal>
      <div>
        <div className="flex items-baseline gap-2">
          <span
            className={`mono text-[0.68rem] ${
              strong ? "text-tide" : "text-ink-muted"
            }`}
          >
            {label}
          </span>
          <span lang="en" className="mono text-[0.6rem] text-ink-faint">
            {en} · {items.length}
          </span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {items.map((it) => (
            <li
              key={it}
              className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
            >
              <span
                className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                  strong ? "bg-tide" : "bg-ink-faint"
                }`}
              />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------- Gallery */
function Gallery({ v }: { v: Vehicle }) {
  if (v.images.gallery.length === 0) {
    return (
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeader
            index="05"
            eyebrow="Configuration · 載具配置"
            titleZh="向量式八推進器配置（Heavy）"
            titleEn="Vectored 8-thruster layout · BlueROV2 Heavy"
          />
          <Reveal>
            <div className="blueprint mt-10 flex items-center justify-center rounded-sm border border-line bg-paper-2/50 p-8 sm:p-14">
              <RovSchematic className="h-auto w-full max-w-xl" />
            </div>
            <p className="mono mt-5 text-center text-[0.72rem] text-ink-faint">
              示意圖依 BlueROV2 Heavy 原廠配置繪製（八推進器：4 向量水平 + 4
              垂直），供理解六自由度推進佈局之用。
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <SectionHeader
          index="05"
          eyebrow="Gallery · 影像"
          titleZh="載具與硬體影像"
          titleEn="Vehicle & hardware"
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {v.images.gallery.map((g, i) => (
            <Reveal key={g.src} delay={Math.min(i * 0.05, 0.3)}>
              <figure className="group overflow-hidden rounded-sm border border-line bg-paper-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="border-t border-line px-3 py-2.5">
                  <span className="text-[0.72rem] text-ink-muted">
                    {g.caption}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Prev/Next */
function VehicleNav({ prev, next }: { prev?: Vehicle; next?: Vehicle }) {
  return (
    <section className="border-t border-line">
      <div className="wrap grid gap-3 py-12 sm:grid-cols-2">
        {prev ? (
          <VehicleNavCard v={prev} dir="prev" />
        ) : (
          <div className="hidden sm:block" />
        )}
        {next && <VehicleNavCard v={next} dir="next" />}
      </div>
    </section>
  );
}

function VehicleNavCard({ v, dir }: { v: Vehicle; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/vehicles/${v.slug}`}
      className={`glass glass-hover group flex items-center gap-4 rounded-sm p-5 ${
        isNext ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      <span className="mono text-2xl text-ink-muted transition-colors group-hover:text-tide">
        {isNext ? "→" : "←"}
      </span>
      <span className="flex-1">
        <span className="hud !text-[0.55rem]">
          {isNext ? "較深 · Deeper" : "較淺 · Shallower"}
        </span>
        <span
          className={`mt-1 flex items-baseline gap-2 ${
            isNext ? "sm:justify-end" : ""
          }`}
        >
          <span className="font-serif text-lg font-medium text-tide">
            {v.code}
          </span>
          <span className="text-sm text-ink">{v.nameZh}</span>
        </span>
      </span>
    </Link>
  );
}
