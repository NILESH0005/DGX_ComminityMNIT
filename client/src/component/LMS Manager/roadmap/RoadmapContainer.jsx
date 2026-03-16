import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import RoadPathSVG, { SVG_W, SVG_H, buildRoadPoints } from "./RoadPathSVG";
import MilestoneNode from "./MilestoneNode";
import MilestoneCard from "./MilestoneCard";

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
 * Auto-scroll:
 *   On mount, scrolls to the "current" milestone (first unlocked+incomplete,
 *   or last completed if all done) and centres it in the viewport.
 */
const RoadmapContainer = ({
  milestones = [],
  onMilestoneNavigate,
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
  const [activeId, setActiveId] = useState(null);

  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const layerRef = useRef(null);

  // One ref per anchor so we can scroll to the current step
  const anchorRefs = useRef([]);

  const pts = buildRoadPoints(milestones.length);

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

  // ── Auto-scroll to current step on mount ─────────────────────────────────

  useEffect(() => {
    if (!milestones.length) return;

    // Determine the "current" milestone index:
    //   1. First milestone that is unlocked but NOT yet completed  → in-progress step
    //   2. If all are completed, use the last one
    //   3. Fallback: first milestone
    let targetIndex = milestones.findIndex(
      (m) => m.isUnlocked && !m.isCompleted,
    );
    if (targetIndex === -1) {
      // All completed – scroll to the last one
      const lastCompleted = milestones.reduce((acc, m, i) => {
        return m.isCompleted ? i : acc;
      }, -1);
      targetIndex = lastCompleted !== -1 ? lastCompleted : 0;
    }

    // Wait for positioning to settle, then scroll
    const scrollTimer = setTimeout(() => {
      const anchorEl = anchorRefs.current[targetIndex];
      if (!anchorEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const anchorCenterY = anchorRect.top + anchorRect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const scrollDelta = anchorCenterY - viewportCenter;

      window.scrollBy({
        top: scrollDelta,
        behavior: "smooth",
      });
    }, 200); // slight delay so positionNodes has run first

    return () => clearTimeout(scrollTimer);
  }, []); // run once on mount

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
    setActiveId((prev) => (prev === milestone.id ? null : milestone.id));
  };

  // ── Shared label-box style helpers ────────────────────────────────────────

  const getLabelBoxStyle = (m, isOpen) => {
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
        background: isOpen ? "#d1fae5" : "#f0fdf4",
        border: `2px solid ${isOpen ? "#10b981" : "#6ee7b7"}`,
        cursor: "pointer",
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? "none" : "auto",
        boxShadow: "0 2px 8px #10b98122",
      };
    }
    return {
      background: isOpen ? m.color : m.bg,
      border: `2px solid ${m.color}`,
      cursor: "pointer",
      opacity: isOpen ? 0 : 1,
      pointerEvents: isOpen ? "none" : "auto",
      boxShadow: isOpen ? `0 4px 16px ${m.color}55` : `0 2px 8px ${m.color}22`,
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
      {/* SVG road */}
      <div ref={svgRef} style={{ width: "100%", display: "block" }}>
        <RoadPathSVG milestones={milestones} />
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
          const isOpen = activeId === m.id && m.isUnlocked;
          const subModuleId = m._cardProps?.subModule?.SubModuleID;
          const isExpanded = subModuleId
            ? !!expandedDescriptions[subModuleId]
            : false;
          const labelBoxStyle = getLabelBoxStyle(m, isOpen);

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
                zIndex: isOpen ? 25 : 20,
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
                {/* Locked overlay on node */}
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
                  /* Completed green ring wrapper */
                  <div
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {m.isCompleted && (
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
                    {/* Completed tick badge */}
                    {m.isCompleted && (
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
                    )}
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
                  width: "clamp(115px, 20vw, 175px)",
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

                {/* Lock icon inside label box if locked */}
                {!m.isUnlocked && (
                  <div style={{ fontSize: 9, marginBottom: 2, opacity: 0.6 }}>
                    🔒 Locked
                  </div>
                )}

                {/* Completed badge inside label box */}
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

                {/* Tag */}
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

                {/* Title */}
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

              {/* ── Full detail card (unlocked steps only) ── */}
              {m.isUnlocked && (
                <MilestoneCard
                  milestone={m}
                  side={side}
                  index={i}
                  isOpen={isOpen}
                  onNavigate={() =>
                    onMilestoneNavigate && onMilestoneNavigate(m)
                  }
                  onToggleDesc={toggleDescription}
                  isExpanded={isExpanded}
                  hoverRatings={hoverRatings}
                  setHoverRatings={setHoverRatings}
                  ratingLoading={ratingLoading}
                  ratingsLoaded={ratingsLoaded}
                  rateSubModule={rateSubModule}
                  handleStarClickWhenRated={handleStarClickWhenRated}
                  showRatingInfo={showRatingInfo}
                  renderImage={renderImage}
                  formatTime={formatTime}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pulse ring animation for completed steps */}
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
