import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

/**
 * ModuleHeader
 *
 * Props:
 *   moduleName   – string
 *   onBack       – () => void  (navigates to /LearningPath)
 */
const ModuleHeader = ({ moduleName, onBack }) => {
  return (
    <div
      style={{
        width: "100%",
        padding: "28px 24px 0",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Back button ── */}
      <button
        onClick={onBack}
        aria-label="Back to all Modules"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "white",
          border: "1px solid #d1d5db",
          borderRadius: 9999,
          padding: "8px 18px",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "#374151",
          transition: "all 0.15s ease",
          marginBottom: 36,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.borderColor = "#9ca3af";
          e.currentTarget.style.color = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#374151";
        }}
      >
        <FaArrowLeft style={{ fontSize: 13 }} aria-hidden="true" />
        <span>All Modules</span>
        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
          }}
        >
          Return to the module list page
        </span>
      </button>

      {/* ── Module title + subtitle ── */}
      {moduleName && (
        <motion.div
          style={{ textAlign: "center", marginBottom: 40, padding: "0 8px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 42px)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #2563eb, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 10,
              userSelect: "none",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {moduleName}
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "clamp(14px, 2.2vw, 18px)",
              fontWeight: 400,
              userSelect: "none",
              fontFamily: "'Nunito', sans-serif",
              marginBottom: 12,
            }}
          >
            Explore the learning modules under this section
          </p>

          <div
            style={{
              height: 4,
              width: 80,
              margin: "0 auto",
              borderRadius: 9999,
              background: "linear-gradient(90deg, #3b82f6, #10b981)",
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ModuleHeader;
