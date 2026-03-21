import React, { useEffect, useState } from "react";
import { useUserBadges } from "../utils/userwiseBadges";

const UserBadges = ({ userId, compact = false }) => {
  console.log("UserBadges mounted");

  const { getUserBadges } = useUserBadges();

  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect running, userId:", userId);

    const loadBadges = async () => {
      if (!userId) {
        console.log("No userId found");
        setLoading(false);
        return;
      }

      console.log("Calling badge API...");

      setLoading(true);
      const data = await getUserBadges(userId);

      console.log("Mapped badges:", data);

      setBadges(data);
      setLoading(false);
    };

    loadBadges();
  }, [userId]);

  // ✅ LOADING SKELETON
  if (loading) {
    return (
      <div className={compact ? "flex gap-3" : "grid grid-cols-3 gap-4"}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`${
                compact ? "w-10 h-10" : "w-16 h-16"
              } bg-gray-300 rounded-full animate-pulse`}
            />
          </div>
        ))}
      </div>
    );
  }

  // ❌ NO BADGES CASE
  if (!badges.length) {
    return <p className="text-gray-500 text-sm">No badges</p>;
  }

  // ✅ COMPACT VIEW (HEADER)
  if (compact) {
    return (
      <div className="flex gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="relative group">
            <img
             src={`data:image/png;base64,${badge.image}`}
              alt={badge.name}
              className={`w-10 h-10 rounded-full ${
                badge.active ? "ring-2 ring-yellow-400" : "opacity-40"
              }`}
            />

            {/* Tooltip */}
            <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
              {badge.name}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ GRID VIEW
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div key={badge.id} className="text-center">
          <img
           src={`data:image/png;base64,${badge.image}`}   
            alt={badge.name}
            className={`w-16 h-16 mx-auto ${
              badge.active ? "" : "opacity-50"
            }`}
          />
          <p className="text-sm mt-1">{badge.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UserBadges