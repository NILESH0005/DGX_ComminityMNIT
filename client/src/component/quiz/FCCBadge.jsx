// src/components/quiz/FCCBadge.jsx

import React, { useEffect, useState, useContext } from "react";
import ApiContext from "../../context/ApiContext";

const FCCBadge = ({ userId }) => {
  const { fetchData, userToken,user } = useContext(ApiContext);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFCCBadges = async () => {
    try {
      if (!userId) return;

      const res = await fetchData(`api/fccbadges/${user.UserID}`, "GET", null, {
        "Content-Type": "application/json",
        "auth-token": userToken,
      });

      if (res?.success) {
        setBadges(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Badge fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFCCBadges();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading badges...</p>;
  }

  if (!badges.length) {
    return (
      <p className="text-center text-gray-400">
        No badges earned yet
      </p>
    );
  }

  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold mb-4">
        🏅 Your Achievement Badges
      </h3>

      <div className="flex justify-center gap-4 flex-wrap">
        {badges.map((badge) => {
          const imageSrc = badge.badge?.startsWith("data:")
            ? badge.badge
            : `data:image/png;base64,${badge.badge}`;

          return (
            <div
              key={badge.id}
              className="flex flex-col items-center bg-white border rounded-xl shadow-md p-4"
            >
              <img
                src={imageSrc}
                alt={badge.badge_name}
                className="w-28 h-28 object-contain"
              />

              <h3 className="mt-3 font-semibold text-gray-800 text-center">
                {badge.badge_name}
              </h3>

              <p className="text-sm text-gray-500">
                {badge.badge_category}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {badge.achievedOn
                  ? new Date(badge.achievedOn).toLocaleDateString()
                  : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FCCBadge;