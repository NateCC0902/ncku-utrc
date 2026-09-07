/**
 * Honest engineering schematic — top view of a vectored 8-thruster ROV
 * (Blue Robotics BlueROV2 Heavy configuration: 4 vectored horizontal +
 * 4 vertical thrusters). Used because no photograph of the center's own ROV
 * is available; this reflects the documented layout only.
 */
export function RovSchematic({ className = "" }: { className?: string }) {
  const aqua = "var(--color-tide)"; // structural linework (chart blue)
  const amber = "var(--color-signal)"; // camera / CG marker (crimson signal)
  const faint = "var(--color-line-strong)";

  // 4 vectored corner thrusters (x, y, rotation deg)
  const corners = [
    { x: 150, y: 150, r: 45, id: "T1" },
    { x: 370, y: 150, r: -45, id: "T2" },
    { x: 150, y: 330, r: 135, id: "T3" },
    { x: 370, y: 330, r: -135, id: "T4" },
  ];

  return (
    <svg
      viewBox="0 0 520 470"
      className={className}
      role="img"
      aria-label="BlueROV2 Heavy 向量式八推進器 ROV 上視示意圖：四具角落向量水平推進器、四具垂直推進器、前方攝影機與纜線"
    >
      {/* frame */}
      <rect
        x="150"
        y="150"
        width="220"
        height="180"
        rx="16"
        fill="color-mix(in srgb, var(--color-paper-2) 55%, transparent)"
        stroke={aqua}
        strokeWidth="1.6"
      />
      <rect
        x="168"
        y="168"
        width="184"
        height="144"
        rx="10"
        fill="none"
        stroke={faint}
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* buoyancy / CG marker */}
      <g transform="translate(260 240)">
        <circle r="9" fill="none" stroke={amber} strokeWidth="1.2" />
        <path d="M-9 0h18M0 -9v18" stroke={amber} strokeWidth="1.2" />
      </g>

      {/* 4 vertical thrusters (Heavy configuration) */}
      {[
        { x: 200, y: 198 },
        { x: 320, y: 198 },
        { x: 200, y: 282 },
        { x: 320, y: 282 },
      ].map((v, i) => (
        <g key={`v${i}`} transform={`translate(${v.x} ${v.y})`}>
          <circle r="13" fill="none" stroke={aqua} strokeWidth="1.4" />
          <circle r="3.4" fill={aqua} fillOpacity="0.5" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            className="mono"
            fontSize="7.5"
            fill="var(--color-ink-soft)"
          >
            V{i + 1}
          </text>
        </g>
      ))}
      {/* thruster count callout */}
      <text
        x="168"
        y="163"
        className="mono"
        fontSize="9"
        fill="var(--color-ink-muted)"
      >
        8 × T200 · 4 向量 + 4 垂直
      </text>

      {/* corner vectored thrusters */}
      {corners.map((c) => (
        <g key={c.id} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
          <circle r="17" fill="none" stroke={aqua} strokeWidth="1.5" />
          <path
            d="M0 -17 L0 -30 M-5 -25 L0 -31 L5 -25"
            stroke={aqua}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle r="4.5" fill={aqua} fillOpacity="0.55" />
          <text
            transform={`rotate(${-c.r})`}
            x="0"
            y="3"
            textAnchor="middle"
            className="mono"
            fontSize="8.5"
            fill="var(--color-ink-soft)"
          >
            {c.id}
          </text>
        </g>
      ))}

      {/* camera + FOV wedge (front = up) */}
      <g transform="translate(260 150)">
        <path
          d="M0 0 L-46 -54 A72 72 0 0 1 46 -54 Z"
          fill={amber}
          fillOpacity="0.09"
          stroke={amber}
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <circle cy="-6" r="7" fill="var(--color-paper)" stroke={amber} strokeWidth="1.5" />
        <circle cy="-6" r="2.6" fill={amber} />
      </g>

      {/* tether (back = down) */}
      <path
        d="M260 330 C 260 380, 300 400, 300 448"
        fill="none"
        stroke={aqua}
        strokeWidth="1.6"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
      <text
        x="312"
        y="440"
        className="mono"
        fontSize="9"
        fill="var(--color-ink-muted)"
      >
        Fathom 纜線
      </text>

      {/* dimension: width */}
      <g stroke={faint} strokeWidth="1">
        <path d="M150 120 v-18 M370 120 v-18" />
        <path d="M150 108 H370" markerStart="url(#a)" markerEnd="url(#a)" />
      </g>
      <text
        x="260"
        y="100"
        textAnchor="middle"
        className="mono"
        fontSize="10"
        fill="var(--color-ink-soft)"
      >
        338 mm
      </text>

      {/* dimension: length */}
      <g stroke={faint} strokeWidth="1">
        <path d="M370 150 h20 M370 330 h20" />
        <path d="M388 150 V330" />
      </g>
      <text
        x="398"
        y="245"
        className="mono"
        fontSize="10"
        fill="var(--color-ink-soft)"
        transform="rotate(90 398 245)"
        textAnchor="middle"
      >
        457 mm
      </text>

      <defs>
        <marker
          id="a"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M2 2 L6 4 L2 6" fill="none" stroke={faint} strokeWidth="1" />
        </marker>
      </defs>
    </svg>
  );
}
