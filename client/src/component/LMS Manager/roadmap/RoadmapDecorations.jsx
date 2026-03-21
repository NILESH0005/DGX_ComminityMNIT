import React from "react";

/* ── colour helper ──────────────────────────── */
function shift(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 0xff) + amt);
  const b = clamp((n & 0xff) + amt);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/* ── OAK / ROUND TREE ───────────────────────── */
export const Tree = ({ x, y, size = 1, color = "#51CF66" }) => {
  const dk = shift(color, -35);
  const lt = shift(color, 28);
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      <ellipse cx="2" cy="5" rx="10" ry="3.5" fill="#00000020" />
      <rect x="-3" y="-4" width="6" height="15" rx="2.5" fill="#7A5230" />
      <rect
        x="-1"
        y="-4"
        width="2"
        height="15"
        rx="1"
        fill="#9B6A40"
        opacity="0.5"
      />
      <ellipse cx="1" cy="-22" rx="14" ry="16" fill={dk} opacity="0.6" />
      <ellipse cx="-2" cy="-25" rx="13" ry="15" fill={color} />
      <ellipse cx="4" cy="-30" rx="9" ry="10" fill={lt} opacity="0.55" />
      <ellipse cx="6" cy="-34" rx="3" ry="2.5" fill="white" opacity="0.13" />
    </g>
  );
};

/* ── PINE / CONIFER ──────────────────────────── */
export const PineTree = ({ x, y, size = 1, color = "#2D8C4E" }) => {
  const dk = shift(color, -25);
  const lt = shift(color, 20);
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      <ellipse cx="1" cy="4" rx="6" ry="2.5" fill="#00000018" />
      <rect x="-2.5" y="-4" width="5" height="12" rx="2" fill="#7A5230" />
      <polygon points="0,-18 14,4 -14,4" fill={dk} opacity="0.75" />
      <polygon points="0,-28 12,-6 -12,-6" fill={color} opacity="0.9" />
      <polygon points="0,-40 10,-18 -10,-18" fill={lt} />
      <ellipse cx="2" cy="-36" rx="2" ry="3" fill="white" opacity="0.1" />
    </g>
  );
};

/* ── BUSH ────────────────────────────────────── */
export const Bush = ({ x, y, color = "#87E08A", size = 1 }) => {
  const dk = shift(color, -22);
  const lt = shift(color, 20);
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      <ellipse cx="0" cy="4" rx="13" ry="4" fill="#00000015" />
      <ellipse cx="-7" cy="1" rx="8" ry="6.5" fill={dk} opacity="0.7" />
      <ellipse cx="7" cy="1" rx="8" ry="6.5" fill={dk} opacity="0.65" />
      <ellipse cx="0" cy="-2" rx="10" ry="7.5" fill={color} />
      <ellipse cx="-3" cy="-4" rx="5" ry="4.5" fill={lt} opacity="0.5" />
    </g>
  );
};

/* ── GRASS TUFT ──────────────────────────────── */
export const GrassTuft = ({ x, y, color = "#5BBB5E", size = 1 }) => {
  const lt = shift(color, 18);
  const blades = [
    { dx: -6, h: 9, lean: -5 },
    { dx: -3, h: 12, lean: -2 },
    { dx: 0, h: 14, lean: 0 },
    { dx: 3, h: 11, lean: 3 },
    { dx: 6, h: 8, lean: 5 },
    { dx: -8, h: 7, lean: -7 },
    { dx: 8, h: 7, lean: 6 },
  ];
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M ${b.dx} 0 Q ${b.dx + b.lean} ${-b.h * 0.55} ${b.dx + b.lean * 0.5} ${-b.h}`}
          stroke={i % 2 === 0 ? color : lt}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

/* ── FLOWER ─────────────────────────────────── */
export const Flower = ({ x, y, color = "#FF6B9D", size = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <path
      d="M 0 0 Q -1.5 -5 0 -11"
      stroke="#4CAF50"
      strokeWidth="1.3"
      fill="none"
    />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <ellipse
        key={i}
        cx={Math.cos((deg * Math.PI) / 180) * 4.2}
        cy={-11 + Math.sin((deg * Math.PI) / 180) * 4.2}
        rx="2.8"
        ry="2"
        fill={color}
        opacity="0.88"
        transform={`rotate(${deg}, ${Math.cos((deg * Math.PI) / 180) * 4.2}, ${
          -11 + Math.sin((deg * Math.PI) / 180) * 4.2
        })`}
      />
    ))}
    <circle cx="0" cy="-11" r="2.2" fill="#FFD700" />
    <circle cx="0.5" cy="-12" r="0.8" fill="white" opacity="0.4" />
  </g>
);

/* ── DANDELION ───────────────────────────────── */
export const Dandelion = ({ x, y, size = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <path
      d="M 0 0 Q 1 -5 0 -12"
      stroke="#7CB342"
      strokeWidth="1.2"
      fill="none"
    />
    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
      <line
        key={i}
        x1="0"
        y1="-12"
        x2={Math.cos((deg * Math.PI) / 180) * 5}
        y2={-12 + Math.sin((deg * Math.PI) / 180) * 5}
        stroke="#DDD"
        strokeWidth="0.8"
      />
    ))}
    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
      <circle
        key={i}
        cx={Math.cos((deg * Math.PI) / 180) * 5}
        cy={-12 + Math.sin((deg * Math.PI) / 180) * 5}
        r="1"
        fill="white"
        opacity="0.9"
      />
    ))}
    <circle cx="0" cy="-12" r="1.5" fill="#FFD700" opacity="0.6" />
  </g>
);

/* ── COZY HOUSE ──────────────────────────────── */
export const House = ({
  x,
  y,
  size = 1,
  roofColor = "#C0392B",
  wallColor = "#FDFEFE",
  flip = false,
}) => (
  <g
    transform={`translate(${x},${y}) scale(${size}) ${flip ? "scale(-1,1)" : ""}`}
  >
    <ellipse cx="2" cy="5" rx="20" ry="4.5" fill="#00000018" />
    <rect x="-17" y="-22" width="34" height="27" rx="2" fill={wallColor} />
    <rect x="9" y="-22" width="8" height="27" rx="2" fill="#00000008" />
    <rect x="-5" y="-12" width="10" height="12" rx="2" fill="#8B6343" />
    <rect
      x="-5"
      y="-12"
      width="10"
      height="5"
      rx="2"
      fill="#A07848"
      opacity="0.4"
    />
    <circle cx="4" cy="-6" r="1.2" fill="#F0C040" />
    <rect
      x="-14"
      y="-18"
      width="8"
      height="7"
      rx="1.5"
      fill="#AED6F1"
      opacity="0.9"
    />
    <line
      x1="-10"
      y1="-18"
      x2="-10"
      y2="-11"
      stroke="white"
      strokeWidth="0.8"
    />
    <line
      x1="-14"
      y1="-14.5"
      x2="-6"
      y2="-14.5"
      stroke="white"
      strokeWidth="0.8"
    />
    <rect
      x="6"
      y="-18"
      width="8"
      height="7"
      rx="1.5"
      fill="#AED6F1"
      opacity="0.9"
    />
    <line x1="10" y1="-18" x2="10" y2="-11" stroke="white" strokeWidth="0.8" />
    <line
      x1="6"
      y1="-14.5"
      x2="14"
      y2="-14.5"
      stroke="white"
      strokeWidth="0.8"
    />
    <polygon points="-21,-22 21,-22 0,-46" fill={roofColor} />
    <polygon points="-21,-22 0,-46 -8,-46" fill="white" opacity="0.1" />
    <polygon points="21,-22 0,-46 8,-46" fill="#00000012" />
    <rect x="7" y="-46" width="6" height="13" rx="1.5" fill="#B0B0B0" />
    <ellipse cx="10" cy="-50" rx="3" ry="3.5" fill="#D0D0D0" opacity="0.35" />
    <ellipse cx="12" cy="-56" rx="2.5" ry="3" fill="#D0D0D0" opacity="0.22" />
  </g>
);

/* ── FENCE SECTION ───────────────────────────── */
export const Fence = ({ x, y, length = 36, flip = false }) => {
  const count = Math.floor(length / 9) + 1;
  return (
    <g transform={`translate(${x},${y}) ${flip ? "scale(-1,1)" : ""}`}>
      <rect x="0" y="-10" width={length} height="1.8" rx="0.9" fill="#C8A882" />
      <rect x="0" y="-4" width={length} height="1.8" rx="0.9" fill="#C8A882" />
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${i * 9}, 0)`}>
          <rect x="0" y="-15" width="4.5" height="15" rx="1" fill="#D4B896" />
          <polygon points="2.25,-19 0,-15 4.5,-15" fill="#D4B896" />
          <rect
            x="0.5"
            y="-15"
            width="1.5"
            height="15"
            rx="0.5"
            fill="white"
            opacity="0.1"
          />
        </g>
      ))}
    </g>
  );
};

/* ── SMALL POND ──────────────────────────────── */
export const Pond = ({ x, y, rx = 20, ry = 9 }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="#85C1E9" opacity="0.45" />
    <ellipse
      cx="0"
      cy="0"
      rx={rx * 0.85}
      ry={ry * 0.75}
      fill="#AED6F1"
      opacity="0.5"
    />
    <ellipse
      cx={-rx * 0.3}
      cy={-ry * 0.25}
      rx="4"
      ry="1.5"
      fill="white"
      opacity="0.3"
    />
    <ellipse
      cx={rx * 0.2}
      cy={ry * 0.2}
      rx="2"
      ry="1"
      fill="white"
      opacity="0.2"
    />
    <ellipse
      cx={-rx * 0.25}
      cy={ry * 0.35}
      rx="3.5"
      ry="2"
      fill="#4CAF50"
      opacity="0.55"
    />
    <ellipse
      cx={rx * 0.3}
      cy={-ry * 0.1}
      rx="2.5"
      ry="1.5"
      fill="#43A047"
      opacity="0.5"
    />
    <ellipse
      cx="0"
      cy="0"
      rx={rx}
      ry={ry}
      fill="none"
      stroke="#5BA3CF"
      strokeWidth="1"
      opacity="0.4"
    />
  </g>
);

/* ── BENCH ───────────────────────────────────── */
export const Bench = ({ x, y, size = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <rect x="-11" y="-6" width="22" height="3.5" rx="1.5" fill="#C8A882" />
    <rect x="-11" y="-13" width="22" height="3" rx="1.5" fill="#C8A882" />
    <rect x="-9" y="-3" width="3.5" height="7" rx="1" fill="#A07848" />
    <rect x="5.5" y="-3" width="3.5" height="7" rx="1" fill="#A07848" />
    <rect
      x="-9"
      y="-13"
      width="3.5"
      height="4"
      rx="1"
      fill="#A07848"
      opacity="0.6"
    />
    <rect
      x="5.5"
      y="-13"
      width="3.5"
      height="4"
      rx="1"
      fill="#A07848"
      opacity="0.6"
    />
  </g>
);

/* ── MUSHROOM ────────────────────────────────── */
export const Mushroom = ({ x, y, size = 1, color = "#E74C3C" }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <rect x="-3" y="-7" width="6" height="8" rx="2" fill="#F5DEB3" />
    <ellipse cx="0" cy="-9" rx="8.5" ry="6.5" fill={color} />
    <circle cx="-3.5" cy="-11" r="1.8" fill="white" opacity="0.7" />
    <circle cx="2.5" cy="-8" r="1.3" fill="white" opacity="0.65" />
    <circle cx="3.5" cy="-13" r="1.2" fill="white" opacity="0.6" />
  </g>
);

/* ── ROCK ────────────────────────────────────── */
export const Rock = ({ x, y, size = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <ellipse cx="1" cy="3" rx="10" ry="3.5" fill="#00000015" />
    <ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#9E9E9E" />
    <ellipse cx="-1" cy="-1" rx="8" ry="5.5" fill="#BDBDBD" />
    <ellipse cx="-3" cy="-2" rx="3.5" ry="2.5" fill="white" opacity="0.18" />
  </g>
);

/* ── LAMP POST ───────────────────────────────── */
export const LampPost = ({ x, y, size = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <rect x="-1.5" y="-30" width="3" height="32" rx="1.5" fill="#607D8B" />
    <path
      d="M 0 -30 Q 8 -30 8 -36"
      stroke="#607D8B"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <rect x="5" y="-40" width="6" height="5" rx="2" fill="#546E7A" />
    <ellipse cx="8" cy="-36" rx="5" ry="3" fill="#FFF9C4" opacity="0.5" />
    <circle cx="8" cy="-38" r="2" fill="#FFEE58" opacity="0.8" />
    <rect x="-3" y="2" width="6" height="3" rx="1" fill="#546E7A" />
  </g>
);

/* ── CLOUD ───────────────────────────────────── */
export const Cloud = ({ x, y, opacity = 0.2, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
    <ellipse cx="0" cy="0" rx="28" ry="14" fill="#D6EAF8" />
    <ellipse cx="-18" cy="7" rx="18" ry="11" fill="#D6EAF8" />
    <ellipse cx="18" cy="7" rx="18" ry="11" fill="#D6EAF8" />
    <ellipse cx="-6" cy="-8" rx="14" ry="10" fill="white" opacity="0.35" />
    <ellipse cx="8" cy="-5" rx="10" ry="8" fill="white" opacity="0.25" />
  </g>
);

/* ── STAR (kept for compat) ─────────────────── */
export const StarShape = ({ x, y, color }) => (
  <polygon
    points="0,-7 1.6,-2.5 6.5,-2.5 2.8,1.2 4,6.5 0,3.5 -4,6.5 -2.8,1.2 -6.5,-2.5 -1.6,-2.5"
    fill={color}
    transform={`translate(${x},${y})`}
    opacity="0.65"
  />
);
