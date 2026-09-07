/**
 * Shared control core: the ROS + TD3 closed loop that both AUV and USV run.
 * Talker → Topic → Listener across the stages; feedback closes the loop.
 * Built in HTML (not SVG) so CJK stays crisp and it reflows on mobile.
 */
const STAGES = [
  {
    en: "Sensing",
    zh: "感測",
    items: ["Camera / 影像", "AHRS · IMU / 姿態", "Pressure / 深度"],
  },
  {
    en: "Data Bus",
    zh: "資料儲存與傳輸",
    items: ["資料儲存", "資料傳輸", "ROS Topics"],
  },
  {
    en: "Control · TD3",
    zh: "控制模型",
    items: ["深度強化學習", "Calculate next action", "決策最佳化"],
    highlight: true,
  },
  {
    en: "Actuation",
    zh: "致動",
    items: ["Thruster / 推進器", "Rudder / 舵板", "Side Thruster / 側推"],
  },
];

export function CoreLoop() {
  return (
    <div className="relative">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
        {STAGES.map((s, i) => (
          <div key={s.en} className="contents">
            <div
              className={`relative rounded-sm border bg-paper-2/70 p-5 ${
                s.highlight
                  ? "border-tide/50 bg-tide/[0.05]"
                  : "border-line"
              }`}
            >
              <span
                className={`absolute left-0 top-5 h-8 w-[3px] rounded-r ${
                  s.highlight ? "bg-tide" : "bg-tide/40"
                }`}
              />
              <div className="hud !text-tide" lang="en">
                {s.en}
              </div>
              <div className="mt-1.5 font-serif text-lg font-medium text-ink">
                {s.zh}
              </div>
              <ul className="mt-3 space-y-1.5">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="mono flex items-center gap-2 text-[0.72rem] text-ink-muted"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-tide/60" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            {/* connector between stages */}
            {i < STAGES.length - 1 && (
              <div className="flex items-center justify-center py-1 md:px-1">
                <div className="relative flex h-8 w-full items-center justify-center md:h-full md:w-8">
                  <span className="hidden h-px w-full bg-line-strong md:block" />
                  <span className="h-8 w-px bg-line-strong md:hidden" />
                  <svg
                    viewBox="0 0 10 10"
                    className="absolute h-2.5 w-2.5 text-tide"
                    aria-hidden
                  >
                    <path
                      d="M2 2l4 3-4 3"
                      className="hidden md:block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 4l3 4 3-4"
                      className="md:hidden"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* feedback rail */}
      <div className="mt-3 flex items-center gap-3 rounded-sm border border-dashed border-line-strong px-5 py-3">
        <svg viewBox="0 0 10 10" className="h-3 w-3 shrink-0 text-tide" aria-hidden>
          <path
            d="M8 2L4 5l4 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="hud !text-tide" lang="en">
          Feedback
        </span>
        <span className="text-sm text-ink-soft">
          閉迴路控制：致動結果回授至感測，ROS 節點以 Talker／Topic／Listener 串接，模組可跨載具重用。
        </span>
      </div>
    </div>
  );
}
