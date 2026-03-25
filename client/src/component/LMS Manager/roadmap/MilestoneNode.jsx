import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * MilestoneNode — renders as a unified map-pin / location-marker shape.
 * Circle top + teardrop point bottom are ONE single SVG path with a white
 * border stroke so they read as a single cohesive badge (like the reference).
 *
 * ViewBox: 0 0 80 100
 *   Circle centre: (40, 38), radius ~32
 *   Pin tip: (40, 96)
 */

// const PIN_W = 68;
// const PIN_H = Math.round(PIN_W * (100 / 80)); // ≈ 85px — preserves aspect
const PIN_W =
  typeof window !== "undefined"
    ? Math.round(Math.min(68, Math.max(44, window.innerWidth * 0.12)))
    : 68;
const PIN_H = Math.round(PIN_W * (102 / 80));

// Single smooth path: full circle + teardrop taper to bottom point
const MAP_PIN_PATH =
  "M 40 6 " +
  "C 20 6, 6 20, 6 40 " +
  "C 6 58, 18 70, 30 80 " +
  "L 40 88 " +
  "L 50 80 " +
  "C 62 70, 74 58, 74 40 " +
  "C 74 20, 60 6, 40 6 Z";

// Slightly scaled-up path used as the white border layer
const PIN_BORDER_PATH =
  "M 40 2 " +
  "C 18 2, 2 18, 2 40 " +
  "C 2 60, 15 73, 28 83 " +
  "L 40 92 " +
  "L 52 83 " +
  "C 65 73, 78 60, 78 40 " +
  "C 78 18, 62 2, 40 2 Z";

const MilestoneNode = ({ milestone, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.12 + 0.3, type: "spring", stiffness: 200 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        zIndex: 21,
        userSelect: "none",
        cursor: "pointer",
        transition: "transform 0.25s ease, filter 0.25s ease",
        transform: hovered ? "scale(1.18)" : "scale(1)",
        filter: hovered
          ? `drop-shadow(0 6px 18px ${milestone.color}aa)`
          : `drop-shadow(0 3px 10px ${milestone.color}77)`,
        width: PIN_W,
        height: PIN_H,
      }}
    >
      <svg
        viewBox="0 0 80 102"
        width={PIN_W}
        height={PIN_H}
        style={{ display: "block", overflow: "visible" }}
      >
        {/* <defs>
          <radialGradient id={`shine-${index}`} cx="38%" cy="28%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs> */}

        {/* ── White border (drawn slightly larger beneath) ── */}
        <path d={PIN_BORDER_PATH} fill="white" />

        {/* ── Colour fill ── */}
        <path d={MAP_PIN_PATH} fill={milestone.color} />

        {/* ── Radial shine for depth ── */}
        <path d={MAP_PIN_PATH} fill={`url(#shine-${index})`} />

        {/* ── Number label — vertically centred in the circle portion ── */}
        <text
          x="40"
          y="41"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontWeight="900"
          fontSize="26"
          fontFamily="'Nunito', sans-serif"
          style={{ pointerEvents: "none" }}
        >
          {milestone.id}
        </text>
      </svg>
    </motion.div>
  );
};

export default MilestoneNode;
