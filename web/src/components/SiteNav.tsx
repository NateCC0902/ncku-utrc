"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const VEHICLE_LINKS = [
  { href: "/vehicles/usv", code: "USV", zh: "無人水面載具", depth: "水面" },
  { href: "/vehicles/auv", code: "AUV", zh: "自主水下載具", depth: "200 m" },
  { href: "/vehicles/rov", code: "ROV", zh: "遙控水下載具", depth: "100–300 m" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [fleetOpen, setFleetOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setFleetOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[80rem] items-center justify-between px-[clamp(1.15rem,4vw,2.75rem)]">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="水下技術研究中心 首頁"
        >
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span className="text-[1.02rem] font-semibold tracking-[0.14em] text-ink">
              UTRC
            </span>
            <span className="mt-1 text-[0.6rem] tracking-[0.02em] text-ink-muted">
              水下技術研究中心
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/" active={isActive("/")}>
            首頁
          </NavLink>

          {/* Fleet dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setFleetOpen(true)}
            onMouseLeave={() => setFleetOpen(false)}
          >
            <button
              className={`flex items-center gap-1 rounded-sm px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/vehicles")
                  ? "text-tide"
                  : "text-ink-soft hover:text-ink"
              }`}
              aria-expanded={fleetOpen}
              aria-haspopup="true"
              onClick={() => setFleetOpen((v) => !v)}
            >
              載具陣容
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={`transition-transform ${fleetOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 3l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <AnimatePresence>
              {fleetOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full w-72 pt-2"
                >
                  <div className="overflow-hidden rounded-md border border-line-strong bg-paper p-1.5 shadow-[0_20px_50px_-30px_rgba(20,29,38,0.6)]">
                    {VEHICLE_LINKS.map((v) => (
                      <Link
                        key={v.href}
                        href={v.href}
                        className="flex items-center justify-between rounded-sm px-3 py-2.5 transition-colors hover:bg-paper-3"
                      >
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold tracking-wide text-ink">
                            {v.code}
                          </span>
                          <span className="text-[0.7rem] text-ink-muted">
                            {v.zh}
                          </span>
                        </span>
                        <span className="mono text-[0.62rem] text-tide">
                          {v.depth}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="/capabilities" active={isActive("/capabilities")}>
            整體能量
          </NavLink>

          <a
            href="#contact"
            className="ml-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-tide"
          >
            聯絡我們
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-sm text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
        >
          <div className="relative h-4 w-6">
            <span
              className={`absolute left-0 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-[90] bg-paper/98 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-8">
              <MobileLink href="/" onNav={() => setOpen(false)}>
                首頁
              </MobileLink>
              <div className="mb-2 mt-4 px-3">
                <span className="eyebrow">載具陣容 · Fleet</span>
              </div>
              {VEHICLE_LINKS.map((v) => (
                <Link
                  key={v.href}
                  href={v.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-sm border border-line px-4 py-3.5"
                >
                  <span className="flex flex-col">
                    <span className="font-semibold text-ink">{v.code}</span>
                    <span className="text-sm text-ink-muted">{v.zh}</span>
                  </span>
                  <span className="mono text-xs text-tide">{v.depth}</span>
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-1">
                <MobileLink href="/capabilities" onNav={() => setOpen(false)}>
                  整體能量
                </MobileLink>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-sm bg-ink px-4 py-3 text-center font-medium text-paper"
                >
                  聯絡我們
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative rounded-sm px-3 py-2 text-sm transition-colors ${
        active ? "text-tide" : "text-ink-soft hover:text-ink"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-3 bottom-1 h-px bg-tide" />
      )}
    </Link>
  );
}

function MobileLink({
  href,
  onNav,
  children,
}: {
  href: string;
  onNav: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNav}
      className="rounded-sm px-4 py-3.5 text-lg text-ink"
    >
      {children}
    </Link>
  );
}

function BrandMark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center">
      <svg viewBox="0 0 40 40" className="h-9 w-9">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* stylized waterline + descending sounding */}
        <path
          d="M6 16c3.5 0 3.5 2.4 7 2.4S16.5 16 20 16s3.5 2.4 7 2.4S30.5 16 34 16"
          fill="none"
          stroke="var(--color-tide)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="20" cy="27" r="2.2" fill="var(--color-signal)" />
        <path
          d="M20 24.5v-3M14 27h-2.5M28.5 27H26"
          stroke="var(--color-ink)"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
