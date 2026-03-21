import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import lottie from "lottie-web";
import BoyChampionAnimation from "./BoyChampion.json";
import GirlChampionAnimation from "./GirlChampion.json";
import RoadPathSVG, { SVG_W, SVG_H, buildRoadPoints } from "./RoadPathSVG";
import MilestoneNode from "./MilestoneNode";

/* ── Lottie player component ─────────────────────────────────────────────── */
const LottiePlayer = ({ style, animationData, loop = true }) => {
  const containerRef = React.useRef(null);
  const animRef = React.useRef(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay: true,
      animationData,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [animationData, loop]);

  return <div ref={containerRef} style={style} />;
};

/**
 * RoadmapContainer
 *
 * Each milestone carries  isUnlocked  and  isCompleted  booleans.
 *
 * Visual states:
 *   locked    – greyed out, lock icon, cursor not-allowed, no card
 *   unlocked  – normal colour, clickable, opens full card
 *   completed – green check badge + coloured ring, still clickable
 *
 * Car animation (via RoadPathSVG → RoadCarSVG):
 *   Derives currentStepIndex and passes it down.  The car always starts
 *   at index 0 on every page load and smoothly drives to the current step.
 *
 * Auto-scroll:
 *   On mount, centres the current step in the viewport.
 */
const RoadmapContainer = ({
  milestones = [],
  onMilestoneNavigate,
  userGender = "unknown",
  onCertificateClick,
  expandedDescriptions = {},
  hoverRatings,
  setHoverRatings,
  ratingLoading,
  ratingsLoaded,
  rateSubModule,
  handleStarClickWhenRated,
  showRatingInfo,
  renderImage,
  formatTime,
  toggleDescription,
}) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const confettiIntervalRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const confettiInstanceRef = useRef(null);

  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const layerRef = useRef(null);
  const anchorRefs = useRef([]);

  const normalizedGender = (userGender || "unknown").toString().toLowerCase();
  const isFemale = normalizedGender === "female";
  const isMale = normalizedGender === "male";
  // "other" (or unknown) → randomly pick one at render time
  const championAnimation = isFemale
    ? GirlChampionAnimation
    : isMale
      ? BoyChampionAnimation
      : Math.random() < 0.5
        ? BoyChampionAnimation
        : GirlChampionAnimation;

  const pts = useMemo(
    () => buildRoadPoints(milestones.length),
    [milestones.length],
  );
  // const pts = buildRoadPoints(milestones.length);

  // ── Derive current step index ─────────────────────────────────────────────
  // Rule: first step that is unlocked but NOT completed = where user is now.
  // If all completed → last index (car drives past end and fades).
  // If nothing unlocked → 0.
  const currentStepIndex = (() => {
    const firstActive = milestones.findIndex(
      (m) => m.isUnlocked && !m.isCompleted,
    );
    if (firstActive !== -1) return firstActive;
    const lastCompleted = milestones.reduce(
      (acc, m, i) => (m.isCompleted ? i : acc),
      -1,
    );
    if (lastCompleted !== -1) return lastCompleted;
    return 0;
  })();

  const allCompleted = milestones.every((m) => m.isCompleted);

  useEffect(() => {
    if (allCompleted) {
      setTimeout(() => {
        setShowCompletionModal(true);
        fireConfetti();
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          stopConfetti();
          setShowCompletionModal(false);
        }, 5000);
      }, 500);
    }
  }, [allCompleted]);

  // ── Confetti effect ─────────────────────────────────────
  const fireConfetti = () => {
    // Create a dedicated canvas pinned above everything (z-index 10001)
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10001;
    `;
    document.body.appendChild(canvas);
    confettiCanvasRef.current = canvas;

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    confettiInstanceRef.current = myConfetti;

    // Initial big burst
    myConfetti({ particleCount: 140, spread: 80, origin: { y: 0.55 } });
    setTimeout(() => {
      myConfetti({
        particleCount: 90,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
      });
      myConfetti({
        particleCount: 90,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
      });
    }, 300);

    // Continuous trickle
    let count = 0;
    confettiIntervalRef.current = setInterval(() => {
      myConfetti({
        particleCount: 18,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.35 },
        ticks: 180,
      });
      count++;
      if (count > 28) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    }, 350);
  };

  const stopConfetti = () => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
    if (confettiInstanceRef.current) {
      confettiInstanceRef.current.reset();
      confettiInstanceRef.current = null;
    }
    if (confettiCanvasRef.current) {
      confettiCanvasRef.current.remove();
      confettiCanvasRef.current = null;
    }
  };

  // ── Position nodes over the SVG road ─────────────────────────────────────

  const positionNodes = useCallback(() => {
    if (!svgRef.current || !stageRef.current || !layerRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / SVG_W;
    const scaleY = svgRect.height / SVG_H;
    const offX = svgRect.left - stageRect.left;
    const offY = svgRect.top - stageRect.top;
    layerRef.current.querySelectorAll("[data-anchor]").forEach((anchor, i) => {
      if (!pts[i]) return;
      anchor.style.left = pts[i].x * scaleX + offX + "px";
      anchor.style.top = pts[i].y * scaleY + offY + "px";
    });
  }, [pts]);

  useEffect(() => {
    const t = setTimeout(positionNodes, 60);
    window.addEventListener("resize", positionNodes);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", positionNodes);
    };
  }, [positionNodes, milestones.length]);

  // ── Smooth scroll-follow-car logic ───────────────────────────────────────
  // The car fires onCarMove(svgY) every animation tick.
  // A separate rAF lerp loop glides window.scrollY toward the target.
  //
  // User-scroll detection:
  //   When the user scrolls manually, we pause the follow loop entirely.
  //   We distinguish user scrolls from our own programmatic scrolls by
  //   tracking whether we wrote the last scroll position ourselves.
  //   After the user stops scrolling for USER_IDLE_MS, we re-sync the
  //   lerp state to the current scroll position and resume following.

  const scrollTargetRef = useRef(0); // where the car wants us to be
  const scrollCurrentRef = useRef(0); // our lerp cursor
  const scrollRAFRef = useRef(null);
  const scrollLoopActiveRef = useRef(false);

  // Set to window.scrollY after every scrollTo() we issue ourselves.
  // If a scroll event fires and window.scrollY ≠ this value → user did it.
  const ourLastScrollRef = useRef(0);
  const userScrollingRef = useRef(false);
  const userIdleTimerRef = useRef(null);

  const USER_IDLE_MS = 800; // ms of scroll silence before re-attaching
  const LERP = 0.1;

  const stopScrollLoop = useCallback(() => {
    if (scrollRAFRef.current) {
      cancelAnimationFrame(scrollRAFRef.current);
      scrollRAFRef.current = null;
    }
    scrollLoopActiveRef.current = false;
  }, []);

  const startScrollLoop = useCallback(() => {
    if (scrollLoopActiveRef.current) return;
    scrollLoopActiveRef.current = true;

    const loop = () => {
      // If user grabbed the scroll while the loop was running, bail out
      if (userScrollingRef.current) {
        scrollLoopActiveRef.current = false;
        return;
      }

      const diff = scrollTargetRef.current - scrollCurrentRef.current;
      if (Math.abs(diff) < 0.5) {
        scrollCurrentRef.current = scrollTargetRef.current;
        scrollLoopActiveRef.current = false;
        return;
      }

      scrollCurrentRef.current += diff * LERP;
      const next = Math.max(0, scrollCurrentRef.current);
      ourLastScrollRef.current = next;
      window.scrollTo(0, next);
      scrollRAFRef.current = requestAnimationFrame(loop);
    };

    scrollRAFRef.current = requestAnimationFrame(loop);
  }, []);

  // Detect user-initiated scrolls
  useEffect(() => {
    const onScroll = () => {
      const actual = window.scrollY;
      // Allow a 2px tolerance for sub-pixel rounding
      if (Math.abs(actual - ourLastScrollRef.current) > 2) {
        // This scroll was NOT written by us → user is scrolling
        userScrollingRef.current = true;
        stopScrollLoop();

        // Sync lerp cursor so we don't jump when we resume
        scrollCurrentRef.current = actual;
        scrollTargetRef.current = actual;

        // Restart following after user is idle
        clearTimeout(userIdleTimerRef.current);
        userIdleTimerRef.current = setTimeout(() => {
          userScrollingRef.current = false;
          // scrollCurrentRef already synced; new onCarMove calls will move target
        }, USER_IDLE_MS);
      } else {
        // It was our own scroll — keep ourLastScrollRef fresh
        ourLastScrollRef.current = actual;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stopScrollLoop]);

  // Called by RoadCarSVG on every animation tick
  const handleCarMove = useCallback(
    (svgY) => {
      if (!svgRef.current || userScrollingRef.current) return;
      const svgEl = svgRef.current.querySelector("svg") || svgRef.current;
      if (!svgEl) return;
      const svgRect = svgEl.getBoundingClientRect();
      const scaleY = svgRect.height / SVG_H;
      const absY = svgRect.top + window.scrollY + svgY * scaleY;
      const target = Math.max(0, absY - window.innerHeight / 2);

      scrollTargetRef.current = target;
      startScrollLoop();
    },
    [startScrollLoop],
  );

  // Scroll to current step on mount — centres it in the viewport instantly
  useEffect(() => {
    // Wait for positionNodes (60 ms) + render buffer before measuring
    const t = setTimeout(() => {
      const anchor = anchorRefs.current[currentStepIndex];
      let initialScroll = 0;

      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        // Centre of the node in page-absolute coordinates
        const nodeCentreY = rect.top + window.scrollY + rect.height / 2;
        initialScroll = Math.max(0, nodeCentreY - window.innerHeight / 2);
      }

      window.scrollTo({ top: initialScroll, behavior: "instant" });
      ourLastScrollRef.current = initialScroll;
      scrollCurrentRef.current = initialScroll;
      scrollTargetRef.current = initialScroll;
    }, 150);

    return () => {
      clearTimeout(t);
      stopScrollLoop();
      clearTimeout(userIdleTimerRef.current);
    };
  }, [currentStepIndex, stopScrollLoop]);

  // ── Click handlers ────────────────────────────────────────────────────────

  const handleLockedClick = (milestone) => {
    const prevStep = milestone.id - 1;
    Swal.fire({
      icon: "warning",
      title: "🔒 Step Locked",
      html: `
        <div style="text-align:center;font-family:'Nunito',sans-serif;">
          <p style="color:#4b5563;margin-bottom:12px;font-size:15px;">
            You need to complete <strong>Step ${prevStep}</strong> first before unlocking this step.
          </p>
          <div style="display:inline-flex;align-items:center;gap:8px;background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:8px 16px;">
            <span style="font-size:18px;">🎯</span>
            <span style="color:#92400e;font-weight:700;font-size:13px;">
              Complete Step ${prevStep} to unlock Step ${milestone.id}
            </span>
          </div>
        </div>
      `,
      confirmButtonColor: "#6b7280",
      confirmButtonText: "Got it",
      showCloseButton: true,
    });
  };

  const handleToggle = (milestone) => {
    if (!milestone.isUnlocked) {
      handleLockedClick(milestone);
      return;
    }
    onMilestoneNavigate && onMilestoneNavigate(milestone);
  };

  // ── Shared label-box style helpers ────────────────────────────────────────

  const getLabelBoxStyle = (m) => {
    if (!m.isUnlocked) {
      return {
        background: "#f3f4f6",
        border: "2px dashed #d1d5db",
        cursor: "not-allowed",
        opacity: 0.72,
        boxShadow: "none",
      };
    }
    if (m.isCompleted) {
      return {
        background: "#f0fdf4",
        border: "2px solid #6ee7b7",
        cursor: "pointer",
        boxShadow: "0 2px 8px #10b98122",
      };
    }
    return {
      background: m.bg,
      border: `2px solid ${m.color}`,
      cursor: "pointer",
      boxShadow: `0 2px 8px ${m.color}22`,
    };
  };

  const getTagColor = (m) => {
    if (!m.isUnlocked) return "#9ca3af";
    if (m.isCompleted) return "#059669";
    return m.color;
  };

  const getTitleColor = (m) => {
    if (!m.isUnlocked) return "#9ca3af";
    return "#2D3748";
  };

  const getConnectorColor = (m) => {
    if (!m.isUnlocked) return "#d1d5db";
    if (m.isCompleted) return "#10b981";
    return m.color;
  };

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      {/* SVG road + animated car */}
      <div ref={svgRef} style={{ width: "100%", display: "block" }}>
        <RoadPathSVG
          milestones={milestones}
          currentStepIndex={currentStepIndex}
          onCarMove={handleCarMove}
          onCertificateClick={onCertificateClick}
        />
      </div>

      {/* Overlay layer */}
      <div
        ref={layerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {milestones.map((m, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const isLeft = side === "left";
          const labelBoxStyle = getLabelBoxStyle(m);

          return (
            <div
              key={m.id}
              data-anchor={i}
              ref={(el) => (anchorRefs.current[i] = el)}
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
                zIndex: 20,
              }}
            >
              {/* ── Node ── */}
              <div
                onClick={() => handleToggle(m)}
                style={{
                  cursor: m.isUnlocked ? "pointer" : "not-allowed",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {!m.isUnlocked ? (
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: "#e5e7eb",
                      border: "4px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🔒</span>
                  </div>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i === currentStepIndex && !m.isCompleted && (
                      <div
                        style={{
                          position: "absolute",
                          inset: -5,
                          borderRadius: "50%",
                          border: "3px solid #10b981",
                          animation: "pulse-ring 2s ease-in-out infinite",
                        }}
                      />
                    )}
                    <MilestoneNode milestone={m} index={i} />
                    {/* {m.isCompleted && (
                      <div
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#10b981",
                          border: "2px solid white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 5,
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            fontSize: 9,
                            fontWeight: 900,
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                      </div>
                    )} */}
                  </div>
                )}
              </div>

              {/* ── Always-visible label box ── */}
              <div
                onClick={() => handleToggle(m)}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  [isLeft ? "right" : "left"]: "calc(50% + 36px)",
                  // width: "clamp(115px, 20vw, 175px)",
                  width: "clamp(100px, 28vw, 175px)",
                  maxWidth: "calc(50vw - 40px)",
                  borderRadius: 12,
                  padding: "7px 10px",
                  transition:
                    "background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
                  zIndex: 10,
                  ...labelBoxStyle,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    [isLeft ? "left" : "right"]: "100%",
                    width: 22,
                    height: 2,
                    background: getConnectorColor(m),
                    transform: "translateY(-50%)",
                    transition: "background 0.2s",
                  }}
                />

                {!m.isUnlocked && (
                  <div style={{ fontSize: 9, marginBottom: 2, opacity: 0.6 }}>
                    🔒 Locked
                  </div>
                )}

                {m.isUnlocked && m.isCompleted && (
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: "#059669",
                      letterSpacing: "0.06em",
                      fontFamily: "'Nunito', sans-serif",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <span>✓</span> Completed
                  </div>
                )}

                {!(m.isUnlocked && m.isCompleted) && (
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: getTagColor(m),
                      letterSpacing: "0.08em",
                      fontFamily: "'Nunito', sans-serif",
                      marginBottom: 2,
                    }}
                  >
                    {m.tag}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "clamp(9px, 1.4vw, 11.5px)",
                    fontWeight: 900,
                    color: getTitleColor(m),
                    fontFamily: "'Nunito', sans-serif",
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                  }}
                >
                  {m.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Completion Modal — BoyChampion Lottie fullscreen ── */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              stopConfetti();
              setShowCompletionModal(false);
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(10,10,20,0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              cursor: "pointer",
            }}
          >
            <LottiePlayer
              animationData={championAnimation}
              loop={true}
              style={{
                width: "clamp(260px, 70vw, 600px)",
                height: "clamp(260px, 70vw, 600px)",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 0.8; }
          50%  { transform: scale(1.18); opacity: 0.3; }
          100% { transform: scale(1);    opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default RoadmapContainer;
