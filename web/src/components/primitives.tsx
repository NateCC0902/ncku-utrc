import { Reveal } from "./Reveal";

/**
 * Section opener: an indexed rule + kicker, a serif headline, and an
 * italic-serif English subtitle. The editorial register — no HUD chrome.
 */
export function SectionHeader({
  index,
  eyebrow,
  titleZh,
  titleEn,
  className = "",
  align = "left",
}: {
  index?: string;
  eyebrow: string;
  titleZh: React.ReactNode;
  titleEn?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={`flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start"
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="mono text-[0.7rem] font-medium text-tide">
            {index}
          </span>
        )}
        <span className="h-px w-6 bg-line-strong" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="mt-5 text-balance font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.01em] text-ink">
        {titleZh}
      </h2>
      {titleEn && (
        <p
          lang="en"
          className="mt-3 font-serif text-[1.05rem] italic leading-snug text-ink-muted"
        >
          {titleEn}
        </p>
      )}
    </Reveal>
  );
}

/** Small labelled hairline used to open sub-sections. */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-tide/60" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
