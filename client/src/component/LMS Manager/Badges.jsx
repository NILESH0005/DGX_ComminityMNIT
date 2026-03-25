import React, { useEffect, useState, useRef } from "react";

/* ─────────────────────────────────────────────
   Keyframe + global styles injected once
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes badge-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes badge-card-in {
    0%   { opacity: 0; transform: translateY(40px) scale(0.8); }
    60%  { transform: translateY(-6px) scale(1.05); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes badge-title-in {
    from { opacity: 0; transform: translateY(-24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes badge-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes badge-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes badge-ring-pulse {
    0%, 100% { box-shadow: 0 0 0 0px rgba(250,204,21,0.4); }
    50%       { box-shadow: 0 0 0 10px rgba(250,204,21,0); }
  }
  @keyframes confetti-fall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes countdown-shrink {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 157; }
  }
  @keyframes star-spin {
    from { transform: rotate(0deg) scale(1); }
    to   { transform: rotate(360deg) scale(1); }
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }

  .badge-card {
    animation: badge-card-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .badge-card:hover .badge-img-wrap {
    transform: scale(1.12) translateY(-4px);
    filter: drop-shadow(0 0 18px rgba(250,204,21,0.7));
  }
  .badge-card:hover {
    background: rgba(255,255,255,0.08) !important;
    border-color: rgba(250,204,21,0.5) !important;
  }
  .badge-img-wrap {
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease;
    animation: badge-float 3s ease-in-out infinite;
  }
  .badge-name-shimmer {
    background: linear-gradient(90deg, #fde68a, #fbbf24, #f59e0b, #fbbf24, #fde68a);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: badge-shimmer 2.5s linear infinite;
  }
  .badge-overlay {
    animation: badge-overlay-in 0.4s ease both;
  }
  .badge-title-wrap {
    animation: badge-title-in 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .countdown-ring {
    animation: countdown-shrink 5s linear forwards;
    transform-origin: center;
    transform: rotate(-90deg);
  }
`;

/* ─────────────────────────────────────────────
   Confetti particle
───────────────────────────────────────────── */
const CONFETTI_COLORS = ["#fbbf24","#f472b6","#34d399","#60a5fa","#a78bfa","#fb7185","#fde68a"];
const SHAPES = ["■","●","▲","◆"];

function Confetti() {
  const particles = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: SHAPES[i % SHAPES.length],
    size: 8 + Math.random() * 10,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
  }));

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-20px",
            left: p.left,
            color: p.color,
            fontSize: p.size,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in both`,
            userSelect: "none",
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Countdown ring SVG (5-second)
───────────────────────────────────────────── */
function CountdownRing({ duration = 5 }) {
  const r = 22;
  const circ = 2 * Math.PI * r; // ~138
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ display:"block" }}>
      {/* track */}
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
      {/* progress */}
      <circle
        cx="28" cy="28" r={r}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset="0"
        className="countdown-ring"
        style={{ animationDuration: `${duration}s` }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Badge Card
───────────────────────────────────────────── */
function BadgeCard({ badge, index }) {
  const imageSrc = badge?.badge ? `data:image/png;base64,${badge.badge}` : null;

  return (
    <div
      className="badge-card"
      style={{
        animationDelay: `${0.3 + index * 0.12}s`,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "clamp(16px, 3vw, 28px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        cursor: "default",
        transition: "background 0.3s, border-color 0.3s",
        width: "clamp(120px, 28vw, 160px)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* inner glow top */}
      <div style={{
        position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:"60%", height:"1px",
        background:"linear-gradient(90deg, transparent, rgba(250,204,21,0.6), transparent)",
      }} />

      {/* image */}
      <div
        className="badge-img-wrap"
        style={{ animationDelay: `${0.5 + index * 0.12}s` }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={badge.badge_name}
            style={{
              width: "clamp(72px, 14vw, 100px)",
              height: "clamp(72px, 14vw, 100px)",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "clamp(72px, 14vw, 100px)",
            height: "clamp(72px, 14vw, 100px)",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #374151, #1f2937)",
            border: "2px dashed rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px",
          }}>
            🏅
          </div>
        )}
      </div>

      {/* name */}
      <p
        className="badge-name-shimmer"
        style={{
          margin: 0,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(11px, 2.2vw, 14px)",
          textAlign: "center",
          letterSpacing: "0.02em",
          lineHeight: 1.3,
        }}
      >
        {badge.badge_name}
      </p>

      {/* unlocked pill */}
      <span style={{
        fontSize: "10px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        color: "rgba(255,255,255,0.5)",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "100px",
        padding: "2px 10px",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}>
        Unlocked
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Badges = ({ user, fetchData, onClose }) => {
  const [badges, setBadges] = useState([]);
  const styleInjected = useRef(false);

  // Inject styles once
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement("style");
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => { try { document.head.removeChild(tag); } catch(_) {} };
  }, []);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?.UserID) return;

      try {
        const response = await fetchData(
          `api/badges/show/${user.UserID}`,
          "GET",
          {},
          { "Content-Type": "application/json" },
        );



        console.log("Badges response:", response);

        if (response?.success && response.data?.length > 0) {
          const newBadges = response.data.filter((b) => b.isView === 0);
          setBadges(newBadges);
        } else {
          setBadges([]);
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
        setBadges([]);
      }
    };

    fetchBadges();

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [user, fetchData, onClose]);

  if (!badges || badges.length === 0) return null;

  return (
    <div
      className="badge-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 40px)",
        // layered backdrop
        background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(245,158,11,0.2) 0%, transparent 50%), rgba(8, 6, 18, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        overflowY: "auto",
      }}
    >
      <Confetti />

      {/* ambient glow orb */}
      <div style={{
        position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)",
        width:"min(500px, 80vw)", height:"min(500px, 80vw)",
        background:"radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
        borderRadius:"50%", pointerEvents:"none",
        animation:"glow-pulse 3s ease-in-out infinite",
        zIndex:0,
      }} />

      {/* ── Card ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: "min(760px, 96vw)",
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "28px",
        padding: "clamp(24px, 5vw, 48px) clamp(20px, 5vw, 44px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(24px, 4vw, 36px)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        {/* top edge highlight */}
        <div style={{
          position:"absolute", top:0, left:"10%", right:"10%", height:"1px",
          background:"linear-gradient(90deg, transparent, rgba(250,204,21,0.5), transparent)",
          borderRadius:"100px",
        }} />

        {/* ── Header ── */}
        <div className="badge-title-wrap" style={{ textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px, 6vw, 44px)", lineHeight:1, marginBottom:"10px", display:"flex", gap:"8px", justifyContent:"center" }}>
            <span>🎉</span>
            <span style={{ animation:"star-spin 8s linear infinite", display:"inline-block" }}>✨</span>
            <span>🎉</span>
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(20px, 4.5vw, 34px)",
            letterSpacing: "-0.02em",
            color: "#ffffff",
            lineHeight: 1.15,
          }}>
            New Badges Unlocked!
          </h2>
          <p style={{
            margin: "8px 0 0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(13px, 2.5vw, 16px)",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 400,
          }}>
            {badges.length === 1
              ? "You earned an achievement — keep it up!"
              : `You earned ${badges.length} achievements — incredible work!`}
          </p>
        </div>

        {/* ── Badges Grid ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(12px, 2.5vw, 20px)",
          justifyContent: "center",
          width: "100%",
        }}>
          {badges.map((b, i) => (
            <BadgeCard key={b.id ?? i} badge={b} index={i} />
          ))}
        </div>

        {/* ── Footer: countdown ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          opacity: 0.7,
        }}>
          <CountdownRing duration={10} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(12px, 2.2vw, 14px)",
            color: "rgba(255,255,255,0.6)",
          }}>
            Closing automatically…
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: "4px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.75)",
              borderRadius: "100px",
              padding: "5px 16px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.15)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default Badges;