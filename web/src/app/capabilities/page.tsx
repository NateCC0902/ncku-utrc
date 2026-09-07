import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader, Kicker } from "@/components/primitives";
import { Reveal } from "@/components/Reveal";
import { CoreLoop } from "@/components/CoreLoop";
import { CENTER } from "@/lib/center";
import { vehiclesByDepth } from "@/lib/content";

export const metadata: Metadata = {
  title: "整體能量 · 從水面到海床",
  description:
    "水下技術研究中心整體研發能量：載具陣容、共通 ROS + TD3 技術核心、USV×AUV 母船協同、設計→CFD→模擬→海試的閉環，以及應用領域與智慧財產。",
};

export default function CapabilitiesPage() {
  const fleet = vehiclesByDepth();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-32">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Integrated Capability · 整體能量</p>
            <h1 className="mt-6 text-balance font-serif text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
              從水面到海床，
              <br />
              從設計<span className="text-tide">到驗證</span>
            </h1>
            <p lang="en" className="mt-4 font-serif text-lg italic text-ink-muted">
              One platform · surface to seabed
            </p>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {CENTER.thesisZh}
            </p>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <Kicker>About · 中心簡介</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-balance font-serif text-[clamp(1.2rem,2.1vw,1.5rem)] font-light leading-[1.6] text-ink">
                {CENTER.aboutZh}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fleet comparison */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeader
            index="01"
            eyebrow="The Fleet · 載具陣容"
            titleZh="涵蓋不同作業域的三型載具"
            titleEn="Three vehicles across distinct operating domains"
          />

          {/* desktop table */}
          <Reveal>
            <div className="mt-12 hidden overflow-hidden rounded-sm border-t-2 border-tide md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-x border-b border-line bg-paper-2/60">
                    {["載具", "作業域", "操控模式", "作業範圍", "代表任務"].map(
                      (h) => (
                        <th
                          key={h}
                          className="hud px-5 py-4 !text-[0.58rem] font-medium !tracking-[0.12em]"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((v) => (
                    <tr
                      key={v.slug}
                      className="border-x border-b border-line align-top transition-colors hover:bg-paper-2/50"
                    >
                      <td className="px-5 py-5">
                        <Link
                          href={`/vehicles/${v.slug}`}
                          className="group flex items-baseline gap-2"
                        >
                          <span className="font-serif text-lg font-medium text-tide">
                            {v.code}
                          </span>
                          <span className="text-sm text-ink-soft group-hover:text-ink">
                            {v.nameZh}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-5 text-sm text-ink-soft">
                        {v.domainZh}
                      </td>
                      <td className="px-5 py-5 text-sm text-ink-soft">
                        {v.controlZh}
                      </td>
                      <td className="mono px-5 py-5 text-sm text-ink">
                        {v.depthLabel}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {v.tasks.slice(0, 3).map((t) => (
                            <span key={t.zh} className="chip !py-1 !text-[0.58rem]">
                              {t.zh}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* mobile cards */}
          <div className="mt-10 space-y-3 md:hidden">
            {fleet.map((v) => (
              <Reveal key={v.slug}>
                <Link
                  href={`/vehicles/${v.slug}`}
                  className="glass block rounded-sm p-5"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-xl font-medium text-tide">
                      {v.code}
                    </span>
                    <span className="text-sm text-ink-soft">{v.nameZh}</span>
                  </div>
                  <dl className="mono mt-4 grid grid-cols-2 gap-y-2 text-[0.72rem]">
                    <dt className="text-ink-faint">作業域</dt>
                    <dd className="text-ink-soft">{v.domainZh}</dd>
                    <dt className="text-ink-faint">操控</dt>
                    <dd className="text-ink-soft">{v.controlZh}</dd>
                    <dt className="text-ink-faint">作業範圍</dt>
                    <dd className="text-ink">{v.depthLabel}</dd>
                  </dl>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-6 max-w-3xl leading-relaxed text-ink-muted">
              三型載具能力互補：
              <span className="text-ink-soft">USV</span>{" "}
              提供水面續航、通訊中繼與布放回收母船；
              <span className="text-ink-soft">AUV</span>{" "}
              執行長航程、無纜的自主水下任務；
              <span className="text-ink-soft">ROV</span>{" "}
              以人在迴路的即時操控完成精細與不確定環境作業。
            </p>
          </Reveal>
        </div>
      </section>

      {/* Integration */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeader
            index="02"
            eyebrow="Integration · 整合作業能力"
            titleZh="從水面到水下的協同作業"
            titleEn="Coordinated operations across domains"
          />
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {CENTER.integration.map((it, i) => (
              <Reveal key={it.titleZh} delay={i * 0.07}>
                <div className="glass glass-hover h-full rounded-sm p-6">
                  <span className="mono text-xs text-tide">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-medium text-ink">
                    {it.titleZh}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {it.bodyZh}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Common core */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeader
            index="03"
            eyebrow="Shared Core · 共通技術核心"
            titleZh="一致的軟體與演算法架構"
            titleEn="Unified ROS + deep-RL core"
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

      {/* R&D chain */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeader
            index="04"
            eyebrow="R&D Chain · 研發與測試能量"
            titleZh="設計 → CFD／水槽 → 模擬 → 海試"
            titleEn="A closed development-to-validation loop"
          />
          <div className="mt-14 grid overflow-hidden rounded-sm border-t-2 border-tide md:grid-cols-5">
            {CENTER.rndChain.map((s, i) => (
              <Reveal
                key={s.step}
                className={`border-b border-l border-line bg-paper-2/50 ${
                  i === CENTER.rndChain.length - 1 ? "border-r" : ""
                }`}
              >
                <div className="flex h-full flex-col p-6">
                  <span className="figure text-2xl font-medium text-tide">
                    {s.step}
                  </span>
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
        </div>
      </section>

      {/* Applications + IP */}
      <section className="section border-t border-line">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Applications · 應用領域"
              titleZh="應用領域與產業服務"
              titleEn="Fields & industry services"
            />
            <div className="mt-10 space-y-2.5">
              {CENTER.applications.map((a, i) => (
                <Reveal key={a.titleZh} delay={Math.min(i * 0.04, 0.3)}>
                  <div className="flex gap-4 rounded-sm border border-line bg-paper-2/40 px-5 py-4">
                    <span className="mono text-[0.66rem] text-tide">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-sm font-medium text-ink">
                        {a.titleZh}
                      </h3>
                      <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-muted">
                        {a.descZh}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Intellectual Property · 智慧財產"
              titleZh="智慧財產"
              titleEn="Patents & filings"
            />
            <Reveal>
              <div className="mt-10 rounded-sm border border-line bg-paper-2/40 p-6">
                <div className="mono text-[0.68rem] text-tide">
                  已取得專利 · Granted · {CENTER.ipGranted.length}
                </div>
                <ul className="mt-3 space-y-2.5">
                  {CENTER.ipGranted.map((it) => (
                    <li
                      key={it}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tide" />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mono mt-7 text-[0.68rem] text-ink-muted">
                  專利申請中 · Pending · {CENTER.ipPending.length}
                </div>
                <ul className="mt-3 space-y-2.5">
                  {CENTER.ipPending.map((it) => (
                    <li
                      key={it}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
