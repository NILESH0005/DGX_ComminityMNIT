import React, { useState } from "react";
import { motion } from "framer-motion";

const MilestoneNode = ({ milestone, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.12 + 0.3, type: "spring", stiffness: 200 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: milestone.color,
        border: "4px solid white",
        boxShadow: hovered
          ? `0 0 0 6px ${milestone.color}44, 0 8px 24px ${milestone.color}66`
          : `0 4px 16px ${milestone.color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "scale(1.22)" : "scale(1)",
        flexShrink: 0,
        position: "relative",
        zIndex: 21,
        userSelect: "none",
      }}
    >
      <span
        style={{
          color: "white",
          fontWeight: 900,
          fontSize: 17,
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1,
        }}
      >
        {milestone.id}
      </span>
    </motion.div>
  );
};

export default MilestoneNode;
