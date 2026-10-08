import React from "react";
import { motion } from "framer-motion";
import {
  FaLock,
  FaRocket,
  FaBook,
  FaGraduationCap,
  FaCommentDots,
  FaStar,
  FaPenNib,
  FaBrain,
  FaTrophy,
  FaFire,
  FaCalendarCheck,
  FaMedal,
  FaCrown,
} from "react-icons/fa";
import moment from "moment";

export const ICONS = {
  rocket: FaRocket,
  book: FaBook,
  graduation: FaGraduationCap,
  comments: FaCommentDots,
  star: FaStar,
  pen: FaPenNib,
  brain: FaBrain,
  trophy: FaTrophy,
  fire: FaFire,
  calendar: FaCalendarCheck,
  medal: FaMedal,
  crown: FaCrown,
};

export const TIERS = {
  bronze: {
    label: "Bronze",
    gradient: "from-amber-500 to-orange-700",
    ring: "#d97706",
    glow: "shadow-amber-500/40",
    chip: "bg-amber-100 text-amber-700",
  },
  silver: {
    label: "Silver",
    gradient: "from-slate-300 to-slate-500",
    ring: "#64748b",
    glow: "shadow-slate-400/40",
    chip: "bg-slate-100 text-slate-700",
  },
  gold: {
    label: "Gold",
    gradient: "from-yellow-300 to-amber-500",
    ring: "#f59e0b",
    glow: "shadow-yellow-400/50",
    chip: "bg-yellow-100 text-yellow-700",
  },
  platinum: {
    label: "Platinum",
    gradient: "from-cyan-300 via-sky-400 to-indigo-500",
    ring: "#6366f1",
    glow: "shadow-indigo-400/50",
    chip: "bg-indigo-100 text-indigo-700",
  },
};

const SIZE = 104;
const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BadgeCard = ({ badge, index = 0 }) => {
  const tier = TIERS[badge.tier] || TIERS.bronze;
  const Icon = ICONS[badge.icon] || FaMedal;
  const percent = Math.min(
    100,
    Math.round((badge.progress / (badge.target || 1)) * 100),
  );
  const ringPercent = badge.earned ? 100 : percent;
  const dashOffset = CIRCUMFERENCE - (CIRCUMFERENCE * ringPercent) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -6 }}
      className={`relative flex flex-col items-center text-center p-5 pt-6 rounded-2xl bg-white border border-gray-100 overflow-hidden transition-shadow duration-300 ${
        badge.earned
          ? `shadow-lg hover:shadow-2xl ${tier.glow}`
          : "shadow-sm hover:shadow-md"
      }`}
    >
      {/* Top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          badge.earned
            ? "bg-gradient-to-r from-DGXblue via-DGXgreen to-DGXblue"
            : "bg-gray-200"
        }`}
      />

      {/* Medallion */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="5"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={tier.ring}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
          />
        </svg>

        <div
          className={`absolute inset-3 rounded-full flex items-center justify-center overflow-hidden ${
            badge.earned
              ? `bg-gradient-to-br ${tier.gradient} shadow-inner`
              : "bg-gray-100"
          }`}
        >
          <Icon
            className={`text-3xl ${
              badge.earned ? "text-white drop-shadow" : "text-gray-300"
            }`}
          />

          {/* Shine sweep for earned badges */}
          {badge.earned && (
            <motion.div
              className="absolute top-0 bottom-0 w-6 bg-white/40 -skew-x-12"
              initial={{ left: "-40%" }}
              animate={{ left: "140%" }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          )}
        </div>

        {!badge.earned && (
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center border-2 border-white">
            <FaLock className="text-[10px]" />
          </div>
        )}
      </div>

      {/* Text */}
      <h3
        className={`mt-4 text-base font-semibold leading-snug ${
          badge.earned ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {badge.name}
      </h3>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.25rem]">
        {badge.description}
      </p>

      {/* Tier + points */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${tier.chip}`}
        >
          {tier.label}
        </span>
        <span className="text-[11px] font-semibold text-gray-600">
          +{badge.points} pts
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 w-full">
        {badge.earned ? (
          <p className="text-[11px] text-gray-500">
            Earned on{" "}
            <span className="font-medium text-gray-700">
              {badge.earnedOn
                ? moment(badge.earnedOn).format("MMM D, YYYY")
                : "-"}
            </span>
          </p>
        ) : (
          <div>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-gray-700">
                {badge.progress} / {badge.target}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-DGXblue to-DGXgreen"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BadgeCard;