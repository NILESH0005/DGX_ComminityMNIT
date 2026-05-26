// components/ModuleStats.jsx (updated to work with dynamic data)
import React from "react";
import { FaEye, FaClock, FaStar, FaUsers } from "react-icons/fa";

const ModuleStats = ({ stats }) => {
  const { views = 0, duration = 0, rating = 0, totalRatings = 0 } = stats || {};

  // Format duration from seconds to readable format
  const formatTimeSmart = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0m";

    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${totalSeconds}s`;
  };

  // Format view count (e.g., 12.4k)
  const formatViews = (viewCount) => {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`;
    }
    if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}k`;
    }
    return viewCount.toString();
  };

  // Render star rating with partial fill support
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <FaStar className="text-gray-300 text-xs absolute" />
            <FaStar
              className="text-yellow-400 text-xs"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300 text-xs" />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        {/* Views */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <FaEye className="text-indigo-400" />
          <span className="font-medium">{formatViews(views)}</span>
          <span className="hidden sm:inline">views</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <FaClock className="text-purple-400" />
          <span className="font-medium">{formatTimeSmart(duration)}</span>
          <span className="hidden sm:inline">duration</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <FaUsers className="text-purple-400" />
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-700">
              {(rating ?? 0).toFixed(1)}
            </span>
            {renderStars()}
            <span className="text-gray-400 text-xs ml-0.5">
              ({totalRatings.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleStats;