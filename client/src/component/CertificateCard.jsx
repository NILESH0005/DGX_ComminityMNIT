import React from "react";

const CertificateCard = ({ userName = "User", moduleName = "Module" }) => {
  return (
    <div
      style={{
        width: 180,
        height: 120,
        background: "linear-gradient(135deg, #fdfcfb, #e2d1c3)",
        borderRadius: 12,
        padding: 10,
        textAlign: "center",
        fontFamily: "serif",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        border: "2px solid #d4af37",
      }}
    >
      <h4 style={{ fontSize: 10, marginBottom: 4 }}>
        Certificate of Completion
      </h4>

      <p style={{ fontSize: 8, margin: 0 }}>This certifies that</p>

      <h3 style={{ fontSize: 12, margin: "4px 0", color: "#2d3748" }}>
        {userName}
      </h3>

      <p style={{ fontSize: 8, margin: 0 }}>has completed</p>

      <p style={{ fontSize: 9, fontWeight: "bold", margin: "2px 0" }}>
        {moduleName}
      </p>

      <p style={{ fontSize: 7, marginTop: 4 }}>🎉 Congratulations 🎉</p>
    </div>
  );
};

export default CertificateCard;
