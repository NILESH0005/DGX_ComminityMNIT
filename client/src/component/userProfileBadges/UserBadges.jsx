import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMedal,
  FaTrophy,
  FaBolt,
  FaGraduationCap,
  FaAngleDown,
  FaLock,
  FaHandPointer,
} from "react-icons/fa";
import BadgeCard, { ICONS, TIERS } from "./BadgeCard";
import lmsBadgesData from "./badgesData.json";

const POINTS_PER_LEVEL = 250;

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "earned", label: "Earned" },
  { key: "locked", label: "In Progress" },
];

// Each LMS box gets its own colour theme (cycles if more LMS are added)
const THEMES = [
  "from-DGXblue to-DGXgreen", 
  "from-DGXgreen to-DGXblue"
];

const RING_SIZE = 84;
const RING_RADIUS = 34;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

/*
  `lmsList` is optional. Later pass the API response here, in this shape:
  [{ lmsId, lmsName, level, hours, badges: [{ id, name, description, category,
     tier, icon, points, earned, earnedOn, progress, target }] }]
*/
const UserBadges = ({ lmsList = lmsBadgesData }) => {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("All");
  const [openLms, setOpenLms] = useState({}); // { [lmsId]: true } -> expanded

  const allBadges = useMemo(
    () => lmsList.flatMap((lms) => lms.badges),
    [lmsList],
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(allBadges.map((b) => b.category)))],
    [allBadges],
  );

  const earnedCount = allBadges.filter((b) => b.earned).length;
  const totalPoints = allBadges
    .filter((b) => b.earned)
    .reduce((sum, b) => sum + b.points, 0);
  const level = Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
  const levelProgress =
    ((totalPoints % POINTS_PER_LEVEL) / POINTS_PER_LEVEL) * 100;
  const pointsToNext = POINTS_PER_LEVEL - (totalPoints % POINTS_PER_LEVEL);

  const matchesFilters = (b) => {
    const statusOk =
      status === "all" || (status === "earned" ? b.earned : !b.earned);
    const categoryOk = category === "All" || b.category === category;
    return statusOk && categoryOk;
  };

  const visibleSections = lmsList
    .map((lms, i) => ({
      ...lms,
      theme: THEMES[i % THEMES.length],
      visibleBadges: lms.badges.filter(matchesFilters),
    }))
    .filter((lms) => lms.visibleBadges.length > 0);

  const toggleLms = (id) =>
    setOpenLms((prev) => ({ ...prev, [id]: !prev[id] }));

  const pill = (active) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-DGXblue text-white shadow"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          My Badges
        </h2>
        <span className="px-3 py-1 bg-DGXgreen/20 text-DGXblue rounded-full text-sm font-medium">
          {earnedCount} / {allBadges.length} Earned
        </span>
      </div>

      

      {/* LMS boxes */}
      {visibleSections.length > 0 ? (
        <div className="space-y-6">
          {visibleSections.map((lms, sectionIndex) => {
            const earned = lms.badges.filter((b) => b.earned).length;
            const points = lms.badges
              .filter((b) => b.earned)
              .reduce((sum, b) => sum + b.points, 0);
            const percent = Math.round((earned / lms.badges.length) * 100);
            const isOpen = !!openLms[lms.lmsId];
            const ringOffset = RING_CIRC - (RING_CIRC * percent) / 100;

            return (
              <motion.div
                key={lms.lmsId}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Clickable LMS box */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleLms(lms.lmsId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleLms(lms.lmsId);
                    }
                  }}
                  className={`relative cursor-pointer select-none bg-gradient-to-br ${lms.theme} text-white p-5 sm:p-6 overflow-hidden`}
                >
                  {/* Decorations */}
                  <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/10" />
                  <div className="absolute right-24 -bottom-16 w-36 h-36 rounded-full bg-white/10" />
                  <div className="absolute left-1/3 -top-8 w-20 h-20 rounded-full bg-white/5" />

                  <div className="relative flex items-center gap-4 sm:gap-5">
                    {/* Progress ring */}
                    <div
                      className="relative flex-shrink-0"
                      style={{ width: RING_SIZE, height: RING_SIZE }}
                    >
                      <svg
                        width={RING_SIZE}
                        height={RING_SIZE}
                        className="-rotate-90"
                      >
                        <circle
                          cx={RING_SIZE / 2}
                          cy={RING_SIZE / 2}
                          r={RING_RADIUS}
                          fill="none"
                          stroke="rgba(255,255,255,0.25)"
                          strokeWidth="7"
                        />
                        <motion.circle
                          cx={RING_SIZE / 2}
                          cy={RING_SIZE / 2}
                          r={RING_RADIUS}
                          fill="none"
                          stroke="#fff"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={RING_CIRC}
                          initial={{ strokeDashoffset: RING_CIRC }}
                          animate={{ strokeDashoffset: ringOffset }}
                          transition={{ duration: 1.1, delay: 0.2 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <FaGraduationCap className="text-lg mb-0.5" />
                        <span className="text-sm font-bold leading-none">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    {/* Title + stats */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold leading-snug">
                        {lms.lmsName}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {lms.level && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur">
                            {lms.level}
                          </span>
                        )}
                        {lms.hours ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur">
                            {lms.hours} Hrs
                          </span>
                        ) : null}
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur">
                          {points} pts
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/90">
                        <span className="font-bold text-white">{earned}</span>{" "}
                        of {lms.badges.length} badges earned
                      </p>
                    </div>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                    >
                      <FaAngleDown className="text-xl" />
                    </motion.div>
                  </div>

                  {/* Mini badge preview */}
                  <div className="relative mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center">
                      {lms.badges.map((b, i) => {
                        const MiniIcon = ICONS[b.icon] || FaMedal;
                        const tier = TIERS[b.tier] || TIERS.bronze;
                        return (
                          <motion.div
                            key={b.id}
                            whileHover={{ y: -4, scale: 1.15 }}
                            title={b.name}
                            className={`relative w-9 h-9 rounded-full flex items-center justify-center border-2 border-white/80 shadow ${
                              i > 0 ? "-ml-2" : ""
                            } ${
                              b.earned
                                ? `bg-gradient-to-br ${tier.gradient}`
                                : "bg-gray-300"
                            }`}
                          >
                            {b.earned ? (
                              <MiniIcon className="text-white text-sm" />
                            ) : (
                              <FaLock className="text-gray-500 text-[11px]" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="hidden sm:flex items-center gap-1.5 text-xs text-white/90"
                    >
                      <FaHandPointer />
                      {isOpen ? "Tap to fold" : "Tap to unfold badges"}
                    </motion.span>
                  </div>
                </div>

                {/* Unfolding badge panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <div style={{ perspective: 1200 }}>
                      <motion.div
                        initial={{ rotateX: -90, opacity: 0, height: 0 }}
                        animate={{ rotateX: 0, opacity: 1, height: "auto" }}
                        exit={{ rotateX: -90, opacity: 0, height: 0 }}
                        transition={{ duration: 0.55, ease: "easeInOut" }}
                        style={{ transformOrigin: "top center" }}
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {lms.visibleBadges.map((badge, index) => (
                            <BadgeCard
                              key={badge.id}
                              badge={badge}
                              index={index}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No badges match this filter.</p>
        </div>
      )}
    </div>
  );
};

export default UserBadges;