import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import ApiContext from "../../context/ApiContext";

/* ─────────────────────────────────────────────────────────────────
   STYLES — injected once into <head>
───────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Outfit:wght@400;500;600&display=swap');

  /* ── Keyframes ── */
  @keyframes fcc-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fcc-modal-in {
    0%   { opacity: 0; transform: translateY(48px) scale(0.88); }
    65%  { transform: translateY(-8px) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fcc-card-in {
    0%   { opacity: 0; transform: translateY(40px) scale(0.78); }
    60%  { transform: translateY(-6px) scale(1.05); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fcc-title-in {
    from { opacity: 0; transform: translateY(-28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fcc-sub-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fcc-float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes fcc-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes fcc-confetti-fall {
    0%   { transform: translateY(-30px) rotate(0deg) scale(1); opacity: 1; }
    80%  { opacity: 0.9; }
    100% { transform: translateY(600px) rotate(800deg) scale(0.4); opacity: 0; }
  }
  @keyframes fcc-ring-drain {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 220; }
  }
  @keyframes fcc-pulse-ring {
    0%   { transform: scale(0.88); opacity: 0.7; }
    50%  { transform: scale(1.18); opacity: 0; }
    100% { transform: scale(0.88); opacity: 0; }
  }
  @keyframes fcc-star-twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50%       { opacity: 0.8; transform: scale(1.3); }
  }
  @keyframes fcc-detail-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fcc-dismiss-out {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.94); }
  }
  @keyframes fcc-tap-pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }

  /* ── Base overlay ── */
  .fcc-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 4vw, 48px);
    background:
      radial-gradient(ellipse at 50% -10%, rgba(124,58,237,0.32) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 100%, rgba(251,191,36,0.15) 0%, transparent 50%),
      rgba(9, 7, 20, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    animation: fcc-overlay-in 0.4s ease both;
    overflow-y: auto;
  }
  .fcc-overlay.fcc-dismissing {
    animation: fcc-dismiss-out 0.4s ease forwards;
  }

  /* ── Stars ── */
  .fcc-stars {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 9999;
  }
  .fcc-star {
    position: absolute;
    background: #ffffff;
    border-radius: 50%;
    animation: fcc-star-twinkle var(--fcc-dur) var(--fcc-delay) ease-in-out infinite;
  }

  /* ── Confetti ── */
  .fcc-confetti {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 10000;
  }
  .fcc-piece {
    position: absolute;
    top: -20px;
    font-size: var(--fcc-sz);
    animation: fcc-confetti-fall var(--fcc-dur) var(--fcc-delay) ease-in both;
    user-select: none;
    line-height: 1;
  }

  /* ── Glow orb ── */
  .fcc-orb {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: min(480px, 80vw);
    height: min(480px, 80vw);
    background: radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
  }

  /* ── Modal card ── */
  .fcc-modal {
    position: relative;
    z-index: 10001;
    width: 100%;
    max-width: min(720px, 96vw);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px;
    padding: clamp(28px, 5vw, 52px) clamp(20px, 5vw, 48px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(24px, 3.5vw, 36px);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 40px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1);
    animation: fcc-modal-in 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.05s both;
  }
  .fcc-modal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent);
    border-radius: 100px;
  }

  /* ── Header ── */
  .fcc-header {
    text-align: center;
    animation: fcc-title-in 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }
  .fcc-emoji-row {
    font-size: clamp(28px, 5vw, 42px);
    margin-bottom: 12px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  .fcc-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: clamp(22px, 4.5vw, 36px);
    letter-spacing: -0.03em;
    color: #ffffff;
    line-height: 1.1;
    margin: 0;
  }
  .fcc-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(13px, 2.2vw, 16px);
    color: rgba(255,255,255,0.5);
    font-weight: 400;
    margin: 8px 0 0;
    animation: fcc-sub-in 0.6s ease 0.6s both;
  }

  /* ── Badge grid ── */
  .fcc-grid {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(12px, 2.5vw, 20px);
    justify-content: center;
    width: 100%;
  }

  /* ── Individual badge card ── */
  .fcc-badge-card {
    width: clamp(126px, 26vw, 158px);
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px;
    padding: clamp(18px, 3vw, 28px) clamp(12px, 2vw, 18px) clamp(14px, 2.5vw, 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.3s ease, background 0.3s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    animation: fcc-card-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }
  .fcc-badge-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 55%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent);
  }
  .fcc-badge-card:hover {
    border-color: rgba(251,191,36,0.45);
    background: rgba(255,255,255,0.08);
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 14px 36px rgba(0,0,0,0.35);
  }
  .fcc-badge-card.fcc-selected {
    border-color: rgba(251,191,36,0.85);
    background: rgba(251,191,36,0.07);
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 0 36px rgba(251,191,36,0.2), 0 18px 40px rgba(0,0,0,0.4);
  }
  .fcc-badge-card.fcc-selected .fcc-img-wrap {
    filter: drop-shadow(0 0 18px rgba(251,191,36,0.75));
  }

  /* ── Badge image wrapper ── */
  .fcc-img-wrap {
    animation: fcc-float 3.5s ease-in-out infinite;
    transition: filter 0.35s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fcc-pulse-ring {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1.5px solid rgba(251,191,36,0.5);
    animation: fcc-pulse-ring 2.2s ease-out infinite;
    pointer-events: none;
  }
  .fcc-badge-img {
    width: clamp(68px, 13vw, 96px);
    height: clamp(68px, 13vw, 96px);
    object-fit: contain;
    display: block;
  }
  .fcc-badge-placeholder {
    width: clamp(68px, 13vw, 96px);
    height: clamp(68px, 13vw, 96px);
    border-radius: 50%;
    background: linear-gradient(135deg, #2d2054, #1a1535);
    border: 2px dashed rgba(255,255,255,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  }

  /* ── Badge name shimmer ── */
  .fcc-badge-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 700;
    font-size: clamp(11px, 2vw, 13.5px);
    text-align: center;
    letter-spacing: 0.01em;
    line-height: 1.35;
    margin: 0;
    background: linear-gradient(90deg, #fde68a, #fbbf24, #f59e0b, #fbbf24, #fde68a);
    background-size: 250% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fcc-shimmer 2.8s linear infinite;
  }

  /* ── Category pill ── */
  .fcc-badge-cat {
    font-size: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    color: rgba(255,255,255,0.42);
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    padding: 3px 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Unlocked pill ── */
  .fcc-unlocked-pill {
    font-size: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    color: rgba(52,211,153,0.9);
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: 100px;
    padding: 3px 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Detail inspect panel ── */
  .fcc-detail-panel {
    width: 100%;
    max-width: 440px;
    background: rgba(251,191,36,0.06);
    border: 1px solid rgba(251,191,36,0.22);
    border-radius: 18px;
    padding: 20px 26px;
    text-align: center;
    animation: fcc-detail-in 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }
  .fcc-detail-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 700;
    font-size: clamp(16px, 3vw, 19px);
    color: #fbbf24;
    margin: 0 0 6px;
  }
  .fcc-detail-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.58);
    line-height: 1.65;
    margin: 0;
  }
  .fcc-detail-cat-badge {
    display: inline-block;
    margin-top: 12px;
    font-size: 11px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    color: #fbbf24;
    background: rgba(251,191,36,0.12);
    border-radius: 100px;
    padding: 3px 14px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Tap hint ── */
  .fcc-tap-hint {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    color: rgba(255,255,255,0.28);
    letter-spacing: 0.04em;
    animation: fcc-tap-pulse 2.2s ease-in-out 2s 3;
  }

  /* ── Footer row ── */
  .fcc-footer {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .fcc-countdown-label {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(12px, 2vw, 14px);
    color: rgba(255,255,255,0.5);
  }
  .fcc-dismiss-btn {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.72);
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 100px;
    padding: 6px 18px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    outline: none;
  }
  .fcc-dismiss-btn:hover {
    background: rgba(255,255,255,0.15);
    color: #ffffff;
  }
  .fcc-dismiss-btn:active {
    transform: scale(0.97);
  }

  /* ── SVG ring animation ── */
  .fcc-ring-progress {
    transform-origin: center;
    transform: rotate(-90deg);
    animation: fcc-ring-drain var(--fcc-ring-duration, 8s) linear forwards;
  }
`;

/* ─────────────────────────────────────────────────────────────────
   Confetti — pure JS-rendered particle burst
───────────────────────────────────────────── */
const CONFETTI_COLORS = ["#fbbf24","#f472b6","#34d399","#60a5fa","#a78bfa","#fb7185","#fde68a"];
const CONFETTI_SHAPES = ["■","●","▲","◆","★"];
const AUTO_CLOSE_DURATION = 8; // seconds

function Confetti() {
  const particles = Array.from({ length: 42 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
    size: `${7 + Math.random() * 9}px`,
    delay: `${Math.random() * 2.4}s`,
    dur: `${2.8 + Math.random() * 2.2}s`,
  }));

  return (
    <div className="fcc-confetti" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="fcc-piece"
          style={{
            left: p.left,
            color: p.color,
            "--fcc-sz": p.size,
            "--fcc-dur": p.dur,
            "--fcc-delay": p.delay,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stars — ambient background twinkle
───────────────────────────────────────────── */
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    dur: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 3}s`,
  }));

  return (
    <div className="fcc-stars" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="fcc-star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            "--fcc-dur": s.dur,
            "--fcc-delay": s.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Countdown ring SVG
───────────────────────────────────────────── */
function CountdownRing({ duration = AUTO_CLOSE_DURATION }) {
  const r = 21;
  const circ = 2 * Math.PI * r; // ~132
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <circle
        cx="26" cy="26" r={r}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="3.5"
      />
      <circle
        cx="26" cy="26" r={r}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset="0"
        className="fcc-ring-progress"
        style={{ "--fcc-ring-duration": `${duration}s` }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Badge card
───────────────────────────────────────────── */
function BadgeCard({ badge, index, isSelected, onSelect }) {
  const imageSrc = badge.badge
    ? badge.badge.startsWith("data:")
      ? badge.badge
      : `data:image/png;base64,${badge.badge}`
    : null;

  return (
    <div
      className={`fcc-badge-card${isSelected ? " fcc-selected" : ""}`}
      style={{ animationDelay: `${0.3 + index * 0.12}s` }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onSelect()}
    >
      {/* inner top edge highlight */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.55), transparent)",
        }}
      />

      {/* image / placeholder */}
      <div
        className="fcc-img-wrap"
        style={{ animationDelay: `${0.45 + index * 0.12}s` }}
      >
        <div className="fcc-pulse-ring" aria-hidden="true" />
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={badge.badge_name}
            className="fcc-badge-img"
            loading="lazy"
          />
        ) : (
          <div className="fcc-badge-placeholder" aria-hidden="true">🏅</div>
        )}
      </div>

      {/* name */}
      <p className="fcc-badge-name">{badge.badge_name}</p>

      {/* category */}
      {badge.badge_category && (
        <span className="fcc-badge-cat">{badge.badge_category}</span>
      )}

      {/* unlocked status */}
      <span className="fcc-unlocked-pill">✓ Unlocked</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Detail inspect panel
───────────────────────────────────────────── */
function DetailPanel({ badge }) {
  if (!badge) return null;
  return (
    <div className="fcc-detail-panel" role="region" aria-label="Badge details">
      <h3 className="fcc-detail-name">{badge.badge_name}</h3>
      {badge.badge_description && (
        <p className="fcc-detail-desc">{badge.badge_description}</p>
      )}
      {badge.badge_category && (
        <span className="fcc-detail-cat-badge">{badge.badge_category}</span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main FCCBadge component
───────────────────────────────────────────── */
const FCCBadge = ({ userId, onClose }) => {
  const { fetchData, userToken, user } = useContext(ApiContext);

  const [badges, setBadges]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedBadge, setSelected] = useState(null);
  const [dismissing, setDismissing]  = useState(false);

  const styleInjected = useRef(false);
  const autoCloseTimer = useRef(null);
  const overlayRef     = useRef(null);

  /* ── Inject styles once ── */
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement("style");
    tag.dataset.fccBadge = "1";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => {
      try { document.head.removeChild(tag); } catch (_) {}
    };
  }, []);

  /* ── Fetch FCC badges ── */
  useEffect(() => {
    const fetchFCCBadges = async () => {
      try {
        const targetId = userId || user?.UserID;
        if (!targetId) { setLoading(false); return; }

        const res = await fetchData(
          `api/fccbadges/${targetId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          }
        );

        if (res?.success) {
          const data = Array.isArray(res.data) ? res.data : [];
          // Filter to only newly-unlocked badges (isView === 0) if field exists
          const newBadges = data.filter(b => b.isView === undefined || b.isView === 0);
          setBadges(newBadges);
        } else {
          setBadges([]);
        }
      } catch (err) {
        console.error("FCCBadge fetch error:", err);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFCCBadges();
  }, [userId, user, fetchData, userToken]);

  /* ── Auto-close timer ── */
  useEffect(() => {
    if (!loading && badges.length > 0) {
      autoCloseTimer.current = setTimeout(() => handleDismiss(), AUTO_CLOSE_DURATION * 1000);
    }
    return () => clearTimeout(autoCloseTimer.current);
  }, [loading, badges]);

  /* ── Dismiss with animation ── */
  const handleDismiss = useCallback(() => {
    setDismissing(true);
    clearTimeout(autoCloseTimer.current);
    setTimeout(() => { onClose && onClose(); }, 380);
  }, [onClose]);

  /* ── Badge select / deselect ── */
  const handleSelectBadge = useCallback((badge) => {
    setSelected(prev => (prev?.id === badge.id ? null : badge));
  }, []);

  /* ── Backdrop click ── */
  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) handleDismiss();
  }, [handleDismiss]);

  /* ── Keyboard escape ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleDismiss(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleDismiss]);

  if (loading || badges.length === 0) return null;

  return (
    <>
      <Stars />
      <Confetti />
      <div className="fcc-orb" aria-hidden="true" />

      <div
        ref={overlayRef}
        className={`fcc-overlay${dismissing ? " fcc-dismissing" : ""}`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="FCC Badges unlocked"
      >
        <div className="fcc-modal">
          {/* ── Header ── */}
          <div className="fcc-header">
            <div className="fcc-emoji-row" aria-hidden="true">
              <span>🎉</span>
              <span>🏆</span>
              <span>🎉</span>
            </div>
            <h2 className="fcc-title">
              {badges.length === 1 ? "FCC Badge Unlocked!" : "FCC Badges Unlocked!"}
            </h2>
            <p className="fcc-subtitle">
              {badges.length === 1
                ? "You earned a new achievement — keep going!"
                : `You earned ${badges.length} new achievements — incredible work!`}
            </p>
          </div>

          {/* ── Badge grid ── */}
          <div className="fcc-grid" role="list">
            {badges.map((badge, i) => (
              <BadgeCard
                key={badge.id ?? badge._id ?? i}
                badge={badge}
                index={i}
                isSelected={selectedBadge?.id === badge.id}
                onSelect={() => handleSelectBadge(badge)}
              />
            ))}
          </div>

          {/* ── Tap hint ── */}
          <p className="fcc-tap-hint" aria-hidden="true">
            Tap a badge to inspect it
          </p>

          {/* ── Detail panel (conditional) ── */}
          {selectedBadge && <DetailPanel badge={selectedBadge} />}

          {/* ── Footer with countdown ring ── */}
          <div className="fcc-footer">
            <CountdownRing duration={AUTO_CLOSE_DURATION} />
            <span className="fcc-countdown-label">Closing automatically…</span>
            <button
              className="fcc-dismiss-btn"
              onClick={handleDismiss}
              aria-label="Dismiss badge overlay"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FCCBadge;