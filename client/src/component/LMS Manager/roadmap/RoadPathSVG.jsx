import React from "react";
import { Tree, Bush, Cloud, StarShape } from "./RoadmapDecorations";

// SVG canvas dimensions
export const SVG_W = 200;
export const SVG_H = 1000;

// Compute winding road control points from bottom → top
export function buildRoadPoints(count) {
  const cx = SVG_W / 2;
  const amp = 58;
  const topPad = 70;
  const botPad = 90;
  const usable = SVG_H - topPad - botPad;
  const segH = count > 1 ? usable / (count - 1) : usable;

  return Array.from({ length: count }, (_, i) => {
    const realY = botPad + i * segH;
    const svgY = SVG_H - realY;
    const side = i % 2 === 0 ? 1 : -1;
    return { x: cx + side * amp, y: svgY };
  });
}

// Build smooth cubic bezier SVG path string
export function buildRoadPath(pts) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

const RoadPathSVG = ({ milestones }) => {
  const pts = buildRoadPoints(milestones.length);
  const d = buildRoadPath(pts);
  const n = milestones.length;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: "100%", display: "block", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ── Clouds ── */}
      {[
        { x: 30, y: 90 },
        { x: 160, y: 220 },
        { x: 25, y: 420 },
        { x: 155, y: 640 },
        { x: 35, y: 820 },
      ].map((c, i) => (
        <Cloud key={i} x={c.x} y={c.y} opacity={0.17} />
      ))}

      {/* ── Trees ── */}
      {[
        { x: 15, y: SVG_H - 120, s: 0.85, c: "#51CF66" },
        { x: 182, y: SVG_H - 230, s: 0.7, c: "#37B24D" },
        { x: 12, y: SVG_H - 390, s: 0.9, c: "#69DB7C" },
        { x: 180, y: SVG_H - 510, s: 0.75, c: "#51CF66" },
        { x: 14, y: SVG_H - 660, s: 0.85, c: "#2F9E44" },
        { x: 182, y: SVG_H - 770, s: 0.72, c: "#69DB7C" },
        { x: 12, y: SVG_H - 880, s: 0.8, c: "#51CF66" },
      ].map((t, i) => (
        <Tree key={i} x={t.x} y={t.y} size={t.s} color={t.c} />
      ))}

      {/* ── Bushes ── */}
      {[
        { x: 170, y: SVG_H - 165, c: "#87E08A" },
        { x: 18, y: SVG_H - 310, c: "#A9E34B" },
        { x: 172, y: SVG_H - 455, c: "#74C69D" },
        { x: 16, y: SVG_H - 590, c: "#87E08A" },
        { x: 174, y: SVG_H - 715, c: "#A9E34B" },
        { x: 14, y: SVG_H - 860, c: "#74C69D" },
      ].map((b, i) => (
        <Bush key={i} x={b.x} y={b.y} color={b.c} />
      ))}

      {/* ── Stars per milestone ── */}
      {milestones.map((m, i) => {
        const pt = pts[i];
        if (!pt) return null;
        return (
          <StarShape
            key={i}
            x={i % 2 === 0 ? 175 : 22}
            y={pt.y - 30}
            color={m.color}
          />
        );
      })}

      {/* ── Road shadow ── */}
      <path
        d={d}
        stroke="#00000015"
        strokeWidth="36"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0,6)"
      />

      {/* ── Road surface ── */}
      <path
        d={d}
        stroke="#4A4A4A"
        strokeWidth="28"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Road edge line ── */}
      <path
        d={d}
        stroke="#F0C040"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 6"
        opacity="0.55"
      />

      {/* ── Center dashes ── */}
      <path
        d={d}
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="7 11"
        opacity="0.82"
      />

      {/* ── START marker ── */}
      {pts[0] && (
        <g transform={`translate(${pts[0].x},${pts[0].y + 4})`}>
          <polygon
            points="0,-9 8,5 -8,5"
            fill="#FF6B6B"
            transform="translate(0,5)"
          />
          <rect x="-30" y="8" width="60" height="23" rx="12" fill="#2D3748" />
          <text
            x="0"
            y="23.5"
            textAnchor="middle"
            fill="white"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="Nunito,sans-serif"
            letterSpacing="1.6"
          >
            START
          </text>
        </g>
      )}

      {/* ── END arrow ── */}
      {pts[n - 1] && (
        <g transform={`translate(${pts[n - 1].x},${pts[n - 1].y - 10})`}>
          <circle
            cx="0"
            cy="-22"
            r="20"
            fill="#FFD43B"
            stroke="white"
            strokeWidth="3.5"
          />
          <polygon points="0,-35 11,-20 -11,-20" fill="white" />
          <rect x="-4" y="-20" width="8" height="11" fill="white" rx="2" />
        </g>
      )}
    </svg>
  );
};

export default RoadPathSVG;
