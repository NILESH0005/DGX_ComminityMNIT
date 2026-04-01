import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
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

/* ── RoadmapContainer ────────────────────────────────────────────────────── */
const RoadmapContainer = ({
  milestones = [],
  onMilestoneNavigate,
  userGender = "unknown",
  onCertificateClick,
  user,
  moduleName,
  quizCompleted,
  allSubModulesCompleted,
  isCertificateReady,
  certificatePath,
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
  // ── State ─────────────────────────────────────────────────────────────────
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [pinW, setPinW] = useState(
    Math.min(68, Math.max(44, window.innerWidth * 0.12)),
  );

  // ── Refs ──────────────────────────────────────────────────────────────────
  const confettiIntervalRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const confettiInstanceRef = useRef(null);
  const championTimerRef = useRef(null); // tracks auto-close timeout

  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const layerRef = useRef(null);
  const anchorRefs = useRef([]);

  // ── Gender-aware champion animation ───────────────────────────────────────
  const normalizedGender = (userGender || "unknown").toString().toLowerCase();
  const isFemale = normalizedGender === "female";
  const isMale = normalizedGender === "male";
  const championAnimation = isFemale
    ? GirlChampionAnimation
    : isMale
      ? BoyChampionAnimation
      : Math.random() < 0.5
        ? BoyChampionAnimation
        : GirlChampionAnimation;

  // ── Road points ───────────────────────────────────────────────────────────
  const pts = useMemo(
    () => buildRoadPoints(milestones.length),
    [milestones.length],
  );

  // ── Derive current step index ─────────────────────────────────────────────
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

  // ── Responsive pin width ──────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () =>
      setPinW(Math.min(68, Math.max(44, window.innerWidth * 0.12)));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Confetti helpers — declared BEFORE the useEffect that calls them ──────
  const stopConfetti = useCallback(() => {
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
  }, []);

  const fireConfetti = useCallback(() => {
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

    // Initial big bursts
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
      if (++count > 28) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    }, 350);
  }, []); // only touches refs — no deps needed

  // ── Champion animation trigger via navigation state ───────────────────────
  // Reads location.state?.showChampion once on mount.
  // Immediately clears state so refresh never re-triggers.
  const location = useLocation();



  useEffect(() => {
    if (!location.state?.showChampion) return;

    // 1. Clear the history state immediately — prevents re-trigger on refresh
    window.history.replaceState({}, document.title);

    // 2. Short delay for a smoother UX entrance
    const startTimer = setTimeout(() => {
      setShowCompletionModal(true);
      fireConfetti();

      // 3. Auto-close after 5.5 s
      championTimerRef.current = setTimeout(() => {
        stopConfetti();
        setShowCompletionModal(false);
      }, 5500);
    }, 300);

    // 4. Cleanup if component unmounts mid-animation
    return () => {
      clearTimeout(startTimer);
      clearTimeout(championTimerRef.current);
      stopConfetti();
    };
  }, []); // intentionally empty — runs once on mount; state is a mount-time snapshot

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
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const scrollRAFRef = useRef(null);
  const scrollLoopActiveRef = useRef(false);
  const ourLastScrollRef = useRef(0);
  const userScrollingRef = useRef(false);
  const userIdleTimerRef = useRef(null);
  const USER_IDLE_MS = 800;
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
      if (Math.abs(actual - ourLastScrollRef.current) > 2) {
        userScrollingRef.current = true;
        stopScrollLoop();
        scrollCurrentRef.current = actual;
        scrollTargetRef.current = actual;
        clearTimeout(userIdleTimerRef.current);
        userIdleTimerRef.current = setTimeout(() => {
          userScrollingRef.current = false;
        }, USER_IDLE_MS);
      } else {
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

  // Scroll to current step on mount
  useEffect(() => {
    const t = setTimeout(() => {
      const anchor = anchorRefs.current[currentStepIndex];
      let initialScroll = 0;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
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

  // ── Label-box style helpers ───────────────────────────────────────────────
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

  // ── Render ────────────────────────────────────────────────────────────────
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
          onCertificateClick={quizCompleted ? null : onCertificateClick}
          quizCompleted={quizCompleted}
          allSubModulesCompleted={allSubModulesCompleted}
          isCertificateReady={isCertificateReady}
          user={user}
          moduleName={moduleName}
          certificatePath={certificatePath} // ✅ ADD THIS
        />
      </div>

      {/* Overlay layer — milestone nodes */}
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
              {/* ── Pin node ── */}
              <div
                onClick={() => handleToggle(m)}
                style={{
                  cursor: m.isUnlocked ? "pointer" : "not-allowed",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {!m.isUnlocked ? (
                  <svg
                    viewBox="0 0 80 102"
                    width={pinW}
                    height={Math.round(pinW * (102 / 80))}
                    style={{
                      display: "block",
                      flexShrink: 0,
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
                      opacity: 0.72,
                    }}
                  >
                    <path
                      d="M 40 2 C 18 2, 2 18, 2 40 C 2 60, 15 73, 28 83 L 40 92 L 52 83 C 65 73, 78 60, 78 40 C 78 18, 62 2, 40 2 Z"
                      fill="white"
                    />
                    <path
                      d="M 40 6 C 20 6, 6 20, 6 40 C 6 58, 18 70, 30 80 L 40 88 L 50 80 C 62 70, 74 58, 74 40 C 74 20, 60 6, 40 6 Z"
                      fill="#d1d5db"
                    />
                    <text
                      x="40"
                      y="41"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="22"
                      style={{ pointerEvents: "none" }}
                    >
                      🔒
                    </text>
                  </svg>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Pulse ring for current active step */}
                    {i === currentStepIndex && !m.isCompleted && (
                      <svg
                        viewBox="0 0 80 102"
                        width={pinW + 14}
                        height={Math.round((pinW + 14) * (102 / 80))}
                        style={{
                          position: "absolute",
                          top: -7,
                          left: -7,
                          pointerEvents: "none",
                          overflow: "visible",
                          animation: "pulse-ring 2s ease-in-out infinite",
                          zIndex: 22,
                        }}
                      >
                        <path
                          d="M 40 2 C 18 2, 2 18, 2 40 C 2 60, 15 73, 28 83 L 40 92 L 52 83 C 65 73, 78 60, 78 40 C 78 18, 62 2, 40 2 Z"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                      </svg>
                    )}
                    <MilestoneNode milestone={m} index={i} />
                  </div>
                )}
              </div>

              {/* ── Label box ── */}
              <div
                onClick={() => handleToggle(m)}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  [isLeft ? "right" : "left"]: `calc(50% + ${pinW / 2 + 6}px)`,
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
                {/* Connector line */}
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
                      fontSize: 11,
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
                    <strong>
                      <span style={{ fontSize: 14 }}>✓ Completed</span>
                    </strong>
                  </div>
                )}

                {!(m.isUnlocked && m.isCompleted) && (
                  <div
                    style={{
                      fontSize: 11,
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
                    fontSize: "clamp(10px, 1.4vw, 11.5px)",
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

      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => {
              clearTimeout(championTimerRef.current);
              stopConfetti();
              setShowCompletionModal(false);
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px, 3vh, 24px)", // ✅ responsive spacing
              padding: "16px", // ✅ prevents edge clipping
              background: "rgba(10, 10, 20, 0.75)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              cursor: "pointer",
              textAlign: "center", // ✅ better mobile alignment
            }}
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                color: "#ffffff",
                fontSize: "clamp(22px, 5.5vw, 48px)", // ✅ slightly tighter for mobile
                fontWeight: 700,
                lineHeight: 1.2,
                textShadow: "0 2px 24px rgba(0,0,0,0.4)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              🎉 Congratulations on Getting Certified!
            </motion.div>

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                color: "#ffffff",
                fontSize: "clamp(13px, 3.5vw, 18px)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              Tap anywhere to continue
            </motion.p>

            {/* Lottie Animation */}
            <LottiePlayer
              animationData={championAnimation}
              loop={true}
              style={{
                width: "clamp(180px, 70vw, 420px)", // ✅ better scaling
                height: "auto", // ✅ prevents distortion
                maxHeight: "50vh", // ✅ avoids overflow on short screens
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-ring {
          0%   { opacity: 0.9; }
          50%  { opacity: 0.25; }
          100% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default RoadmapContainer;
