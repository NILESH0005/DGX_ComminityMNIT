import React, { useEffect, useState } from "react";
import { useUserBadges } from "../utils/userwiseBadges";
import { FaWhatsapp, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
const UserBadges = ({ userId, compact = false, onAllBadgesUnlocked }) => {
  const { getUserBadges } = useUserBadges();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

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

      if (data.length > 0 && data.every((badge) => badge.active)) {
        onAllBadgesUnlocked?.();
      }
    };
    loadBadges();
  }, [userId]);

  const shareBadgeImage = async (badge) => {
    try {
      const base64 = `data:image/png;base64,${badge.image}`;

      const res = await fetch(base64);
      const blob = await res.blob();

      const file = new File([blob], `${badge.name}.png`, {
        type: blob.type,
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: badge.name,
          text: `🏆 I just unlocked "${badge.name}"!`,
          files: [file],
        });
      } else {
        // fallback → download
        const link = document.createElement("a");
        link.href = base64;
        link.download = `${badge.name}.png`;
        link.click();
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

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
            {!compact && (
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            )}
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
              {badge.active && (
                <button
                  onClick={() => setSelectedBadge(badge)}
                  className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-1 shadow hover:scale-110"
                >
                  🔗
                </button>
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
          <span>
            {unlockedCount} / {badges.length} unlocked
          </span>
          {unlockedCount === badges.length && (
            <span className="text-yellow-500 font-semibold">
              🎉 All unlocked!
            </span>
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
                  badge.active ? "drop-shadow-md" : "opacity-25 grayscale"
                }`}
              />

              {/* ✅ ADD THIS */}
              {badge.active && (
                <button
                  onClick={() => setSelectedBadge(badge)}
                  className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-1 shadow hover:scale-110"
                >
                  🔗
                </button>
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

      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-white p-5 rounded-xl shadow-lg w-[300px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3">Share Badge 🎉</h3>

            <p className="text-sm mb-3">{selectedBadge.name}</p>

            {/* ✅ DEFINE VARIABLES HERE */}
            {(() => {
              const text = `🏆 I just unlocked "${selectedBadge.name}" on DGX Learning Platform! 🚀`;
              const url = `${window.location.origin}/badge/${selectedBadge.id}`;

              console.log(url);

              return (
                <div className="flex flex-col gap-3 mt-3">
                  {/* ✅ SHARE IMAGE BUTTON */}
                  <button
                    onClick={() => shareBadgeImage(selectedBadge)}
                    className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  >
                    📤 Share Badge Image
                  </button>

                  {/* OPTIONAL: KEEP OLD LINK SHARING */}
                  <div className="flex justify-around mt-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(selectedBadge.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500"
                    >
                      <FaWhatsapp size={24} />
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-4 text-sm text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadges;
