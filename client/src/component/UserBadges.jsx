import React, { useEffect, useState } from "react";
import { useUserBadges } from "../utils/userwiseBadges";

const UserBadges = ({ userId, compact = false, onAllBadgesUnlocked }) => {
  const { getUserBadges } = useUserBadges();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getUserBadges(userId);
      setBadges(data);
      setLoading(false);

      // Fire callback only when every badge is active/unlocked
      if (data.length > 0 && data.every((badge) => badge.active)) {
        onAllBadgesUnlocked?.();
      }
    };
    loadBadges();
  }, [userId]);

  // LOADING SKELETON
  if (loading) {
    return (
      <div className={compact ? "flex gap-3" : "grid grid-cols-3 gap-4"}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`${
                compact ? "w-10 h-10" : "w-16 h-16"
              } bg-gray-300 rounded-full animate-pulse`}
            />
            {!compact && <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />}
          </div>
        ))}
      </div>
    );
  }

  // NO BADGES
  if (!badges.length) {
    return <p className="text-gray-500 text-sm">No badges available</p>;
  }

  // COMPACT VIEW
  if (compact) {
    return (
      <div className="flex gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="relative group">
            <div className="relative">
              <img
                src={`data:image/png;base64,${badge.image}`}
                alt={badge.name}
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  badge.active
                    ? "ring-2 ring-yellow-400"
                    : "opacity-30 grayscale"
                }`}
              />
              {/* Lock icon overlay for locked badges */}
              {!badge.active && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs">🔒</span>
                </div>
              )}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-[-34px] left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
              {badge.active ? badge.name : `🔒 ${badge.name}`}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // GRID VIEW — full locked/unlocked treatment
  const unlockedCount = badges.filter((b) => b.active).length;

  return (
    <div className="w-full">
      {/* Progress summary */}
      <div className="mb-3 px-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{unlockedCount} / {badges.length} unlocked</span>
          {unlockedCount === badges.length && (
            <span className="text-yellow-500 font-semibold">🎉 All unlocked!</span>
          )}
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
              badge.active
                ? "bg-yellow-50 border border-yellow-200 shadow-sm"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            {/* Badge image */}
            <div className="relative">
              <img
                src={`data:image/png;base64,${badge.image}`}
                alt={badge.name}
                className={`w-14 h-14 mx-auto transition-all duration-300 ${
                  badge.active
                    ? "drop-shadow-md"
                    : "opacity-25 grayscale"
                }`}
              />
              {/* Lock overlay */}
              {!badge.active && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-400/80 rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-xs">🔒</span>
                  </div>
                </div>
              )}
              {/* Unlocked glow ring */}
              {badge.active && (
                <div className="absolute -inset-1 rounded-full ring-2 ring-yellow-300 ring-offset-1 opacity-60" />
              )}
            </div>

            {/* Badge name */}
            <p
              className={`text-xs mt-2 text-center font-medium leading-tight ${
                badge.active ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {badge.name}
            </p>

            {/* Status label */}
            <span
              className={`mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                badge.active
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {badge.active ? "✓ Unlocked" : "Locked"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBadges;