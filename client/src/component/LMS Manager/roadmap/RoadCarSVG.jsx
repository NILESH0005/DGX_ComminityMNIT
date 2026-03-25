// import React, { useEffect, useRef, useState } from "react";
// import { buildRoadPoints, SVG_W, SVG_H } from "./RoadPathSVG";

// // ─── Bezier path sampler ──────────────────────────────────────────────────────

// function sampleFullPath(pts, samplesPerSeg = 80) {
//   const samples = [];
//   for (let seg = 0; seg < pts.length - 1; seg++) {
//     const p0 = pts[seg];
//     const p3 = pts[seg + 1];
//     const midY = (p0.y + p3.y) / 2;
//     const cp1 = { x: p0.x, y: midY };
//     const cp2 = { x: p3.x, y: midY };

//     for (let s = 0; s <= samplesPerSeg; s++) {
//       if (seg > 0 && s === 0) continue;
//       const t = s / samplesPerSeg;
//       const u = 1 - t;
//       const x =
//         u * u * u * p0.x +
//         3 * u * u * t * cp1.x +
//         3 * u * t * t * cp2.x +
//         t * t * t * p3.x;
//       const y =
//         u * u * u * p0.y +
//         3 * u * u * t * cp1.y +
//         3 * u * t * t * cp2.y +
//         t * t * t * p3.y;

//       const dx =
//         3 * u * u * (cp1.x - p0.x) +
//         6 * u * t * (cp2.x - cp1.x) +
//         3 * t * t * (p3.x - cp2.x);
//       const dy =
//         3 * u * u * (cp1.y - p0.y) +
//         6 * u * t * (cp2.y - cp1.y) +
//         3 * t * t * (p3.y - cp2.y);
//       const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

//       samples.push({ x, y, angle, seg, t });
//     }
//   }
//   return samples;
// }

// function findStopSampleIndex(
//   samples,
//   pts,
//   milestoneIdx,
//   offsetFraction = 0.07,
// ) {
//   if (milestoneIdx <= 0) return 0;

//   const segStart = milestoneIdx - 1;

//   const p0 = pts[segStart];
//   const p3 = pts[milestoneIdx];
//   const midY = (p0.y + p3.y) / 2;
//   const cp1 = { x: p0.x, y: midY };
//   const cp2 = { x: p3.x, y: midY };

//   const t = 1 - offsetFraction;
//   const u = 1 - t;
//   const tx =
//     u * u * u * p0.x +
//     3 * u * u * t * cp1.x +
//     3 * u * t * t * cp2.x +
//     t * t * t * p3.x;
//   const ty =
//     u * u * u * p0.y +
//     3 * u * u * t * cp1.y +
//     3 * u * t * t * cp2.y +
//     t * t * t * p3.y;

//   let best = 0;
//   let bestD = Infinity;
//   samples.forEach((s, i) => {
//     if (s.seg !== segStart) return;
//     const d = Math.hypot(s.x - tx, s.y - ty);
//     if (d < bestD) {
//       bestD = d;
//       best = i;
//     }
//   });
//   return best;
// }

// // ─── Colour tokens ────────────────────────────────────────────────────────────

// const CAR_BODY = "#F25C54";
// const CAR_BODY_LT = "#F7837C";
// const CAR_BODY_DK = "#C8342C";
// const CAR_HOOD = "#E84840";
// const CAR_BUMPER = "#D93028";
// const CAR_INTERIOR = "#1C2B3A";
// const CAR_SEAT = "#2A3F55";
// const CAR_SEAT_LT = "#34536E";
// const CAR_WHEEL = "#1A1A2E";
// const CAR_RIM = "#F0C040";
// const CAR_GLASS = "#A8D8EA";
// const CAR_GLASS_GL = "rgba(255,255,255,0.55)";

// const AV_SKIN = "#FDBCB4";
// const AV_SKIN_DK = "#E8967A";
// const AV_HAIR = "#2C1A0E";
// const AV_SHIRT = "#3B82F6";
// const AV_SHIRT_DK = "#1D4ED8";

// // ─── CarSVG — top-down open-roof vector car ───────────────────────────────────

// const CarSVG = ({ scale: s = 1 }) => (
//   <g>
//     {/* Drop shadow */}
//     <ellipse
//       cx={1 * s}
//       cy={10 * s}
//       rx={34 * s}
//       ry={20 * s}
//       fill="rgba(0,0,0,0.22)"
//     />

//     {/* ── Rear wheels (behind body) ── */}
//     {[
//       [-26, 68],
//       [26, 68],
//     ].map(([wx, wy], i) => (
//       <g key={`rw${i}`} transform={`translate(${wx * s}, ${wy * s})`}>
//         <rect
//           x={-7 * s}
//           y={-12 * s}
//           width={14 * s}
//           height={24 * s}
//           rx={5 * s}
//           fill={CAR_WHEEL}
//         />
//         <rect
//           x={-4.5 * s}
//           y={-8 * s}
//           width={9 * s}
//           height={16 * s}
//           rx={3 * s}
//           fill="#2E2E44"
//         />
//         <ellipse cx={0} cy={0} rx={3.5 * s} ry={3.5 * s} fill={CAR_RIM} />
//         <ellipse
//           cx={0}
//           cy={0}
//           rx={1.5 * s}
//           ry={1.5 * s}
//           fill="white"
//           opacity="0.7"
//         />
//       </g>
//     ))}

//     {/* ── Main body ── */}
//     <path
//       d={`
//         M ${-14 * s},${-95 * s}
//         C ${-20 * s},${-95 * s} ${-28 * s},${-90 * s} ${-30 * s},${-80 * s}
//         L ${-32 * s},${-50 * s}
//         C ${-34 * s},${-44 * s} ${-34 * s},${44 * s} ${-32 * s},${50 * s}
//         L ${-30 * s},${80 * s}
//         C ${-28 * s},${90 * s} ${-20 * s},${95 * s} ${-14 * s},${95 * s}
//         L ${14 * s},${95 * s}
//         C ${20 * s},${95 * s} ${28 * s},${90 * s} ${30 * s},${80 * s}
//         L ${32 * s},${50 * s}
//         C ${34 * s},${44 * s} ${34 * s},${-44 * s} ${32 * s},${-50 * s}
//         L ${30 * s},${-80 * s}
//         C ${28 * s},${-90 * s} ${20 * s},${-95 * s} ${14 * s},${-95 * s} Z
//       `}
//       fill={CAR_BODY}
//     />
//     {/* Left sheen */}
//     <path
//       d={`M ${-32 * s},${-48 * s} C ${-36 * s},${-20 * s} ${-36 * s},${20 * s} ${-32 * s},${48 * s} L ${-24 * s},${56 * s} L ${-24 * s},${-56 * s} Z`}
//       fill={CAR_BODY_LT}
//       opacity="0.4"
//     />
//     {/* Right shadow */}
//     <path
//       d={`M ${32 * s},${-48 * s} C ${36 * s},${-20 * s} ${36 * s},${20 * s} ${32 * s},${48 * s} L ${24 * s},${56 * s} L ${24 * s},${-56 * s} Z`}
//       fill={CAR_BODY_DK}
//       opacity="0.35"
//     />
//     {/* Body trim creases */}
//     <path
//       d={`M ${-28 * s},${-60 * s} C ${-30 * s},${-20 * s} ${-30 * s},${20 * s} ${-28 * s},${60 * s}`}
//       stroke="rgba(255,255,255,0.18)"
//       strokeWidth={1.5 * s}
//       fill="none"
//       strokeLinecap="round"
//     />
//     <path
//       d={`M ${28 * s},${-60 * s} C ${30 * s},${-20 * s} ${30 * s},${20 * s} ${28 * s},${60 * s}`}
//       stroke="rgba(0,0,0,0.15)"
//       strokeWidth={1.5 * s}
//       fill="none"
//       strokeLinecap="round"
//     />

//     {/* Hood */}
//     <path
//       d={`
//         M ${-12 * s},${-95 * s}
//         C ${-16 * s},${-92 * s} ${-20 * s},${-84 * s} ${-20 * s},${-74 * s}
//         L ${-20 * s},${-52 * s}
//         C ${-20 * s},${-47 * s} ${-16 * s},${-44 * s} ${-10 * s},${-44 * s}
//         L ${10 * s},${-44 * s}
//         C ${16 * s},${-44 * s} ${20 * s},${-47 * s} ${20 * s},${-52 * s}
//         L ${20 * s},${-74 * s}
//         C ${20 * s},${-84 * s} ${16 * s},${-92 * s} ${12 * s},${-95 * s} Z
//       `}
//       fill={CAR_HOOD}
//     />
//     <path
//       d={`M ${-5 * s},${-92 * s} C ${-6 * s},${-80 * s} ${-6 * s},${-58 * s} ${-5 * s},${-46 * s}`}
//       stroke="rgba(255,255,255,0.3)"
//       strokeWidth={2.5 * s}
//       fill="none"
//       strokeLinecap="round"
//     />

//     {/* Front bumper */}
//     <path
//       d={`M ${-14 * s},${-95 * s} C ${-8 * s},${-102 * s} ${8 * s},${-102 * s} ${14 * s},${-95 * s} L ${12 * s},${-88 * s} L ${-12 * s},${-88 * s} Z`}
//       fill={CAR_BUMPER}
//     />
//     {/* Headlights */}
//     {[
//       [-16, -90],
//       [16, -90],
//     ].map(([lx, ly], i) => (
//       <g key={`hl${i}`}>
//         <ellipse
//           cx={lx * s}
//           cy={ly * s}
//           rx={5 * s}
//           ry={3 * s}
//           fill="#FFF9C4"
//           opacity="0.92"
//         />
//         <ellipse
//           cx={lx * s}
//           cy={ly * s}
//           rx={3 * s}
//           ry={1.8 * s}
//           fill="white"
//           opacity="0.7"
//         />
//       </g>
//     ))}

//     {/* Rear bumper */}
//     <path
//       d={`M ${-14 * s},${95 * s} C ${-8 * s},${102 * s} ${8 * s},${102 * s} ${14 * s},${95 * s} L ${12 * s},${88 * s} L ${-12 * s},${88 * s} Z`}
//       fill={CAR_BUMPER}
//     />
//     {/* Tail lights */}
//     {[
//       [-22, 85],
//       [12, 85],
//     ].map(([lx, ly], i) => (
//       <g key={`tl${i}`}>
//         <rect
//           x={lx * s}
//           y={ly * s}
//           width={10 * s}
//           height={6 * s}
//           rx={2 * s}
//           fill="#FF4444"
//           opacity="0.9"
//         />
//         <rect
//           x={(lx + 1) * s}
//           y={(ly + 1) * s}
//           width={6 * s}
//           height={3 * s}
//           rx={1 * s}
//           fill="#FF8888"
//           opacity="0.7"
//         />
//       </g>
//     ))}

//     {/* ── Front wheels (on top of lower body sides) ── */}
//     {[
//       [-26, -62],
//       [26, -62],
//     ].map(([wx, wy], i) => (
//       <g key={`fw${i}`} transform={`translate(${wx * s}, ${wy * s})`}>
//         <rect
//           x={-7 * s}
//           y={-12 * s}
//           width={14 * s}
//           height={24 * s}
//           rx={5 * s}
//           fill={CAR_WHEEL}
//         />
//         <rect
//           x={-4.5 * s}
//           y={-8 * s}
//           width={9 * s}
//           height={16 * s}
//           rx={3 * s}
//           fill="#2E2E44"
//         />
//         <ellipse cx={0} cy={0} rx={3.5 * s} ry={3.5 * s} fill={CAR_RIM} />
//         <ellipse
//           cx={0}
//           cy={0}
//           rx={1.5 * s}
//           ry={1.5 * s}
//           fill="white"
//           opacity="0.7"
//         />
//       </g>
//     ))}

//     {/* ── Open cabin interior ── */}
//     <rect
//       x={-18 * s}
//       y={-42 * s}
//       width={36 * s}
//       height={84 * s}
//       rx={4 * s}
//       fill={CAR_INTERIOR}
//     />

//     {/* Driver seat */}
//     <rect
//       x={-15 * s}
//       y={-32 * s}
//       width={14 * s}
//       height={20 * s}
//       rx={4 * s}
//       fill={CAR_SEAT}
//     />
//     <rect
//       x={-14 * s}
//       y={-31 * s}
//       width={6 * s}
//       height={7 * s}
//       rx={2 * s}
//       fill={CAR_SEAT_LT}
//       opacity="0.7"
//     />
//     <rect
//       x={-13.5 * s}
//       y={-36 * s}
//       width={11 * s}
//       height={6 * s}
//       rx={3 * s}
//       fill={CAR_SEAT_LT}
//     />

//     {/* Passenger seat */}
//     <rect
//       x={1 * s}
//       y={-32 * s}
//       width={14 * s}
//       height={20 * s}
//       rx={4 * s}
//       fill={CAR_SEAT}
//     />
//     <rect
//       x={2 * s}
//       y={-31 * s}
//       width={6 * s}
//       height={7 * s}
//       rx={2 * s}
//       fill={CAR_SEAT_LT}
//       opacity="0.7"
//     />
//     <rect
//       x={2.5 * s}
//       y={-36 * s}
//       width={11 * s}
//       height={6 * s}
//       rx={3 * s}
//       fill={CAR_SEAT_LT}
//     />

//     {/* Rear bench */}
//     <rect
//       x={-15 * s}
//       y={22 * s}
//       width={30 * s}
//       height={14 * s}
//       rx={4 * s}
//       fill={CAR_SEAT}
//     />
//     <rect
//       x={-14 * s}
//       y={23 * s}
//       width={10 * s}
//       height={5 * s}
//       rx={2 * s}
//       fill={CAR_SEAT_LT}
//       opacity="0.6"
//     />
//     <rect
//       x={2 * s}
//       y={23 * s}
//       width={10 * s}
//       height={5 * s}
//       rx={2 * s}
//       fill={CAR_SEAT_LT}
//       opacity="0.6"
//     />

//     {/* Centre console */}
//     <rect
//       x={-2 * s}
//       y={-30 * s}
//       width={4 * s}
//       height={58 * s}
//       rx={2 * s}
//       fill="#0F1B28"
//     />
//     {/* Gear knob */}
//     <ellipse cx={0} cy={0} rx={3 * s} ry={3 * s} fill={CAR_RIM} opacity="0.9" />
//     <ellipse
//       cx={0}
//       cy={0}
//       rx={1.5 * s}
//       ry={1.5 * s}
//       fill="white"
//       opacity="0.6"
//     />

//     {/* Dashboard */}
//     <rect
//       x={-18 * s}
//       y={-44 * s}
//       width={36 * s}
//       height={5 * s}
//       rx={2 * s}
//       fill="#0F1B28"
//     />
//     <circle
//       cx={-10 * s}
//       cy={-41.5 * s}
//       r={1.2 * s}
//       fill={CAR_RIM}
//       opacity="0.9"
//     />
//     <circle cx={0} cy={-41.5 * s} r={1.2 * s} fill="#4ADE80" opacity="0.9" />
//     <circle
//       cx={10 * s}
//       cy={-41.5 * s}
//       r={1.2 * s}
//       fill="#60A5FA"
//       opacity="0.9"
//     />

//     {/* Steering wheel column */}
//     <line
//       x1={-8 * s}
//       y1={-26 * s}
//       x2={-8 * s}
//       y2={-22 * s}
//       stroke="#0F1B28"
//       strokeWidth={3 * s}
//       strokeLinecap="round"
//     />
//     {/* Steering wheel ring */}
//     <circle
//       cx={-8 * s}
//       cy={-18 * s}
//       r={7 * s}
//       fill="none"
//       stroke="#2C3E50"
//       strokeWidth={3 * s}
//     />
//     <line
//       x1={-8 * s}
//       y1={-25 * s}
//       x2={-8 * s}
//       y2={-11 * s}
//       stroke="#2C3E50"
//       strokeWidth={2 * s}
//       strokeLinecap="round"
//     />
//     <line
//       x1={-15 * s}
//       y1={-18 * s}
//       x2={-1 * s}
//       y2={-18 * s}
//       stroke="#2C3E50"
//       strokeWidth={2 * s}
//       strokeLinecap="round"
//     />
//     <circle cx={-8 * s} cy={-18 * s} r={2.5 * s} fill={CAR_RIM} />

//     {/* ── Driver avatar (top-down) ── */}
//     {/* Torso */}
//     <ellipse cx={-8 * s} cy={-10 * s} rx={7 * s} ry={9 * s} fill={AV_SHIRT} />
//     <ellipse
//       cx={-10 * s}
//       cy={-12 * s}
//       rx={3 * s}
//       ry={4 * s}
//       fill={AV_SHIRT_DK}
//       opacity="0.5"
//     />
//     {/* Collar */}
//     <ellipse cx={-8 * s} cy={-18 * s} rx={3.5 * s} ry={2 * s} fill={AV_SKIN} />
//     {/* Head */}
//     <circle cx={-8 * s} cy={-21 * s} r={6 * s} fill={AV_SKIN} />
//     <ellipse
//       cx={-8 * s}
//       cy={-21 * s}
//       rx={4 * s}
//       ry={5 * s}
//       fill={AV_SKIN_DK}
//       opacity="0.15"
//     />
//     {/* Hair */}
//     <path
//       d={`M ${-14 * s},${-21 * s} A ${6 * s},${6 * s} 0 0 1 ${-2 * s},${-21 * s} L ${-2.5 * s},${-17 * s} C ${-5 * s},${-15.5 * s} ${-11 * s},${-15.5 * s} ${-13.5 * s},${-17 * s} Z`}
//       fill={AV_HAIR}
//     />
//     <ellipse
//       cx={-9 * s}
//       cy={-24 * s}
//       rx={2.5 * s}
//       ry={1.5 * s}
//       fill="rgba(255,255,255,0.15)"
//     />
//     {/* Arms reaching to wheel */}
//     <path
//       d={`M ${-14 * s},${-14 * s} C ${-17 * s},${-17 * s} ${-17 * s},${-21 * s} ${-15 * s},${-23 * s}`}
//       stroke={AV_SKIN}
//       strokeWidth={3.5 * s}
//       fill="none"
//       strokeLinecap="round"
//     />
//     <path
//       d={`M ${-2 * s},${-14 * s} C ${1 * s},${-17 * s} ${1 * s},${-21 * s} ${-1 * s},${-23 * s}`}
//       stroke={AV_SKIN}
//       strokeWidth={3.5 * s}
//       fill="none"
//       strokeLinecap="round"
//     />
//     {/* Hands */}
//     <circle cx={-15 * s} cy={-23 * s} r={2.2 * s} fill={AV_SKIN} />
//     <circle cx={-1 * s} cy={-23 * s} r={2.2 * s} fill={AV_SKIN} />

//     {/* ── Windshield ── */}
//     <path
//       d={`M ${-20 * s},${-44 * s} L ${-18 * s},${-36 * s} L ${18 * s},${-36 * s} L ${20 * s},${-44 * s} Z`}
//       fill={CAR_GLASS}
//       opacity="0.55"
//     />
//     <path
//       d={`M ${-14 * s},${-43 * s} L ${-12 * s},${-37 * s}`}
//       stroke={CAR_GLASS_GL}
//       strokeWidth={2.5 * s}
//       fill="none"
//       strokeLinecap="round"
//     />
//     <path
//       d={`M ${-8 * s},${-43.5 * s} L ${-7 * s},${-37 * s}`}
//       stroke={CAR_GLASS_GL}
//       strokeWidth={1.5 * s}
//       fill="none"
//       strokeLinecap="round"
//       opacity="0.7"
//     />
//     {/* A-pillars */}
//     <line
//       x1={-20 * s}
//       y1={-44 * s}
//       x2={-18 * s}
//       y2={-36 * s}
//       stroke={CAR_BODY_DK}
//       strokeWidth={1.8 * s}
//       strokeLinecap="round"
//     />
//     <line
//       x1={20 * s}
//       y1={-44 * s}
//       x2={18 * s}
//       y2={-36 * s}
//       stroke={CAR_BODY_DK}
//       strokeWidth={1.8 * s}
//       strokeLinecap="round"
//     />
//   </g>
// );

// // ─── Animated car controller ──────────────────────────────────────────────────

// const RoadCarSVG = ({ milestones, currentStepIndex, onCarMove }) => {
//   const pts = buildRoadPoints(milestones.length);
//   const samples = useRef(sampleFullPath(pts, 100));

//   const [carState, setCarState] = useState({
//     x: pts[0].x,
//     y: pts[0].y,
//     angle: 0,
//     opacity: 1,
//   });
//   const animRef = useRef(null);
//   const currentSampleRef = useRef(0);
//   const targetSampleRef = useRef(0);

//   useEffect(() => {
//     const samps = samples.current;
//     if (!samps.length) return;

//     const allCompleted =
//       milestones.length > 0 && milestones.every((m) => m.isCompleted);

//     let stopIdx;
//     if (allCompleted) {
//       stopIdx = samps.length - 1;
//     } else {
//       const segmentLength = (SVG_H - 160) / Math.max(1, milestones.length - 1);
//       const dynamicOffset = Math.min(0.35, 28 / segmentLength);
//       stopIdx = findStopSampleIndex(
//         samps,
//         pts,
//         Math.max(0, currentStepIndex),
//         dynamicOffset,
//       );
//     }
//     targetSampleRef.current = stopIdx;
//     startAnimation(allCompleted);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentStepIndex, milestones.length]);

//   function startAnimation(overshoot = false) {
//     if (animRef.current) cancelAnimationFrame(animRef.current);

//     const samps = samples.current;
//     const totalSamps = samps.length;
//     const target = targetSampleRef.current;
//     const start = currentSampleRef.current;

//     const SPEED = 0.07;
//     const dist = target - start;
//     if (dist <= 0) return;

//     const duration = dist / SPEED;
//     let startTime = null;
//     const OVERSHOOT_EXTRA = overshoot ? 50 : 0;

//     function tick(now) {
//       if (!startTime) startTime = now;
//       const elapsed = now - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       const eased =
//         progress < 0.5
//           ? 4 * progress * progress * progress
//           : 1 - Math.pow(-2 * progress + 2, 3) / 2;

//       const rawIdx = start + eased * (dist + OVERSHOOT_EXTRA);
//       const idx = Math.min(Math.floor(rawIdx), totalSamps - 1);
//       currentSampleRef.current = rawIdx;

//       const s = samps[idx];
//       const bounce = Math.sin(rawIdx * 0.35) * 0.3;

//       let opacity = 1;
//       if (overshoot && rawIdx > target) {
//         const fadeProgress = (rawIdx - target) / OVERSHOOT_EXTRA;
//         opacity = Math.max(0, 1 - fadeProgress);
//       }

//       setCarState({ x: s.x, y: s.y + bounce, angle: s.angle, opacity });
//       if (onCarMove) onCarMove(s.y + bounce);

//       if (progress < 1) {
//         animRef.current = requestAnimationFrame(tick);
//       } else {
//         currentSampleRef.current = target;
//       }
//     }

//     animRef.current = requestAnimationFrame(tick);
//   }

//   useEffect(
//     () => () => animRef.current && cancelAnimationFrame(animRef.current),
//     [],
//   );

//   // Car body spans ±34 wide (incl. wheels). Target: ~20 SVG units wide on road.
//   const carScale = (SVG_W * 0.1) / 68;

//   return (
//     <g
//       transform={`translate(${carState.x}, ${carState.y}) rotate(${carState.angle})`}
//       opacity={carState.opacity}
//       style={{ transition: "opacity 0.1s linear" }}
//     >
//       <CarSVG scale={carScale} />
//     </g>
//   );
// };

// export default RoadCarSVG;

{
  /* =================================================================================== */
}

import React, { useEffect, useRef, useState } from "react";
import { buildRoadPoints, SVG_W, SVG_H } from "./RoadPathSVG";

// ─── Bezier path sampler ──────────────────────────────────────────────────────

function sampleFullPath(pts, samplesPerSeg = 80) {
  const samples = [];
  for (let seg = 0; seg < pts.length - 1; seg++) {
    const p0 = pts[seg];
    const p3 = pts[seg + 1];
    const midY = (p0.y + p3.y) / 2;
    const cp1 = { x: p0.x, y: midY };
    const cp2 = { x: p3.x, y: midY };

    for (let s = 0; s <= samplesPerSeg; s++) {
      if (seg > 0 && s === 0) continue;
      const t = s / samplesPerSeg;
      const u = 1 - t;
      const x =
        u * u * u * p0.x +
        3 * u * u * t * cp1.x +
        3 * u * t * t * cp2.x +
        t * t * t * p3.x;
      const y =
        u * u * u * p0.y +
        3 * u * u * t * cp1.y +
        3 * u * t * t * cp2.y +
        t * t * t * p3.y;

      const dx =
        3 * u * u * (cp1.x - p0.x) +
        6 * u * t * (cp2.x - cp1.x) +
        3 * t * t * (p3.x - cp2.x);
      const dy =
        3 * u * u * (cp1.y - p0.y) +
        6 * u * t * (cp2.y - cp1.y) +
        3 * t * t * (p3.y - cp2.y);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      samples.push({ x, y, angle, seg, t });
    }
  }
  return samples;
}

function findStopSampleIndex(
  samples,
  pts,
  milestoneIdx,
  offsetFraction = 0.07,
) {
  if (milestoneIdx <= 0) return 0;

  const segStart = milestoneIdx - 1;

  const p0 = pts[segStart];
  const p3 = pts[milestoneIdx];
  const midY = (p0.y + p3.y) / 2;
  const cp1 = { x: p0.x, y: midY };
  const cp2 = { x: p3.x, y: midY };

  const t = 1 - offsetFraction;
  const u = 1 - t;
  const tx =
    u * u * u * p0.x +
    3 * u * u * t * cp1.x +
    3 * u * t * t * cp2.x +
    t * t * t * p3.x;
  const ty =
    u * u * u * p0.y +
    3 * u * u * t * cp1.y +
    3 * u * t * t * cp2.y +
    t * t * t * p3.y;

  let best = 0;
  let bestD = Infinity;
  samples.forEach((s, i) => {
    if (s.seg !== segStart) return;
    const d = Math.hypot(s.x - tx, s.y - ty);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

// ─── Colour tokens ────────────────────────────────────────────────────────────

const CAR_BODY = "#00B4FF";
const CAR_BODY_LT = "#33C6FF";
const CAR_BODY_DK = "#0077BB";
const CAR_HOOD = "#009FEE";
const CAR_BUMPER = "#005F99";
const CAR_INTERIOR = "#0D1B2A";
const CAR_SEAT = "#0A2540";
const CAR_SEAT_LT = "#0E3560";
const CAR_WHEEL = "#1A1A2E";
const CAR_RIM = "#FFE066";
const CAR_GLASS = "#B8E8FF";
const CAR_GLASS_GL = "rgba(255,255,255,0.60)";

const AV_SKIN = "#FFD580";
const AV_SKIN_DK = "#FFA940";
const AV_HAIR = "#FFFFFF";
const AV_SHIRT = "#FF6B35";
const AV_SHIRT_DK = "#E04E18";

// ─── CarSVG — top-down open-roof vector car ───────────────────────────────────

const CarSVG = ({ scale: s = 1 }) => (
  <g>
    {/* Drop shadow */}
    <ellipse
      cx={1 * s}
      cy={10 * s}
      rx={34 * s}
      ry={20 * s}
      fill="rgba(0,0,0,0.22)"
    />

    {/* ── Rear wheels (behind body) ── */}
    {[
      [-26, 68],
      [26, 68],
    ].map(([wx, wy], i) => (
      <g key={`rw${i}`} transform={`translate(${wx * s}, ${wy * s})`}>
        <rect
          x={-7 * s}
          y={-12 * s}
          width={14 * s}
          height={24 * s}
          rx={5 * s}
          fill={CAR_WHEEL}
        />
        <rect
          x={-4.5 * s}
          y={-8 * s}
          width={9 * s}
          height={16 * s}
          rx={3 * s}
          fill="#2E2E44"
        />
        <ellipse cx={0} cy={0} rx={3.5 * s} ry={3.5 * s} fill={CAR_RIM} />
        <ellipse
          cx={0}
          cy={0}
          rx={1.5 * s}
          ry={1.5 * s}
          fill="white"
          opacity="0.7"
        />
      </g>
    ))}

    {/* ── Main body ── */}
    <path
      d={`
        M ${-14 * s},${-95 * s}
        C ${-20 * s},${-95 * s} ${-28 * s},${-90 * s} ${-30 * s},${-80 * s}
        L ${-32 * s},${-50 * s}
        C ${-34 * s},${-44 * s} ${-34 * s},${44 * s} ${-32 * s},${50 * s}
        L ${-30 * s},${80 * s}
        C ${-28 * s},${90 * s} ${-20 * s},${95 * s} ${-14 * s},${95 * s}
        L ${14 * s},${95 * s}
        C ${20 * s},${95 * s} ${28 * s},${90 * s} ${30 * s},${80 * s}
        L ${32 * s},${50 * s}
        C ${34 * s},${44 * s} ${34 * s},${-44 * s} ${32 * s},${-50 * s}
        L ${30 * s},${-80 * s}
        C ${28 * s},${-90 * s} ${20 * s},${-95 * s} ${14 * s},${-95 * s} Z
      `}
      fill={CAR_BODY}
    />
    {/* Left sheen */}
    <path
      d={`M ${-32 * s},${-48 * s} C ${-36 * s},${-20 * s} ${-36 * s},${20 * s} ${-32 * s},${48 * s} L ${-24 * s},${56 * s} L ${-24 * s},${-56 * s} Z`}
      fill={CAR_BODY_LT}
      opacity="0.4"
    />
    {/* Right shadow */}
    <path
      d={`M ${32 * s},${-48 * s} C ${36 * s},${-20 * s} ${36 * s},${20 * s} ${32 * s},${48 * s} L ${24 * s},${56 * s} L ${24 * s},${-56 * s} Z`}
      fill={CAR_BODY_DK}
      opacity="0.35"
    />
    {/* Body trim creases */}
    <path
      d={`M ${-28 * s},${-60 * s} C ${-30 * s},${-20 * s} ${-30 * s},${20 * s} ${-28 * s},${60 * s}`}
      stroke="rgba(255,255,255,0.18)"
      strokeWidth={1.5 * s}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M ${28 * s},${-60 * s} C ${30 * s},${-20 * s} ${30 * s},${20 * s} ${28 * s},${60 * s}`}
      stroke="rgba(0,0,0,0.15)"
      strokeWidth={1.5 * s}
      fill="none"
      strokeLinecap="round"
    />

    {/* Hood */}
    <path
      d={`
        M ${-12 * s},${-95 * s}
        C ${-16 * s},${-92 * s} ${-20 * s},${-84 * s} ${-20 * s},${-74 * s}
        L ${-20 * s},${-52 * s}
        C ${-20 * s},${-47 * s} ${-16 * s},${-44 * s} ${-10 * s},${-44 * s}
        L ${10 * s},${-44 * s}
        C ${16 * s},${-44 * s} ${20 * s},${-47 * s} ${20 * s},${-52 * s}
        L ${20 * s},${-74 * s}
        C ${20 * s},${-84 * s} ${16 * s},${-92 * s} ${12 * s},${-95 * s} Z
      `}
      fill={CAR_HOOD}
    />
    <path
      d={`M ${-5 * s},${-92 * s} C ${-6 * s},${-80 * s} ${-6 * s},${-58 * s} ${-5 * s},${-46 * s}`}
      stroke="rgba(255,255,255,0.3)"
      strokeWidth={2.5 * s}
      fill="none"
      strokeLinecap="round"
    />

    {/* Front bumper */}
    <path
      d={`M ${-14 * s},${-95 * s} C ${-8 * s},${-102 * s} ${8 * s},${-102 * s} ${14 * s},${-95 * s} L ${12 * s},${-88 * s} L ${-12 * s},${-88 * s} Z`}
      fill={CAR_BUMPER}
    />
    {/* Headlights */}
    {[
      [-16, -90],
      [16, -90],
    ].map(([lx, ly], i) => (
      <g key={`hl${i}`}>
        <ellipse
          cx={lx * s}
          cy={ly * s}
          rx={5 * s}
          ry={3 * s}
          fill="#FFF9C4"
          opacity="0.92"
        />
        <ellipse
          cx={lx * s}
          cy={ly * s}
          rx={3 * s}
          ry={1.8 * s}
          fill="white"
          opacity="0.7"
        />
      </g>
    ))}

    {/* Rear bumper */}
    <path
      d={`M ${-14 * s},${95 * s} C ${-8 * s},${102 * s} ${8 * s},${102 * s} ${14 * s},${95 * s} L ${12 * s},${88 * s} L ${-12 * s},${88 * s} Z`}
      fill={CAR_BUMPER}
    />
    {/* Tail lights */}
    {[
      [-22, 85],
      [12, 85],
    ].map(([lx, ly], i) => (
      <g key={`tl${i}`}>
        <rect
          x={lx * s}
          y={ly * s}
          width={10 * s}
          height={6 * s}
          rx={2 * s}
          fill="#FF4444"
          opacity="0.9"
        />
        <rect
          x={(lx + 1) * s}
          y={(ly + 1) * s}
          width={6 * s}
          height={3 * s}
          rx={1 * s}
          fill="#FF8888"
          opacity="0.7"
        />
      </g>
    ))}

    {/* ── Front wheels (on top of lower body sides) ── */}
    {[
      [-26, -62],
      [26, -62],
    ].map(([wx, wy], i) => (
      <g key={`fw${i}`} transform={`translate(${wx * s}, ${wy * s})`}>
        <rect
          x={-7 * s}
          y={-12 * s}
          width={14 * s}
          height={24 * s}
          rx={5 * s}
          fill={CAR_WHEEL}
        />
        <rect
          x={-4.5 * s}
          y={-8 * s}
          width={9 * s}
          height={16 * s}
          rx={3 * s}
          fill="#2E2E44"
        />
        <ellipse cx={0} cy={0} rx={3.5 * s} ry={3.5 * s} fill={CAR_RIM} />
        <ellipse
          cx={0}
          cy={0}
          rx={1.5 * s}
          ry={1.5 * s}
          fill="white"
          opacity="0.7"
        />
      </g>
    ))}

    {/* ── Open cabin interior ── */}
    <rect
      x={-18 * s}
      y={-42 * s}
      width={36 * s}
      height={84 * s}
      rx={4 * s}
      fill={CAR_INTERIOR}
    />

    {/* Driver seat */}
    <rect
      x={-15 * s}
      y={-32 * s}
      width={14 * s}
      height={20 * s}
      rx={4 * s}
      fill={CAR_SEAT}
    />
    <rect
      x={-14 * s}
      y={-31 * s}
      width={6 * s}
      height={7 * s}
      rx={2 * s}
      fill={CAR_SEAT_LT}
      opacity="0.7"
    />
    <rect
      x={-13.5 * s}
      y={-36 * s}
      width={11 * s}
      height={6 * s}
      rx={3 * s}
      fill={CAR_SEAT_LT}
    />

    {/* Passenger seat */}
    <rect
      x={1 * s}
      y={-32 * s}
      width={14 * s}
      height={20 * s}
      rx={4 * s}
      fill={CAR_SEAT}
    />
    <rect
      x={2 * s}
      y={-31 * s}
      width={6 * s}
      height={7 * s}
      rx={2 * s}
      fill={CAR_SEAT_LT}
      opacity="0.7"
    />
    <rect
      x={2.5 * s}
      y={-36 * s}
      width={11 * s}
      height={6 * s}
      rx={3 * s}
      fill={CAR_SEAT_LT}
    />

    {/* Rear bench */}
    <rect
      x={-15 * s}
      y={22 * s}
      width={30 * s}
      height={14 * s}
      rx={4 * s}
      fill={CAR_SEAT}
    />
    <rect
      x={-14 * s}
      y={23 * s}
      width={10 * s}
      height={5 * s}
      rx={2 * s}
      fill={CAR_SEAT_LT}
      opacity="0.6"
    />
    <rect
      x={2 * s}
      y={23 * s}
      width={10 * s}
      height={5 * s}
      rx={2 * s}
      fill={CAR_SEAT_LT}
      opacity="0.6"
    />

    {/* Centre console */}
    <rect
      x={-2 * s}
      y={-30 * s}
      width={4 * s}
      height={58 * s}
      rx={2 * s}
      fill="#0F1B28"
    />
    {/* Gear knob */}
    <ellipse cx={0} cy={0} rx={3 * s} ry={3 * s} fill={CAR_RIM} opacity="0.9" />
    <ellipse
      cx={0}
      cy={0}
      rx={1.5 * s}
      ry={1.5 * s}
      fill="white"
      opacity="0.6"
    />

    {/* Dashboard */}
    <rect
      x={-18 * s}
      y={-44 * s}
      width={36 * s}
      height={5 * s}
      rx={2 * s}
      fill="#0F1B28"
    />
    <circle
      cx={-10 * s}
      cy={-41.5 * s}
      r={1.2 * s}
      fill={CAR_RIM}
      opacity="0.9"
    />
    <circle cx={0} cy={-41.5 * s} r={1.2 * s} fill="#4ADE80" opacity="0.9" />
    <circle
      cx={10 * s}
      cy={-41.5 * s}
      r={1.2 * s}
      fill="#60A5FA"
      opacity="0.9"
    />

    {/* Steering wheel column */}
    <line
      x1={-8 * s}
      y1={-26 * s}
      x2={-8 * s}
      y2={-22 * s}
      stroke="#0F1B28"
      strokeWidth={3 * s}
      strokeLinecap="round"
    />
    {/* Steering wheel ring */}
    <circle
      cx={-8 * s}
      cy={-18 * s}
      r={7 * s}
      fill="none"
      stroke="#2C3E50"
      strokeWidth={3 * s}
    />
    <line
      x1={-8 * s}
      y1={-25 * s}
      x2={-8 * s}
      y2={-11 * s}
      stroke="#2C3E50"
      strokeWidth={2 * s}
      strokeLinecap="round"
    />
    <line
      x1={-15 * s}
      y1={-18 * s}
      x2={-1 * s}
      y2={-18 * s}
      stroke="#2C3E50"
      strokeWidth={2 * s}
      strokeLinecap="round"
    />
    <circle cx={-8 * s} cy={-18 * s} r={2.5 * s} fill={CAR_RIM} />

    {/* ── Driver avatar (top-down) ── */}
    {/* Torso */}
    <ellipse cx={-8 * s} cy={-10 * s} rx={7 * s} ry={9 * s} fill={AV_SHIRT} />
    <ellipse
      cx={-10 * s}
      cy={-12 * s}
      rx={3 * s}
      ry={4 * s}
      fill={AV_SHIRT_DK}
      opacity="0.5"
    />
    {/* Collar */}
    <ellipse cx={-8 * s} cy={-18 * s} rx={3.5 * s} ry={2 * s} fill={AV_SKIN} />
    {/* Head */}
    <circle cx={-8 * s} cy={-21 * s} r={6 * s} fill={AV_SKIN} />
    <ellipse
      cx={-8 * s}
      cy={-21 * s}
      rx={4 * s}
      ry={5 * s}
      fill={AV_SKIN_DK}
      opacity="0.15"
    />
    {/* Hair */}
    <path
      d={`M ${-14 * s},${-21 * s} A ${6 * s},${6 * s} 0 0 1 ${-2 * s},${-21 * s} L ${-2.5 * s},${-17 * s} C ${-5 * s},${-15.5 * s} ${-11 * s},${-15.5 * s} ${-13.5 * s},${-17 * s} Z`}
      fill={AV_HAIR}
    />
    <ellipse
      cx={-9 * s}
      cy={-24 * s}
      rx={2.5 * s}
      ry={1.5 * s}
      fill="rgba(255,255,255,0.15)"
    />
    {/* Arms reaching to wheel */}
    <path
      d={`M ${-14 * s},${-14 * s} C ${-17 * s},${-17 * s} ${-17 * s},${-21 * s} ${-15 * s},${-23 * s}`}
      stroke={AV_SKIN}
      strokeWidth={3.5 * s}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M ${-2 * s},${-14 * s} C ${1 * s},${-17 * s} ${1 * s},${-21 * s} ${-1 * s},${-23 * s}`}
      stroke={AV_SKIN}
      strokeWidth={3.5 * s}
      fill="none"
      strokeLinecap="round"
    />
    {/* Hands */}
    <circle cx={-15 * s} cy={-23 * s} r={2.2 * s} fill={AV_SKIN} />
    <circle cx={-1 * s} cy={-23 * s} r={2.2 * s} fill={AV_SKIN} />

    {/* ── Windshield ── */}
    <path
      d={`M ${-20 * s},${-44 * s} L ${-18 * s},${-36 * s} L ${18 * s},${-36 * s} L ${20 * s},${-44 * s} Z`}
      fill={CAR_GLASS}
      opacity="0.55"
    />
    <path
      d={`M ${-14 * s},${-43 * s} L ${-12 * s},${-37 * s}`}
      stroke={CAR_GLASS_GL}
      strokeWidth={2.5 * s}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M ${-8 * s},${-43.5 * s} L ${-7 * s},${-37 * s}`}
      stroke={CAR_GLASS_GL}
      strokeWidth={1.5 * s}
      fill="none"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* A-pillars */}
    <line
      x1={-20 * s}
      y1={-44 * s}
      x2={-18 * s}
      y2={-36 * s}
      stroke={CAR_BODY_DK}
      strokeWidth={1.8 * s}
      strokeLinecap="round"
    />
    <line
      x1={20 * s}
      y1={-44 * s}
      x2={18 * s}
      y2={-36 * s}
      stroke={CAR_BODY_DK}
      strokeWidth={1.8 * s}
      strokeLinecap="round"
    />
  </g>
);

// ─── Animated car controller ──────────────────────────────────────────────────

const RoadCarSVG = ({ milestones, currentStepIndex, onCarMove }) => {
  const pts = buildRoadPoints(milestones.length);
  const samples = useRef(sampleFullPath(pts, 100));

  const [carState, setCarState] = useState({
    x: pts[0].x,
    y: pts[0].y,
    angle: 0,
    opacity: 1,
  });
  const animRef = useRef(null);
  const currentSampleRef = useRef(0);
  const targetSampleRef = useRef(0);

  useEffect(() => {
    const samps = samples.current;
    if (!samps.length) return;

    const allCompleted =
      milestones.length > 0 && milestones.every((m) => m.isCompleted);

    let stopIdx;
    if (allCompleted) {
      stopIdx = samps.length - 1;
    } else {
      const segmentLength = (SVG_H - 160) / Math.max(1, milestones.length - 1);
      const dynamicOffset = Math.min(0.35, 28 / segmentLength);
      stopIdx = findStopSampleIndex(
        samps,
        pts,
        Math.max(0, currentStepIndex),
        dynamicOffset,
      );
    }
    targetSampleRef.current = stopIdx;
    startAnimation(allCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, milestones.length]);

  function startAnimation(overshoot = false) {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const samps = samples.current;
    const totalSamps = samps.length;
    const target = targetSampleRef.current;
    const start = currentSampleRef.current;

    const SPEED = 0.06;
    const dist = target - start;
    if (dist <= 0) return;

    const duration = dist / SPEED;
    let startTime = null;
    const OVERSHOOT_EXTRA = overshoot ? 50 : 0;

    function tick(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const rawIdx = start + eased * (dist + OVERSHOOT_EXTRA);
      const idx = Math.min(Math.floor(rawIdx), totalSamps - 1);
      currentSampleRef.current = rawIdx;

      const s = samps[idx];
      const bounce = Math.sin(rawIdx * 0.35) * 0.3;

      let opacity = 1;
      if (overshoot && rawIdx > target) {
        const fadeProgress = (rawIdx - target) / OVERSHOOT_EXTRA;
        opacity = Math.max(0, 1 - fadeProgress);
      }

      setCarState({ x: s.x, y: s.y + bounce, angle: s.angle, opacity });
      if (onCarMove) onCarMove(s.y + bounce);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        currentSampleRef.current = target;
      }
    }

    animRef.current = requestAnimationFrame(tick);
  }

  useEffect(
    () => () => animRef.current && cancelAnimationFrame(animRef.current),
    [],
  );

  // Car body spans ±34 wide (incl. wheels). Target: ~13 SVG units wide on road.
  const carScale = (SVG_W * 0.065) / 68;

  return (
    <g
      transform={`translate(${carState.x}, ${carState.y}) rotate(${carState.angle})`}
      opacity={carState.opacity}
      style={{ transition: "opacity 0.1s linear" }}
    >
      <CarSVG scale={carScale} />
    </g>
  );
};

export default RoadCarSVG;
