import React, { useEffect, useState } from "react";

const Badges = ({ user, fetchData, onClose }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?.UserID) return;

      try {
        const response = await fetchData(
          `api/badges/show/${user.UserID}?category=Progress`, // ✅ added category
          "GET",
          {},
          { "Content-Type": "application/json" },
        );



        console.log("Badges response:", response);

        if (response?.success && response.data?.length > 0) {
          // only show badges not yet viewed
          const newBadges = response.data.filter((b) => b.isView === 0);
          setBadges(newBadges);
        } else {
          setBadges([]);
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
        setBadges([]);
      }
    };

    fetchBadges();

    // auto-close popup after 3 seconds
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, fetchData, onClose]);

  if (!badges || badges.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
        color: "#fff",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        🎉 New Badges Unlocked! 🎉
      </h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {badges.map((b) => {
          const imageSrc = b?.badge ? `data:image/png;base64,${b.badge}` : null;

          return (
            <div key={b.id} style={{ textAlign: "center" }}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={b.badge_name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    background: "#ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  No Image
                </div>
              )}
              <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                {b.badge_name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Badges;