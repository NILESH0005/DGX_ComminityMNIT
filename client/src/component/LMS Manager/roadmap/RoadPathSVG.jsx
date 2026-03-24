import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import CertificateAnimation from "./Certificate.json";

/* ── Inline Lottie for SVG foreignObject ── */
const CertificateLottie = ({ size }) => {
  const ref = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    animRef.current = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: CertificateAnimation,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);
  return <div ref={ref} style={{ width: size, height: size }} />;
};
import {
  Tree,
  PineTree,
  Bush,
  GrassTuft,
  Flower,
  Dandelion,
  House,
  Fence,
  Pond,
  Cloud,
  Bench,
  Mushroom,
  Rock,
  LampPost,
} from "./RoadmapDecorations";
import RoadCarSVG from "./RoadCarSVG";
import CertificateCard from "../../CertificateCard";
import Swal from "sweetalert2";

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

const ROAD_HALF = 15;

/**
 * Sample a point on the cubic bezier and return position + outward offset.
 * side: +1 = left of travel, -1 = right
 * dist = pixels beyond road edge (ROAD_HALF)
 */
function roadEdgePoint(pts, segIndex, t, side, dist) {
  const clamped = Math.min(segIndex, pts.length - 2);
  const prev = pts[clamped];
  const curr = pts[clamped + 1];
  const midY = (prev.y + curr.y) / 2;

  const mt = 1 - t;
  const pos = {
    x:
      mt * mt * mt * prev.x +
      3 * mt * mt * t * prev.x +
      3 * mt * t * t * curr.x +
      t * t * t * curr.x,
    y:
      mt * mt * mt * prev.y +
      3 * mt * mt * t * midY +
      3 * mt * t * t * midY +
      t * t * t * curr.y,
  };

  const dt = 0.01;
  const tc = Math.min(t + dt, 1.0);
  const mtc = 1 - tc;
  const pos2 = {
    x:
      mtc * mtc * mtc * prev.x +
      3 * mtc * mtc * tc * prev.x +
      3 * mtc * tc * tc * curr.x +
      tc * tc * tc * curr.x,
    y:
      mtc * mtc * mtc * prev.y +
      3 * mtc * mtc * tc * midY +
      3 * mtc * tc * tc * midY +
      tc * tc * tc * curr.y,
  };

  let tx = pos2.x - pos.x;
  let ty = pos2.y - pos.y;
  const len = Math.sqrt(tx * tx + ty * ty) || 1;
  tx /= len;
  ty /= len;
  const nx = -ty;
  const ny = tx;

  return {
    x: pos.x + side * nx * (ROAD_HALF + dist),
    y: pos.y + side * ny * (ROAD_HALF + dist),
  };
}

// ─── BIOME DEFINITIONS ────────────────────────────────────────────────────────
// Each biome knows how to render its background and foreground decorations
// given an anchor helper `P(t, side, dist)` scoped to that segment.

const BIOMES = [
  // 0 – Spring Meadow
  {
    name: "spring",
    clouds: { opacity: 0.22, scale: 0.72 },
    background: (P) => (
      <>
        <Tree
          x={P(0.15, +1, 30).x}
          y={P(0.15, +1, 30).y}
          size={0.8}
          color="#51CF66"
        />
        <Tree
          x={P(0.15, +1, 30).x + 11}
          y={P(0.15, +1, 30).y + 2}
          size={0.62}
          color="#69DB7C"
        />
        <Bush
          x={P(0.45, +1, 24).x}
          y={P(0.45, +1, 24).y}
          size={0.9}
          color="#87E08A"
        />
        <Bush
          x={P(0.45, +1, 24).x + 9}
          y={P(0.45, +1, 24).y + 1}
          size={0.7}
          color="#A9E34B"
        />
        <Tree
          x={P(0.75, +1, 28).x}
          y={P(0.75, +1, 28).y}
          size={0.75}
          color="#37B24D"
        />
        <Tree
          x={P(0.25, -1, 26).x}
          y={P(0.25, -1, 26).y}
          size={0.78}
          color="#51CF66"
        />
        <Bush
          x={P(0.25, -1, 26).x - 9}
          y={P(0.25, -1, 26).y + 2}
          size={0.85}
          color="#74C69D"
        />
        <Bench x={P(0.55, -1, 22).x} y={P(0.55, -1, 22).y} size={0.9} />
        <Bush
          x={P(0.55, -1, 22).x + 8}
          y={P(0.55, -1, 22).y + 1}
          size={0.72}
          color="#87E08A"
        />
        <Tree
          x={P(0.82, -1, 30).x}
          y={P(0.82, -1, 30).y}
          size={0.72}
          color="#69DB7C"
        />
        <Bush
          x={P(0.82, -1, 30).x - 8}
          y={P(0.82, -1, 30).y + 2}
          size={0.65}
          color="#A9E34B"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.35, +1, 6).x}
          y={P(0.35, +1, 6).y}
          color="#5BBB5E"
          size={0.95}
        />
        <Flower
          x={P(0.35, +1, 6).x - 3}
          y={P(0.35, +1, 6).y - 2}
          color="#FF6B9D"
          size={0.8}
        />
        <Flower
          x={P(0.35, +1, 6).x + 4}
          y={P(0.35, +1, 6).y - 1}
          color="#FFD700"
          size={0.72}
        />
        <GrassTuft
          x={P(0.65, -1, 6).x}
          y={P(0.65, -1, 6).y}
          color="#6CC46F"
          size={0.88}
        />
        <Flower
          x={P(0.65, -1, 6).x + 3}
          y={P(0.65, -1, 6).y - 2}
          color="#FF9F43"
          size={0.75}
        />
        <Dandelion
          x={P(0.65, -1, 6).x - 4}
          y={P(0.65, -1, 6).y - 1}
          size={0.8}
        />
      </>
    ),
  },

  // 1 – Pine Forest
  {
    name: "pine",
    clouds: { opacity: 0.19, scale: 0.88 },
    background: (P) => (
      <>
        <PineTree
          x={P(0.1, +1, 34).x}
          y={P(0.1, +1, 34).y}
          size={0.92}
          color="#2D8C4E"
        />
        <PineTree
          x={P(0.1, +1, 34).x + 12}
          y={P(0.1, +1, 34).y + 1}
          size={0.72}
          color="#2F9E44"
        />
        <PineTree
          x={P(0.1, +1, 34).x - 8}
          y={P(0.1, +1, 34).y + 3}
          size={0.6}
          color="#276749"
        />
        <PineTree
          x={P(0.38, +1, 26).x}
          y={P(0.38, +1, 26).y}
          size={0.85}
          color="#2D8C4E"
        />
        <PineTree
          x={P(0.38, +1, 26).x + 9}
          y={P(0.38, +1, 26).y + 2}
          size={0.65}
          color="#37A05A"
        />
        <Rock x={P(0.68, +1, 30).x} y={P(0.68, +1, 30).y} size={0.8} />
        <Rock x={P(0.68, +1, 30).x + 7} y={P(0.68, +1, 30).y + 2} size={0.55} />
        <PineTree
          x={P(0.2, -1, 32).x}
          y={P(0.2, -1, 32).y}
          size={0.88}
          color="#2F9E44"
        />
        <PineTree
          x={P(0.2, -1, 32).x - 10}
          y={P(0.2, -1, 32).y + 2}
          size={0.68}
          color="#2D8C4E"
        />
        <PineTree
          x={P(0.5, -1, 28).x}
          y={P(0.5, -1, 28).y}
          size={0.8}
          color="#276749"
        />
        <PineTree
          x={P(0.5, -1, 28).x + 10}
          y={P(0.5, -1, 28).y + 1}
          size={0.58}
          color="#2F9E44"
        />
        <Rock x={P(0.8, -1, 34).x} y={P(0.8, -1, 34).y} size={0.75} />
        <Rock x={P(0.8, -1, 34).x - 8} y={P(0.8, -1, 34).y + 3} size={0.5} />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.55, +1, 6).x}
          y={P(0.55, +1, 6).y}
          color="#4CAF50"
          size={1.0}
        />
        <Mushroom
          x={P(0.55, +1, 6).x + 4}
          y={P(0.55, +1, 6).y - 1}
          color="#E74C3C"
          size={0.82}
        />
        <Mushroom
          x={P(0.55, +1, 6).x - 5}
          y={P(0.55, +1, 6).y}
          color="#8B4513"
          size={0.65}
        />
        <GrassTuft
          x={P(0.3, -1, 6).x}
          y={P(0.3, -1, 6).y}
          color="#388E3C"
          size={0.92}
        />
        <Mushroom
          x={P(0.3, -1, 6).x - 4}
          y={P(0.3, -1, 6).y - 1}
          color="#E74C3C"
          size={0.75}
        />
        <Rock x={P(0.3, -1, 6).x + 5} y={P(0.3, -1, 6).y + 1} size={0.6} />
      </>
    ),
  },

  // 2 – Village
  {
    name: "village",
    clouds: { opacity: 0.21, scale: 0.65 },
    background: (P) => (
      <>
        <House
          x={P(0.12, +1, 32).x}
          y={P(0.12, +1, 32).y}
          size={0.58}
          roofColor="#27AE60"
          wallColor="#FDFEFE"
          flip
        />
        <Fence
          x={P(0.12, +1, 32).x - 16}
          y={P(0.12, +1, 32).y + 2}
          length={32}
          flip
        />
        <Bench
          x={P(0.12, +1, 32).x + 14}
          y={P(0.12, +1, 32).y + 2}
          size={0.85}
        />
        <Tree
          x={P(0.48, +1, 26).x}
          y={P(0.48, +1, 26).y}
          size={0.75}
          color="#51CF66"
        />
        <Bush
          x={P(0.48, +1, 26).x + 8}
          y={P(0.48, +1, 26).y + 1}
          size={0.8}
          color="#74C69D"
        />
        <Bush
          x={P(0.78, +1, 28).x}
          y={P(0.78, +1, 28).y}
          size={0.7}
          color="#87E08A"
        />
        <House
          x={P(0.22, -1, 30).x}
          y={P(0.22, -1, 30).y}
          size={0.55}
          roofColor="#C0392B"
          wallColor="#FDFEFE"
        />
        <Fence
          x={P(0.22, -1, 30).x - 6}
          y={P(0.22, -1, 30).y + 2}
          length={26}
        />
        <LampPost x={P(0.55, -1, 32).x} y={P(0.55, -1, 32).y} size={0.7} />
        <Tree
          x={P(0.55, -1, 32).x + 10}
          y={P(0.55, -1, 32).y}
          size={0.72}
          color="#37B24D"
        />
        <Bush
          x={P(0.85, -1, 22).x}
          y={P(0.85, -1, 22).y}
          size={0.78}
          color="#87E08A"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.38, +1, 6).x}
          y={P(0.38, +1, 6).y}
          color="#5BBB5E"
          size={0.9}
        />
        <Flower
          x={P(0.38, +1, 6).x - 4}
          y={P(0.38, +1, 6).y - 2}
          color="#A29BFE"
          size={0.78}
        />
        <LampPost x={P(0.38, +1, 6).x + 5} y={P(0.38, +1, 6).y} size={0.65} />
        <GrassTuft
          x={P(0.7, -1, 6).x}
          y={P(0.7, -1, 6).y}
          color="#66BB6A"
          size={0.85}
        />
        <Flower
          x={P(0.7, -1, 6).x + 3}
          y={P(0.7, -1, 6).y - 2}
          color="#FF6B9D"
          size={0.72}
        />
        <Flower
          x={P(0.7, -1, 6).x - 4}
          y={P(0.7, -1, 6).y - 1}
          color="#FFC312"
          size={0.68}
        />
      </>
    ),
  },

  // 3 – Autumn Grove
  {
    name: "autumn",
    clouds: { opacity: 0.2, scale: 0.8 },
    background: (P) => (
      <>
        <Tree
          x={P(0.15, +1, 30).x}
          y={P(0.15, +1, 30).y}
          size={0.88}
          color="#E67E22"
        />
        <Tree
          x={P(0.15, +1, 30).x + 11}
          y={P(0.15, +1, 30).y + 2}
          size={0.68}
          color="#D35400"
        />
        <Bush
          x={P(0.42, +1, 26).x}
          y={P(0.42, +1, 26).y}
          size={0.88}
          color="#F39C12"
        />
        <Bush
          x={P(0.42, +1, 26).x - 8}
          y={P(0.42, +1, 26).y + 1}
          size={0.65}
          color="#E67E22"
        />
        <Tree
          x={P(0.72, +1, 32).x}
          y={P(0.72, +1, 32).y}
          size={0.78}
          color="#CA6F1E"
        />
        <Pond x={P(0.25, -1, 34).x} y={P(0.25, -1, 34).y - 5} rx={18} ry={8} />
        <GrassTuft
          x={P(0.25, -1, 34).x - 16}
          y={P(0.25, -1, 34).y + 2}
          color="#7CB342"
          size={0.8}
        />
        <GrassTuft
          x={P(0.25, -1, 34).x + 16}
          y={P(0.25, -1, 34).y + 1}
          color="#8BC34A"
          size={0.75}
        />
        <Tree
          x={P(0.55, -1, 26).x}
          y={P(0.55, -1, 26).y}
          size={0.82}
          color="#E74C3C"
        />
        <Bush
          x={P(0.55, -1, 26).x - 9}
          y={P(0.55, -1, 26).y + 2}
          size={0.72}
          color="#F39C12"
        />
        <Tree
          x={P(0.82, -1, 30).x}
          y={P(0.82, -1, 30).y}
          size={0.7}
          color="#D35400"
        />
        <Bush
          x={P(0.82, -1, 30).x + 8}
          y={P(0.82, -1, 30).y + 1}
          size={0.6}
          color="#CA6F1E"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.58, +1, 7).x}
          y={P(0.58, +1, 7).y}
          color="#A0522D"
          size={0.88}
        />
        <Dandelion
          x={P(0.58, +1, 7).x + 3}
          y={P(0.58, +1, 7).y - 2}
          size={0.85}
        />
        <Flower
          x={P(0.58, +1, 7).x - 4}
          y={P(0.58, +1, 7).y - 1}
          color="#E67E22"
          size={0.78}
        />
        <GrassTuft
          x={P(0.35, -1, 7).x}
          y={P(0.35, -1, 7).y}
          color="#CD853F"
          size={0.9}
        />
        <Dandelion
          x={P(0.35, -1, 7).x - 3}
          y={P(0.35, -1, 7).y - 2}
          size={0.8}
        />
        <Mushroom
          x={P(0.35, -1, 7).x + 5}
          y={P(0.35, -1, 7).y}
          color="#F39C12"
          size={0.78}
        />
      </>
    ),
  },

  // 4 – Rocky Pass
  {
    name: "rocky",
    clouds: { opacity: 0.18, scale: 0.7 },
    background: (P) => (
      <>
        <Rock x={P(0.12, +1, 28).x} y={P(0.12, +1, 28).y} size={1.1} />
        <Rock
          x={P(0.12, +1, 28).x + 10}
          y={P(0.12, +1, 28).y + 3}
          size={0.75}
        />
        <PineTree
          x={P(0.12, +1, 28).x - 6}
          y={P(0.12, +1, 28).y - 2}
          size={0.7}
          color="#276749"
        />
        <Rock x={P(0.5, +1, 32).x} y={P(0.5, +1, 32).y} size={0.9} />
        <PineTree
          x={P(0.5, +1, 32).x + 8}
          y={P(0.5, +1, 32).y - 1}
          size={0.6}
          color="#2D8C4E"
        />
        <Rock x={P(0.78, +1, 24).x} y={P(0.78, +1, 24).y} size={0.8} />
        <Rock x={P(0.2, -1, 30).x} y={P(0.2, -1, 30).y} size={1.0} />
        <Rock x={P(0.2, -1, 30).x - 8} y={P(0.2, -1, 30).y + 4} size={0.65} />
        <PineTree
          x={P(0.2, -1, 30).x + 6}
          y={P(0.2, -1, 30).y - 2}
          size={0.65}
          color="#276749"
        />
        <Rock x={P(0.48, -1, 28).x} y={P(0.48, -1, 28).y} size={0.85} />
        <Rock x={P(0.48, -1, 28).x + 9} y={P(0.48, -1, 28).y + 3} size={0.55} />
        <PineTree
          x={P(0.82, -1, 32).x}
          y={P(0.82, -1, 32).y - 2}
          size={0.72}
          color="#2F9E44"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <Rock x={P(0.35, +1, 6).x} y={P(0.35, +1, 6).y} size={0.88} />
        <Rock x={P(0.35, +1, 6).x + 6} y={P(0.35, +1, 6).y + 2} size={0.6} />
        <GrassTuft
          x={P(0.35, +1, 6).x - 5}
          y={P(0.35, +1, 6).y}
          color="#78909C"
          size={0.8}
        />
        <Rock x={P(0.65, -1, 6).x} y={P(0.65, -1, 6).y} size={0.82} />
        <Rock x={P(0.65, -1, 6).x - 6} y={P(0.65, -1, 6).y + 3} size={0.55} />
        <GrassTuft
          x={P(0.65, -1, 6).x + 4}
          y={P(0.65, -1, 6).y}
          color="#607D8B"
          size={0.75}
        />
      </>
    ),
  },

  // 5 – Lakeside
  {
    name: "lakeside",
    clouds: { opacity: 0.22, scale: 0.9 },
    background: (P) => (
      <>
        <Pond x={P(0.15, +1, 32).x} y={P(0.15, +1, 32).y - 6} rx={22} ry={10} />
        <GrassTuft
          x={P(0.15, +1, 32).x - 18}
          y={P(0.15, +1, 32).y + 2}
          color="#4CAF50"
          size={0.85}
        />
        <GrassTuft
          x={P(0.15, +1, 32).x + 18}
          y={P(0.15, +1, 32).y + 1}
          color="#66BB6A"
          size={0.8}
        />
        <Tree
          x={P(0.5, +1, 26).x}
          y={P(0.5, +1, 26).y}
          size={0.82}
          color="#37B24D"
        />
        <Bush
          x={P(0.5, +1, 26).x + 9}
          y={P(0.5, +1, 26).y + 1}
          size={0.78}
          color="#74C69D"
        />
        <GrassTuft
          x={P(0.78, +1, 30).x}
          y={P(0.78, +1, 30).y}
          color="#56C060"
          size={0.9}
        />
        <Tree
          x={P(0.22, -1, 28).x}
          y={P(0.22, -1, 28).y}
          size={0.85}
          color="#37B24D"
        />
        <Bush
          x={P(0.22, -1, 28).x - 9}
          y={P(0.22, -1, 28).y + 2}
          size={0.8}
          color="#74C69D"
        />
        <Pond x={P(0.55, -1, 32).x} y={P(0.55, -1, 32).y - 5} rx={16} ry={7} />
        <GrassTuft
          x={P(0.55, -1, 32).x - 14}
          y={P(0.55, -1, 32).y + 2}
          color="#4CAF50"
          size={0.72}
        />
        <GrassTuft
          x={P(0.55, -1, 32).x + 14}
          y={P(0.55, -1, 32).y + 1}
          color="#66BB6A"
          size={0.68}
        />
        <Tree
          x={P(0.82, -1, 24).x}
          y={P(0.82, -1, 24).y}
          size={0.75}
          color="#2F9E44"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.4, +1, 6).x}
          y={P(0.4, +1, 6).y}
          color="#4CAF50"
          size={0.95}
        />
        <Flower
          x={P(0.4, +1, 6).x + 3}
          y={P(0.4, +1, 6).y - 2}
          color="#00B894"
          size={0.78}
        />
        <Dandelion
          x={P(0.4, +1, 6).x - 5}
          y={P(0.4, +1, 6).y - 1}
          size={0.82}
        />
        <GrassTuft
          x={P(0.65, -1, 6).x}
          y={P(0.65, -1, 6).y}
          color="#56C060"
          size={0.9}
        />
        <Flower
          x={P(0.65, -1, 6).x - 3}
          y={P(0.65, -1, 6).y - 2}
          color="#26C6DA"
          size={0.75}
        />
        <GrassTuft
          x={P(0.65, -1, 6).x + 6}
          y={P(0.65, -1, 6).y + 1}
          color="#66BB6A"
          size={0.7}
        />
      </>
    ),
  },

  // 6 – Enchanted
  {
    name: "enchanted",
    clouds: { opacity: 0.19, scale: 0.68 },
    background: (P) => (
      <>
        <Tree
          x={P(0.2, +1, 30).x}
          y={P(0.2, +1, 30).y}
          size={0.88}
          color="#6C3483"
        />
        <Tree
          x={P(0.2, +1, 30).x + 11}
          y={P(0.2, +1, 30).y + 2}
          size={0.65}
          color="#8E44AD"
        />
        <PineTree
          x={P(0.2, +1, 30).x - 7}
          y={P(0.2, +1, 30).y + 1}
          size={0.72}
          color="#117A65"
        />
        <Bush
          x={P(0.6, +1, 26).x}
          y={P(0.6, +1, 26).y}
          size={0.85}
          color="#76D7C4"
        />
        <Tree
          x={P(0.6, +1, 26).x + 10}
          y={P(0.6, +1, 26).y}
          size={0.7}
          color="#7D3C98"
        />
        <Tree
          x={P(0.3, -1, 32).x}
          y={P(0.3, -1, 32).y}
          size={0.82}
          color="#8E44AD"
        />
        <PineTree
          x={P(0.3, -1, 32).x - 9}
          y={P(0.3, -1, 32).y + 1}
          size={0.68}
          color="#117A65"
        />
        <Bush
          x={P(0.7, -1, 28).x}
          y={P(0.7, -1, 28).y}
          size={0.8}
          color="#48C9B0"
        />
        <Tree
          x={P(0.7, -1, 28).x + 9}
          y={P(0.7, -1, 28).y + 2}
          size={0.62}
          color="#6C3483"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.45, +1, 6).x}
          y={P(0.45, +1, 6).y}
          color="#76D7C4"
          size={0.9}
        />
        <Flower
          x={P(0.45, +1, 6).x - 3}
          y={P(0.45, +1, 6).y - 2}
          color="#A29BFE"
          size={0.82}
        />
        <Flower
          x={P(0.45, +1, 6).x + 4}
          y={P(0.45, +1, 6).y - 1}
          color="#D980FA"
          size={0.72}
        />
        <GrassTuft
          x={P(0.5, -1, 6).x}
          y={P(0.5, -1, 6).y}
          color="#48C9B0"
          size={0.85}
        />
        <Flower
          x={P(0.5, -1, 6).x + 3}
          y={P(0.5, -1, 6).y - 2}
          color="#A29BFE"
          size={0.78}
        />
        <Dandelion x={P(0.5, -1, 6).x - 4} y={P(0.5, -1, 6).y - 1} size={0.8} />
      </>
    ),
  },

  // 7 – Snowy Peak (extra variety for longer roadmaps)
  {
    name: "snowy",
    clouds: { opacity: 0.25, scale: 0.78 },
    background: (P) => (
      <>
        <PineTree
          x={P(0.15, +1, 32).x}
          y={P(0.15, +1, 32).y}
          size={0.9}
          color="#4A90A4"
        />
        <PineTree
          x={P(0.15, +1, 32).x + 12}
          y={P(0.15, +1, 32).y + 2}
          size={0.68}
          color="#5BA3B8"
        />
        <Rock x={P(0.45, +1, 28).x} y={P(0.45, +1, 28).y} size={0.95} />
        <Rock x={P(0.45, +1, 28).x + 9} y={P(0.45, +1, 28).y + 3} size={0.65} />
        <PineTree
          x={P(0.75, +1, 30).x}
          y={P(0.75, +1, 30).y}
          size={0.75}
          color="#3D7A8A"
        />
        <PineTree
          x={P(0.2, -1, 34).x}
          y={P(0.2, -1, 34).y}
          size={0.85}
          color="#4A90A4"
        />
        <Rock x={P(0.2, -1, 34).x - 10} y={P(0.2, -1, 34).y + 2} size={0.7} />
        <PineTree
          x={P(0.55, -1, 26).x}
          y={P(0.55, -1, 26).y}
          size={0.8}
          color="#5BA3B8"
        />
        <Rock x={P(0.82, -1, 30).x} y={P(0.82, -1, 30).y} size={0.88} />
        <Rock x={P(0.82, -1, 30).x - 8} y={P(0.82, -1, 30).y + 3} size={0.55} />
      </>
    ),
    foreground: (P) => (
      <>
        <Rock x={P(0.35, +1, 6).x} y={P(0.35, +1, 6).y} size={0.85} />
        <GrassTuft
          x={P(0.35, +1, 6).x - 5}
          y={P(0.35, +1, 6).y}
          color="#B0BEC5"
          size={0.8}
        />
        <Rock x={P(0.35, +1, 6).x + 7} y={P(0.35, +1, 6).y + 2} size={0.55} />
        <Rock x={P(0.65, -1, 6).x} y={P(0.65, -1, 6).y} size={0.78} />
        <GrassTuft
          x={P(0.65, -1, 6).x + 5}
          y={P(0.65, -1, 6).y}
          color="#90A4AE"
          size={0.75}
        />
        <Mushroom
          x={P(0.65, -1, 6).x - 4}
          y={P(0.65, -1, 6).y - 1}
          color="#78909C"
          size={0.7}
        />
      </>
    ),
  },

  // 8 – Tropical
  {
    name: "tropical",
    clouds: { opacity: 0.18, scale: 0.85 },
    background: (P) => (
      <>
        <Tree
          x={P(0.12, +1, 30).x}
          y={P(0.12, +1, 30).y}
          size={0.95}
          color="#00B894"
        />
        <Tree
          x={P(0.12, +1, 30).x + 13}
          y={P(0.12, +1, 30).y + 1}
          size={0.72}
          color="#00CEC9"
        />
        <Bush
          x={P(0.45, +1, 26).x}
          y={P(0.45, +1, 26).y}
          size={0.9}
          color="#55EFC4"
        />
        <Tree
          x={P(0.45, +1, 26).x - 9}
          y={P(0.45, +1, 26).y + 2}
          size={0.65}
          color="#00B894"
        />
        <Pond x={P(0.75, +1, 32).x} y={P(0.75, +1, 32).y - 5} rx={19} ry={9} />
        <Tree
          x={P(0.22, -1, 28).x}
          y={P(0.22, -1, 28).y}
          size={0.88}
          color="#6AB04C"
        />
        <Bush
          x={P(0.22, -1, 28).x - 10}
          y={P(0.22, -1, 28).y + 2}
          size={0.82}
          color="#55EFC4"
        />
        <Tree
          x={P(0.55, -1, 30).x}
          y={P(0.55, -1, 30).y}
          size={0.78}
          color="#00CEC9"
        />
        <Tree
          x={P(0.55, -1, 30).x + 11}
          y={P(0.55, -1, 30).y + 2}
          size={0.6}
          color="#00B894"
        />
        <Bush
          x={P(0.82, -1, 26).x}
          y={P(0.82, -1, 26).y}
          size={0.75}
          color="#A3CB38"
        />
      </>
    ),
    foreground: (P) => (
      <>
        <GrassTuft
          x={P(0.38, +1, 6).x}
          y={P(0.38, +1, 6).y}
          color="#00B894"
          size={1.0}
        />
        <Flower
          x={P(0.38, +1, 6).x + 3}
          y={P(0.38, +1, 6).y - 2}
          color="#FDCB6E"
          size={0.85}
        />
        <Flower
          x={P(0.38, +1, 6).x - 4}
          y={P(0.38, +1, 6).y - 1}
          color="#E17055"
          size={0.78}
        />
        <GrassTuft
          x={P(0.68, -1, 6).x}
          y={P(0.68, -1, 6).y}
          color="#55EFC4"
          size={0.92}
        />
        <Flower
          x={P(0.68, -1, 6).x - 3}
          y={P(0.68, -1, 6).y - 2}
          color="#FF7675"
          size={0.8}
        />
        <Dandelion
          x={P(0.68, -1, 6).x + 5}
          y={P(0.68, -1, 6).y - 1}
          size={0.75}
        />
      </>
    ),
  },
];

// ─── CLOUD PLACEMENT ──────────────────────────────────────────────────────────
// Distribute clouds evenly across the SVG height based on milestone count
function buildClouds(milestoneCount) {
  const count = Math.max(milestoneCount * 2, 4);
  const clouds = [];
  const leftXs = [16, 20, 22, 18, 15];
  const rightXs = [155, 158, 162, 165, 160];

  for (let i = 0; i < count; i++) {
    const y = 50 + (i / count) * (SVG_H - 100);
    const isLeft = i % 2 === 0;
    const xArr = isLeft ? leftXs : rightXs;
    const x = xArr[i % xArr.length];
    const biome = BIOMES[(i * 3) % BIOMES.length];
    clouds.push(
      <Cloud
        key={`cloud-${i}`}
        x={x}
        y={y}
        opacity={biome.clouds.opacity}
        scale={biome.clouds.scale}
      />,
    );
  }
  return clouds;
}

// function handleClick() => {
//   navigator("./quiz")
// }

/**
 * RoadPathSVG
 *
 * Decorations are fully procedural — they are computed for every segment
 * dynamically based on milestones.length, cycling through biome themes.
 * Adding more milestones automatically populates more scenery.
 */
const RoadPathSVG = ({
  milestones,
  currentStepIndex = 0,
  onCarMove,
  onCertificateClick,
  quizCompleted,
  allSubModulesCompleted,
  isCertificateReady,
  user,
  moduleName,
}) => {
  const pts = buildRoadPoints(milestones.length);
  const d = buildRoadPath(pts);
  const n = milestones.length;
  const segs = Math.max(n - 1, 1);

  if (pts.length < 2) return null;

  // Scoped anchor helper for a given segment index
  const makeP = (si) => (t, side, dist) =>
    roadEdgePoint(pts, Math.min(si, segs - 1), t, side, dist);

  // Build per-segment decorations
  const bgLayers = [];
  const fgLayers = [];
  const areAllMilestonesCompleted = milestones.every((m) => m.isCompleted);

  for (let si = 0; si < segs; si++) {
    const biome = BIOMES[si % BIOMES.length];
    const P = makeP(si);
    bgLayers.push(<g key={`bg-seg-${si}`}>{biome.background(P)}</g>);
    fgLayers.push(<g key={`fg-seg-${si}`}>{biome.foreground(P)}</g>);
  }

  // Determine the state of the certificate button
  const isLocked = !allSubModulesCompleted && !areAllMilestonesCompleted;
  const isQuizAvailable =
    (allSubModulesCompleted || areAllMilestonesCompleted) && !quizCompleted;
  const isFullyCompleted =
    isCertificateReady ||
    (quizCompleted && (allSubModulesCompleted || areAllMilestonesCompleted));

  // Get the number of remaining milestones for the tooltip
  const remainingMilestones = milestones.filter((m) => !m.isCompleted).length;

  const handleCertificateClick = () => {
    if (isLocked) {
      Swal.fire({
        icon: "info",
        title: "🔒 Quiz Locked",
        html: `
          <div style="text-align:center;font-family:'Nunito',sans-serif;">
            <p style="color:#4b5563;margin-bottom:12px;font-size:15px;">
              Complete all milestones to unlock the quiz and earn your certificate!
            </p>
            <div style="display:inline-flex;align-items:center;gap:8px;background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:8px 16px;">
              <span style="font-size:18px;">📚</span>
              <span style="color:#92400e;font-weight:700;font-size:13px;">
                ${remainingMilestones} milestone${remainingMilestones !== 1 ? "s" : ""} remaining
              </span>
            </div>
            <p style="color:#6b7280;font-size:12px;margin-top:12px;">
              Complete all video modules to unlock the final quiz
            </p>
          </div>
        `,
        confirmButtonColor: "#6b7280",
        confirmButtonText: "Got it",
        showCloseButton: true,
      });
      return;
    }

    if (isQuizAvailable) {
      if (onCertificateClick) {
        onCertificateClick();
      }
      return;
    }

    if (isFullyCompleted) {
      Swal.fire({
        icon: "success",
        title: "🏆 Certificate Earned! 🏆",
        html: `
          <div style="text-align:center;font-family:'Nunito',sans-serif;">
            <p style="color:#4b5563;margin-bottom:12px;font-size:15px;">
              Congratulations! You've completed all milestones and passed the quiz!
            </p>
            <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);border-radius:12px;padding:16px;margin-top:12px;">
              <p style="color:white;font-weight:800;margin-bottom:4px;">${user?.name || "Learner"}</p>
              <p style="color:rgba(255,255,255,0.9);font-size:12px;">${moduleName || "Course"} Certificate</p>
            </div>
          </div>
        `,
        confirmButtonColor: "#10b981",
        confirmButtonText: "View Certificate",
        showCancelButton: true,
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          // You can add certificate viewing logic here
        }
      });
      return;
    }
  };

  const getTooltipText = () => {
    if (isLocked) {
      return `Complete ${remainingMilestones} more ${remainingMilestones === 1 ? "milestone" : "milestones"} to unlock the quiz`;
    }
    if (isQuizAvailable) {
      return "Take the final quiz to earn your certificate!";
    }
    if (isFullyCompleted) {
      return "Certificate earned! Click to view";
    }
    return "";
  };

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: "100%", display: "block", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ══ LAYER 0 – CLOUDS (auto-scaled to milestone count) ══ */}
      {buildClouds(n)}

      {/* ══ LAYER 1 – BACKGROUND SCENERY (procedural per segment) ══ */}
      {bgLayers}

      {/* ══ LAYER 2 – ROAD ══ */}
      {/* Shadow */}
      <path
        d={d}
        stroke="#00000018"
        strokeWidth="38"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0,5)"
      />
      {/* Surface */}
      <path
        d={d}
        stroke="#4A4A4A"
        strokeWidth="28"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Edge dashes */}
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
      {/* Centre dashes */}
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

      {/* ══ LAYER 3 – FOREGROUND SCENERY (procedural per segment) ══ */}
      {fgLayers}

      {/* ══ LAYER 4 – ANIMATED CAR ══ */}
      {n > 0 && (
        <RoadCarSVG
          milestones={milestones}
          currentStepIndex={currentStepIndex}
          onCarMove={onCarMove}
        />
      )}

      {/* ══ LAYER 5 – START MARKER ══ */}
      {pts[0] && (
        <g transform={`translate(${pts[0].x},${pts[0].y + 4})`}>
          {/* <polygon
            points="0,-9 8,5 -8,5"
            fill="#FF6B6B"
            transform="translate(0,5)"
          /> */}
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

      {/* ══ LAYER 6 – CERTIFICATE/QUIZ BUTTON ══ */}
      {pts[n - 1] && (
        <g transform={`translate(${pts[n - 1].x},${pts[n - 1].y})`}>
          {/* Glow ring with dynamic styling based on state */}
          <circle
            cx="0"
            cy="-46"
            r="34"
            fill={
              isFullyCompleted
                ? "#FFD43B"
                : isQuizAvailable
                  ? "#FFA94D"
                  : "#94a3b8"
            }
            opacity={isLocked ? "0.1" : "0.2"}
            className={!isLocked ? "trophy-glow" : ""}
            style={{
              animation: isFullyCompleted
                ? "glowPulse 2s infinite ease-in-out"
                : "none",
            }}
          />

          {/* Certificate/Quiz button */}
          <foreignObject
            x="-36"
            y="-82"
            width="72"
            height="72"
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                cursor: isLocked ? "not-allowed" : "pointer",
                position: "relative",
                filter: isLocked ? "grayscale(0.6)" : "none",
                opacity: isLocked ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
              onClick={handleCertificateClick}
              title={getTooltipText()}
            >
              {isFullyCompleted ? (
                // Show completed certificate
                <CertificateCard
                  userName={user?.name || "Learner"}
                  moduleName={moduleName}
                />
              ) : (
                // Show Lottie animation with quiz or locked state
                <>
                  <CertificateLottie size={72} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: isFullyCompleted
                        ? "#10b981"
                        : isQuizAvailable
                          ? "#4F46E5"
                          : "#64748b",
                      color: "white",
                      fontSize: 7,
                      fontWeight: 800,
                      fontFamily: "Nunito,sans-serif",
                      whiteSpace: "nowrap",
                      padding: "2px 6px",
                      borderRadius: 6,
                      boxShadow: !isLocked
                        ? "0 2px 6px rgba(0,0,0,0.2)"
                        : "none",
                      pointerEvents: "none",
                    }}
                  >
                    {isLocked && <span>🔒 {remainingMilestones} left</span>}
                    {isQuizAvailable && !isLocked && <span>🎯 Take Quiz</span>}
                    {isFullyCompleted && !isLocked && (
                      <span>🏆 Certificate</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </foreignObject>
        </g>
      )}

      <style>{`
        @keyframes glowPulse {
          0%   { transform: scale(1);   opacity: 0.15; }
          50%  { transform: scale(1.3); opacity: 0.32; }
          100% { transform: scale(1);   opacity: 0.15; }
        }
      `}</style>
    </svg>
  );
};

export default RoadPathSVG;
