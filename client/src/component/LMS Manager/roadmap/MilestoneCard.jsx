import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAngleDown,
  FaAngleUp,
  FaClock,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaUsers,
  FaPlayCircle,
} from "react-icons/fa";

/**
 * MilestoneCard
 *
 * Shown/hidden via isOpen (toggled by clicking the node in RoadmapContainer).
 * Clicking the card body navigates into the submodule via onNavigate.
 *
 * Props:
 *   milestone        – full milestone object (id, color, bg, title, tag, _cardProps)
 *   side             – "left" | "right"
 *   index            – number
 *   isOpen           – boolean
 *   onNavigate       – () => void
 *   onToggleDesc     – (id, e) => void
 *   isExpanded       – boolean
 *   hoverRatings     – object
 *   setHoverRatings  – fn
 *   ratingLoading    – boolean
 *   ratingsLoaded    – boolean
 *   rateSubModule    – fn
 *   handleStarClickWhenRated – fn
 *   showRatingInfo   – fn
 *   renderImage      – fn(subModule) → JSX
 *   formatTime       – fn
 */
const MilestoneCard = ({
  milestone,
  side,
  index,
  isOpen,
  onNavigate,
  onToggleDesc,
  isExpanded,
  hoverRatings,
  setHoverRatings,
  ratingLoading,
  ratingsLoaded,
  rateSubModule,
  handleStarClickWhenRated,
  showRatingInfo,
  renderImage,
  formatTime,
}) => {
  const isLeft = side === "left";
  const cp = milestone._cardProps;
  if (!cp) return null;

  const {
    subModule,
    totalTimeSpent,
    totalViews,
    avgRating,
    myRating,
    totalRatings,
    progressPercentage,
    palette,
  } = cp;

  const isRated = ratingsLoaded && myRating !== null && myRating !== undefined;

  const descriptionVariants = {
    collapsed: { height: 54, opacity: 0.85, transition: { duration: 0.3 } },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="expanded-card"
          initial={{ opacity: 0, scale: 0.86, x: isLeft ? 20 : -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.86, x: isLeft ? 20 : -20 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={onNavigate}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            [isLeft ? "right" : "left"]: "calc(50% + 36px)",
            width: "clamp(260px, 34vw, 330px)",
            background: "white",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: `0 10px 36px ${milestone.color}33, 0 2px 8px rgba(0,0,0,0.08)`,
            border: `2px solid ${milestone.color}`,
            cursor: "pointer",
            zIndex: 30,
          }}
        >
          {/* Connector line to the road node */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              [isLeft ? "left" : "right"]: "100%",
              width: 28,
              height: 2,
              background: milestone.color,
              transform: "translateY(-50%)",
              zIndex: 31,
            }}
          />

          {/* Accent bar */}
          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}99)`,
            }}
          />

          {/* Image */}
          <div
            style={{
              height: 130,
              background: "#f3f4f6",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {renderImage(subModule)}

            {totalTimeSpent > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: "rgba(255,255,255,0.3)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercentage}%`,
                    background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}cc)`,
                    transition: "width 1s ease-out",
                  }}
                />
              </div>
            )}

            {/* Step badge */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: milestone.color,
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 11,
                fontWeight: 900,
                fontFamily: "'Nunito', sans-serif",
                boxShadow: `0 2px 6px ${milestone.color}66`,
              }}
            >
              {milestone.id}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "12px 14px" }}>
            {/* Title */}
            <h3
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#1a202c",
                fontFamily: "'Nunito', sans-serif",
                lineHeight: 1.3,
                marginBottom: 8,
                wordBreak: "break-word",
              }}
            >
              {subModule.SubModuleName}
            </h3>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 11,
                  color: "#4b5563",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <FaEye style={{ color: "#60a5fa", fontSize: 11 }} />
                  <span style={{ fontWeight: 600 }}>{totalViews}</span> views
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <FaClock style={{ color: "#34d399", fontSize: 11 }} />
                  <span style={{ fontWeight: 600 }}>
                    {formatTime(totalTimeSpent)}
                  </span>
                </span>
              </div>

              {/* Avg rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  cursor: "pointer",
                  fontSize: 11,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  showRatingInfo(
                    subModule.SubModuleID,
                    subModule.SubModuleName,
                    myRating,
                  );
                }}
                title="Click for rating details"
              >
                <FaUsers style={{ color: "#c084fc", fontSize: 11 }} />
                <span style={{ fontWeight: 700, color: "#374151" }}>
                  {avgRating.toFixed(1)}
                </span>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const r = avgRating;
                    if (star <= Math.floor(r))
                      return (
                        <FaStar
                          key={star}
                          style={{ fontSize: 9, color: "#facc15" }}
                        />
                      );
                    if (star === Math.ceil(r) && r % 1 > 0)
                      return (
                        <div key={star} style={{ position: "relative" }}>
                          <FaStar
                            style={{
                              fontSize: 9,
                              color: "#d1d5db",
                              position: "absolute",
                            }}
                          />
                          <FaStar
                            style={{
                              fontSize: 9,
                              color: "#facc15",
                              clipPath: `inset(0 ${100 - (r % 1) * 100}% 0 0)`,
                            }}
                          />
                        </div>
                      );
                    return (
                      <FaStar
                        key={star}
                        style={{ fontSize: 9, color: "#d1d5db" }}
                      />
                    );
                  })}
                </div>
                <span style={{ color: "#9ca3af", fontSize: 10 }}>
                  ({totalRatings})
                </span>
              </div>
            </div>

            {/* My rating row */}
            <div
              style={{
                marginBottom: 10,
                padding: "8px 10px",
                background: "linear-gradient(135deg, #f9fafb, #eff6ff)",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const displayRating = isRated
                      ? myRating
                      : hoverRatings[subModule.SubModuleID] || 0;
                    const isFilled = star <= displayRating;
                    const isPartial =
                      star > displayRating && star - 1 < displayRating;
                    return (
                      <motion.button
                        key={star}
                        whileHover={
                          !isRated && !ratingLoading ? { scale: 1.25 } : {}
                        }
                        whileTap={
                          !isRated && !ratingLoading ? { scale: 0.9 } : {}
                        }
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor:
                            isRated || ratingLoading ? "default" : "pointer",
                          color: isFilled
                            ? "#facc15"
                            : isPartial
                              ? "#facc15"
                              : "#d1d5db",
                          opacity: isPartial ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          if (!isRated && !ratingLoading)
                            setHoverRatings((p) => ({
                              ...p,
                              [subModule.SubModuleID]: star,
                            }));
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          if (!isRated && !ratingLoading)
                            setHoverRatings((p) => ({
                              ...p,
                              [subModule.SubModuleID]: 0,
                            }));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isRated) {
                            handleStarClickWhenRated(
                              subModule.SubModuleID,
                              subModule.SubModuleName,
                              myRating,
                            );
                            return;
                          }
                          if (!ratingLoading)
                            rateSubModule(
                              subModule.SubModuleID,
                              star,
                              subModule.SubModuleName,
                            );
                        }}
                        disabled={isRated || ratingLoading}
                      >
                        {isPartial ? (
                          <div
                            style={{
                              position: "relative",
                              width: 15,
                              height: 15,
                            }}
                          >
                            <FaStar
                              style={{
                                fontSize: 15,
                                color: "#d1d5db",
                                position: "absolute",
                              }}
                            />
                            <FaStar
                              style={{
                                fontSize: 15,
                                color: "#facc15",
                                clipPath: "inset(0 50% 0 0)",
                              }}
                            />
                          </div>
                        ) : (
                          <FaStar style={{ fontSize: 15 }} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                {isRated && (
                  <>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#374151",
                      }}
                    >
                      {myRating}/5
                    </span>
                    <FaCheckCircle style={{ color: "#22c55e", fontSize: 11 }} />
                  </>
                )}
                {!isRated && (
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>
                    Rate once only
                  </span>
                )}
              </div>
            </div>

            {/* Description with expand/collapse */}
            <motion.div
              style={{
                overflow: "hidden",
                color: "#4b5563",
                fontSize: 12,
                marginBottom: 10,
                fontFamily: "'Nunito', sans-serif",
              }}
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={descriptionVariants}
            >
              <p
                style={{
                  lineHeight: 1.5,
                  display: !isExpanded ? "-webkit-box" : "block",
                  WebkitLineClamp: !isExpanded ? 3 : "unset",
                  WebkitBoxOrient: "vertical",
                  overflow: !isExpanded ? "hidden" : "visible",
                }}
              >
                {subModule.SubModuleDescription || "No description available."}
              </p>
              {subModule.SubModuleDescription &&
                subModule.SubModuleDescription.length > 80 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDesc(subModule.SubModuleID, e);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3b82f6",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "'Nunito', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      marginTop: 4,
                      padding: 0,
                    }}
                  >
                    {isExpanded ? (
                      <>
                        <FaAngleUp style={{ fontSize: 10 }} /> Show Less
                      </>
                    ) : (
                      <>
                        <FaAngleDown style={{ fontSize: 10 }} /> Read More
                      </>
                    )}
                  </button>
                )}
            </motion.div>

            {/* Open Module CTA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 14px",
                background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}cc)`,
                borderRadius: 10,
                color: "white",
                fontWeight: 800,
                fontSize: 12,
                fontFamily: "'Nunito', sans-serif",
                boxShadow: `0 3px 10px ${milestone.color}55`,
              }}
            >
              <FaPlayCircle style={{ fontSize: 13 }} />
              Open Module
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneCard;
