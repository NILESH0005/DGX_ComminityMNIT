import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiContext from "../context/ApiContext";
import { useContext } from "react";

const WelcomeBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const badge = location.state?.badge;

  const sceneRef = useRef(null);
  const raysGroupRef = useRef(null);
  const starsContainerRef = useRef(null);

  const [confettiPieces, setConfettiPieces] = useState([]);
  const { fetchData, userToken, user } = useContext(ApiContext);

  useEffect(() => {
    console.log("BADGE DATA:", badge);
    if (!badge?.badge) {
      navigate("/LearningPath");
    }
  }, [badge, navigate, user]);

  const imageSrc = badge?.badge ? `data:image/png;base64,${badge.badge}` : null;

  // Build SVG light rays — UNCHANGED
  useEffect(() => {
    if (!raysGroupRef.current) return;
    const raysGroup = raysGroupRef.current;
    const NUM_RAYS = 16;
    for (let i = 0; i < NUM_RAYS; i++) {
      const angle = (360 / NUM_RAYS) * i;
      const wide = i % 2 === 0;
      const w = wide ? 12 : 6;
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon",
      );
      polygon.setAttribute("points", `${-w / 2},40 ${w / 2},40 2,240 -2,240`);
      polygon.setAttribute("transform", `rotate(${angle})`);
      polygon.setAttribute("fill", `rgba(245,200,66,${wide ? 0.13 : 0.07})`);
      raysGroup.appendChild(polygon);
    }
  }, []);

  // Generate starfield — UNCHANGED
  useEffect(() => {
    if (!starsContainerRef.current) return;
    const starsContainer = starsContainerRef.current;
    for (let i = 0; i < 80; i++) {
      const star = document.createElement("span");
      const size = 1 + Math.random() * 2 + "px";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.width = size;
      star.style.height = size;
      star.style.setProperty("--d", 2 + Math.random() * 4 + "s");
      star.style.setProperty("--dl", Math.random() * 5 + "s");
      star.style.setProperty("--op", (0.3 + Math.random() * 0.7).toString());
      starsContainer.appendChild(star);
    }
  }, []);

  // Confetti burst — UNCHANGED
  const CONFETTI_COLORS = [
    "#f5c842",
    "#ff8c00",
    "#4af0ff",
    "#ff4fd8",
    "#ffffff",
    "#a8f542",
  ];

  const launchConfetti = useCallback(() => {
    const newConfetti = [];
    for (let i = 0; i < 60; i++) {
      newConfetti.push({
        id: Date.now() + i,
        left: 10 + Math.random() * 80,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        width: 6 + Math.random() * 8,
        height: 8 + Math.random() * 12,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        duration: 1.8 + Math.random() * 1.5,
        delay: Math.random() * 0.6,
      });
    }
    setConfettiPieces(newConfetti);
    setTimeout(() => setConfettiPieces([]), 3000);
  }, []);

  useEffect(() => {
    launchConfetti();
    const interval = setInterval(launchConfetti, 5000);
    return () => clearInterval(interval);
  }, [launchConfetti]);

  useEffect(() => {
    const timer = setTimeout(() => setConfettiPieces([]), 3000);
    return () => clearTimeout(timer);
  }, [confettiPieces]);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@500;700&display=swap");

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #f5c842;
          --gold-light: #ffe97a;
          --gold-dim: #a8861a;
          --blue-deep: #0a0f1e;
          --blue-mid: #0d1b3e;
          --glow-orange: #ff8c00;
          --glow-blue: #4af0ff;

          /*
           * Scene must fit inside viewport together with the button.
           * Budget: 100vh − button height (≈48px) − gap (clamp 20–40px) − vertical padding (clamp 32–96px).
           * We cap with min() so it never overflows.
           */
          --btn-h: 48px;
          --gap: clamp(16px, 3vh, 32px);
          --pad-v: clamp(16px, 4vh, 48px);
          --available: calc(100svh - var(--btn-h) - var(--gap) - var(--pad-v) * 2);

          --scene-size: min(
            clamp(220px, min(78vw, 68vh), 460px),
            var(--available)
          );

          --orbit-1: calc(var(--scene-size) * 0.846);
          --orbit-2: calc(var(--scene-size) * 0.904);
          --halo-size: calc(var(--scene-size) * 0.692);
          --badge-size: calc(var(--scene-size) * 0.615);
          --particle-r: calc(var(--scene-size) * 0.427);
        }

        /* ── PAGE ──
           Strict height = 100svh (no min-height), overflow hidden to kill any scroll.
           Flex column, center both axes.
        ── */
        .wb-page {
  position: relative;

  /* ✅ STRICT viewport lock */
  height: 100svh;
  min-height: 100svh;
  max-height: 100svh;

  height: 100vh; /* fallback */
  max-height: 100vh;

  width: 100%;

  /* ✅ HARD scroll prevention */
  overflow: hidden;
  overscroll-behavior: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: radial-gradient(ellipse at 50% 40%, #0d1b3e 0%, #0a0f1e 70%);

  padding: var(--pad-v) clamp(12px, 4vw, 40px);
  gap: var(--gap);

  /* ✅ Prevent flex overflow issues */
  box-sizing: border-box;
}

        /* ── STARFIELD ── */
        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .stars span {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle var(--d, 3s) var(--dl, 0s) infinite ease-in-out;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: var(--op, 0.8); transform: scale(1.4); }
        }

        /* ── CONFETTI ── */
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          overflow: hidden;
        }

        .conf {
          position: absolute;
          top: -10px;
          opacity: 0;
          animation: confettiFall var(--dur, 2.5s) var(--dl, 0s) ease-in forwards;
        }

        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        /* ── FLASH OVERLAY ── */
        .unlock-flash {
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          pointer-events: none;
          z-index: 99;
          animation: flashBurst 0.5s 0.05s ease-out forwards;
        }

        @keyframes flashBurst {
          0%   { opacity: 0.7; }
          100% { opacity: 0; }
        }

        /* ── SCENE ──
           flex-shrink: 1 + min-height: 0 lets it compress if the viewport is tiny
           rather than overflowing.
        ── */
        .scene {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--scene-size);
          height: var(--scene-size);
          /* allow shrink on very small screens */
          flex-shrink: 1;
          min-width: 0;
          min-height: 0;
          z-index: 1;
          opacity: 0;
          animation: sceneFadeIn 0.8s 0.1s ease-out forwards;
          /* clip sparks/particles that fly outside the scene box */
          overflow: visible; /* keep visible so orbit rings aren't clipped */
        }

        @keyframes sceneFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── RAYS ── */
        .rays {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0;
          animation: raysIn 0.6s 0.2s ease-out forwards;
        }

        .rays svg {
          width: var(--scene-size);
          height: var(--scene-size);
          animation: raysSpin 18s linear infinite;
        }

        @keyframes raysIn  { to { opacity: 1; } }
        @keyframes raysSpin { to { transform: rotate(360deg); } }

        /* ── ORBIT RINGS ── */
        .orbit-ring {
          position: absolute;
          width: var(--orbit-1);
          height: var(--orbit-1);
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--gold);
          border-right-color: var(--gold-dim);
          opacity: 0;
          animation: orbitIn 0.5s 0.3s ease-out forwards, orbitSpin 4s 0.8s linear infinite;
        }

        .orbit-ring-2 {
          width: var(--orbit-2);
          height: var(--orbit-2);
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: var(--gold-dim);
          border-left-color: var(--gold);
          animation: orbitIn 0.5s 0.4s ease-out forwards, orbitSpin2 6s 0.8s linear infinite;
        }

        @keyframes orbitIn   { to { opacity: 0.7; } }
        @keyframes orbitSpin  { to { transform: rotate(360deg); } }
        @keyframes orbitSpin2 { to { transform: rotate(-360deg); } }

        /* ── PARTICLE ORBIT DOTS ── */
        .particle-orbit {
          position: absolute;
          width: var(--orbit-1);
          height: var(--orbit-1);
          opacity: 0;
          animation: orbitIn 0.5s 0.5s ease-out forwards, orbitSpin 4s 0.5s linear infinite;
        }

        .particle-orbit span {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--gold-light);
          border-radius: 50%;
          box-shadow: 0 0 8px 3px var(--gold);
          top: -3px;
          left: 50%;
          transform-origin: 0 var(--particle-r);
        }

        .particle-orbit span:nth-child(1) { transform: rotate(0deg)   translateX(-3px); }
        .particle-orbit span:nth-child(2) { transform: rotate(90deg)  translateX(-3px); }
        .particle-orbit span:nth-child(3) { transform: rotate(180deg) translateX(-3px); }
        .particle-orbit span:nth-child(4) { transform: rotate(270deg) translateX(-3px); }

        /* ── HALO ── */
        .halo {
          position: absolute;
          width: var(--halo-size);
          height: var(--halo-size);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,200,66,0.18) 0%, transparent 70%);
          filter: blur(18px);
          opacity: 0;
          animation: haloIn 0.8s 0.2s ease-out forwards, haloPulse 3s 1s ease-in-out infinite;
        }

        @keyframes haloIn { to { opacity: 1; } }

        @keyframes haloPulse {
          0%, 100% { transform: scale(1);    opacity: 0.7; }
          50%       { transform: scale(1.15); opacity: 1; }
        }

        /* ── BADGE WRAP ── */
        .badge-wrap {
          position: relative;
          width: var(--badge-size);
          height: var(--badge-size);
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 800px;
        }

        .badge-depth-wrap {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          opacity: 0;
          transform: scale(0.15);
          animation: smoothZoomIn 2.4s 0.3s linear forwards;
        }

        @keyframes smoothZoomIn {
          0%   { opacity: 0;    transform: scale(0.15); }
          16%  { opacity: 0.2;  transform: scale(0.31); }
          32%  { opacity: 0.4;  transform: scale(0.47); }
          48%  { opacity: 0.6;  transform: scale(0.63); }
          64%  { opacity: 0.8;  transform: scale(0.79); }
          80%  { opacity: 0.93; transform: scale(0.93); }
          100% { opacity: 1;    transform: scale(1); }
        }

        .badge-spin {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: zoomPulse 4s 3.2s ease-in-out infinite;
        }

        @keyframes zoomPulse {
          0%, 100% { transform: scale(1); }
          25%       { transform: scale(1.06); }
          75%       { transform: scale(0.95); }
        }

        .badge-spin-inner {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spinH 3s 3.2s linear forwards;
        }

        @keyframes spinH {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }

        .badge-spin-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          animation: imgGlowIn 2.4s 0.3s linear forwards;
        }

        @keyframes imgGlowIn {
          0%   { opacity: 0;    filter: drop-shadow(0 0 0px   rgba(245,200,66,0))   brightness(1); }
          40%  { opacity: 0.4;  filter: drop-shadow(0 0 4px   rgba(245,200,66,0.2)) brightness(1.1); }
          70%  { opacity: 0.75; filter: drop-shadow(0 0 12px  rgba(245,200,66,0.4)) brightness(1.05); }
          100% { opacity: 1;    filter: drop-shadow(0 0 24px  rgba(245,200,66,0.7)) drop-shadow(0 0 50px rgba(255,140,0,0.4)) brightness(1); }
        }

        /* ── SPARKS ── */
        .sparks {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .spark {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold-light);
          top: 50%;
          left: 50%;
          opacity: 0;
        }

        .spark:nth-child(1)  { animation: sparkFly 1.6s 0.6s  ease-out infinite; --angle: 0deg;   --dist: calc(var(--badge-size)*0.50); }
        .spark:nth-child(2)  { animation: sparkFly 1.6s 0.8s  ease-out infinite; --angle: 30deg;  --dist: calc(var(--badge-size)*0.44); }
        .spark:nth-child(3)  { animation: sparkFly 1.6s 1.0s  ease-out infinite; --angle: 60deg;  --dist: calc(var(--badge-size)*0.48); }
        .spark:nth-child(4)  { animation: sparkFly 1.6s 1.2s  ease-out infinite; --angle: 90deg;  --dist: calc(var(--badge-size)*0.45); }
        .spark:nth-child(5)  { animation: sparkFly 1.6s 1.4s  ease-out infinite; --angle: 120deg; --dist: calc(var(--badge-size)*0.50); }
        .spark:nth-child(6)  { animation: sparkFly 1.6s 0.7s  ease-out infinite; --angle: 150deg; --dist: calc(var(--badge-size)*0.42); }
        .spark:nth-child(7)  { animation: sparkFly 1.6s 0.9s  ease-out infinite; --angle: 180deg; --dist: calc(var(--badge-size)*0.47); }
        .spark:nth-child(8)  { animation: sparkFly 1.6s 1.1s  ease-out infinite; --angle: 210deg; --dist: calc(var(--badge-size)*0.44); }
        .spark:nth-child(9)  { animation: sparkFly 1.6s 1.3s  ease-out infinite; --angle: 240deg; --dist: calc(var(--badge-size)*0.50); }
        .spark:nth-child(10) { animation: sparkFly 1.6s 0.6s  ease-out infinite; --angle: 270deg; --dist: calc(var(--badge-size)*0.45); }
        .spark:nth-child(11) { animation: sparkFly 1.6s 1.0s  ease-out infinite; --angle: 300deg; --dist: calc(var(--badge-size)*0.48); }
        .spark:nth-child(12) { animation: sparkFly 1.6s 1.5s  ease-out infinite; --angle: 330deg; --dist: calc(var(--badge-size)*0.43); }

        @keyframes sparkFly {
          0%   { opacity: 0; transform: rotate(var(--angle)) translateY(0) scale(1); }
          15%  { opacity: 1; }
          80%  { opacity: 0.6; transform: rotate(var(--angle)) translateY(calc(-1 * var(--dist))) scale(0.5); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateY(calc(-1 * var(--dist) - 10px)) scale(0); }
        }

        /* ── STAR SPARKLES ── */
        .star-sparkle {
          position: absolute;
          pointer-events: none;
          width: clamp(12px, 3vmin, 20px);
          height: clamp(12px, 3vmin, 20px);
          opacity: 0;
        }

        .star-sparkle::before, .star-sparkle::after {
          content: "";
          position: absolute;
          background: var(--gold-light);
          border-radius: 2px;
        }

        .star-sparkle::before { width: 2px; height: 100%; left: 50%; transform: translateX(-50%); }
        .star-sparkle::after  { height: 2px; width: 100%; top: 50%; transform: translateY(-50%); }

        .star-sparkle:nth-child(1) { top: 8%;  left: 55%; animation: starPop 2s 0.5s ease-out infinite; }
        .star-sparkle:nth-child(2) { top: 20%; left: 15%; animation: starPop 2s 1.0s ease-out infinite; }
        .star-sparkle:nth-child(3) { top: 75%; left: 20%; animation: starPop 2s 1.5s ease-out infinite; }
        .star-sparkle:nth-child(4) { top: 80%; left: 70%; animation: starPop 2s 0.8s ease-out infinite; }
        .star-sparkle:nth-child(5) { top: 40%; left: 90%; animation: starPop 2s 1.3s ease-out infinite; }
        .star-sparkle:nth-child(6) { top: 50%; left: 5%;  animation: starPop 2s 0.3s ease-out infinite; }

        @keyframes starPop {
          0%   { opacity: 0; transform: scale(0) rotate(0deg); }
          30%  { opacity: 1; transform: scale(1.4) rotate(45deg); }
          60%  { opacity: 0.8; transform: scale(1) rotate(90deg); }
          100% { opacity: 0; transform: scale(0) rotate(135deg); }
        }

        /* ── ACHIEVEMENT TEXT ── */
        .achievement-text {
          position: absolute;
          bottom: clamp(6px, 2vmin, 16px);
        
          transform: translateX(-50%);
          text-align: center;
          white-space: nowrap;
          opacity: 0;
          animation: textReveal 0.7s 0.9s ease-out forwards;
          z-index: 2;
        }

        .achievement-text .label {
          font-family: "Cinzel", serif;
          font-size: clamp(7px, 1.4vmin, 11px);
          letter-spacing: clamp(2px, 0.5vmin, 4px);
          color: var(--gold-dim);
          text-transform: uppercase;
        }

        .achievement-text .title {
          font-family: "Cinzel", serif;
          font-size: clamp(10px, 2.4vmin, 16px);
          letter-spacing: clamp(1px, 0.4vmin, 2px);
          color: var(--gold-light);
          text-shadow: 0 0 14px rgba(245,200,66,0.8);
        }

        @keyframes textReveal {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

        /* ── CONTINUE BUTTON ──
           flex-shrink: 0  → never compressed
           align-self: center → horizontally centered inside the column
           Fixed height matches --btn-h used in the scene-size budget above.
        ── */
        .continue-btn {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          align-self: center;
          height: var(--btn-h);
          padding: 0 clamp(24px, 6vw, 40px);
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
          border: none;
          border-radius: 40px;
          color: var(--blue-deep);
          font-family: "Rajdhani", sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 2vw, 17px);
          letter-spacing: 1px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          box-shadow: 0 4px 20px rgba(245,200,66,0.35);
          opacity: 0;
          animation: textReveal 0.7s 1.2s ease-out forwards;
          white-space: nowrap;
          touch-action: manipulation;
        }

        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,200,66,0.55);
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%);
        }

        .continue-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 10px rgba(245,200,66,0.3);
        }

        /* ── RESPONSIVE BREAKPOINTS ── */

        /* Small phones */
        @media (max-width: 400px) {
          :root {
            --btn-h: 44px;
            --gap: clamp(12px, 2.5vh, 20px);
            --pad-v: clamp(12px, 3vh, 24px);
          }
          .orbit-ring, .orbit-ring-2 { border-width: 1.5px; }
          .halo { filter: blur(10px); }
        }

        /* Very small phones */
        @media (max-width: 320px) {
          :root {
            --btn-h: 40px;
            --gap: 10px;
            --pad-v: 10px;
          }
          .orbit-ring-2 { display: none; }
          .spark:nth-child(n+9) { display: none; }
        }

        /* Landscape / low-height — switch to row layout so scene + button sit side by side */
        @media (max-height: 500px) and (orientation: landscape) {
          :root {
            --btn-h: 44px;
            --gap: 16px;
            --pad-v: 12px;
            /* In row layout the scene is bounded by height only */
            --scene-size: min(
              clamp(140px, 72vh, 280px),
              calc(100svh - var(--pad-v) * 2)
            );
          }

          

          /* In row mode the button sits to the right, so centering is vertical */
          .continue-btn {
            align-self: center;
          }

          /* Trim star count for perf */
          .stars span:nth-child(n+60) { display: none; }
        }

        /* Large desktop — slightly bigger scene, still capped by viewport budget */
        @media (min-width: 1200px) {
          :root {
            --btn-h: 52px;
            --gap: clamp(24px, 3vh, 40px);
            --pad-v: clamp(32px, 5vh, 64px);
          }
        }
      `}</style>

      {/* Full-page centering wrapper */}
      <div className="wb-page">
        {/* Starfield */}
        <div className="stars" ref={starsContainerRef}></div>

        {/* Flash overlay */}
        <div className="unlock-flash"></div>

        {/* Confetti */}
        <div className="confetti-container">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="conf"
              style={{
                left: `${piece.left}%`,
                background: piece.color,
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                borderRadius: piece.borderRadius,
                "--dur": `${piece.duration}s`,
                "--dl": `${piece.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Scene */}
        <div className="scene" ref={sceneRef}>
          {/* Rotating light rays */}
          <div className="rays">
            <svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
              <g ref={raysGroupRef} transform="translate(260,260)"></g>
            </svg>
          </div>

          {/* Orbit rings */}
          <div className="orbit-ring"></div>
          <div className="orbit-ring orbit-ring-2"></div>

          {/* Glowing dots on orbit */}
          <div className="particle-orbit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Halo */}
          <div className="halo"></div>

          {/* Star sparkles */}
          <div className="star-sparkle"></div>
          <div className="star-sparkle"></div>
          <div className="star-sparkle"></div>
          <div className="star-sparkle"></div>
          <div className="star-sparkle"></div>
          <div className="star-sparkle"></div>

          {/* Badge */}
          <div className="badge-wrap">
            <div className="badge-depth-wrap">
              <div className="badge-spin">
                <div className="badge-spin-inner">
                  {imageSrc ? (
                    <img src={imageSrc} alt={badge?.badge_name || "Badge"} />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#333",
                        borderRadius: "50%",
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>

            {/* Spark particles */}
            <div className="sparks">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="spark"></div>
              ))}
            </div>
          </div>

          {/* Achievement text */}
          <div className="achievement-text">
            <div className="label">ACHIEVEMENT UNLOCKED</div>
            <div className="title">
              {badge?.badge_name || "LEARNING STREAK"}
            </div>
          </div>
        </div>

        {/* Continue button — normal flow below scene */}
        <button
          className="continue-btn"
          onClick={() => {
            if (user?.EventType === 2) {
              navigate("/LearningPathNative");
            } else {
              navigate("/LearningPath");
            }
          }}
        >
          CONTINUE JOURNEY →
        </button>
      </div>
    </>
  );
};

export default WelcomeBadge;
