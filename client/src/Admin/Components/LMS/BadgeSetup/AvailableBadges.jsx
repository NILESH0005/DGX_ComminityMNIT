import React from "react";

const AvailableBadges = ({ 
  badges, 
  loading, 
  onAssign, 
  onBadgeClick, 
  saving,
  assignedBadgeIds = [] // ✅ New prop: list of already assigned BadgeIDs
}) => {
  // Check if a badge is already assigned
  const isBadgeAssigned = (badgeId) => {
    return assignedBadgeIds.includes(badgeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 rounded-t-lg flex justify-between items-center">
        <h5 className="font-bold mb-0 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" />
          </svg>
          Available Badges
        </h5>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {badges.filter(b => !isBadgeAssigned(b.BadgeID)).length} available
          </span>
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badges.length}
          </span>
        </div>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading badges...</p>
          </div>
        ) : badges.length === 0 ? (
          <div className="text-center py-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-500 mt-2">No available badges</p>
            <p className="text-gray-400 text-sm">All badges are assigned</p>
          </div>
        ) : (
          <div className="space-y-2">
            {badges.map((badge) => {
              const assigned = isBadgeAssigned(badge.BadgeID);
              
              return (
                <div 
                  key={badge.BadgeID} 
                  className={`flex items-center p-2 border rounded-lg transition-all duration-200 ${
                    assigned 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                      : 'border-gray-200 hover:shadow-md hover:border-blue-300 cursor-pointer'
                  }`}
                  onClick={() => !assigned && onBadgeClick(badge)}
                >
                  <div className="flex-shrink-0 mr-3 w-12 h-12">
                    {badge.BadgeIcon ? (
                      <img 
                        src={badge.BadgeIcon} 
                        alt={badge.BadgeName}
                        className="w-full h-full object-contain rounded-full border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {/* ✅ Show "Assigned" badge on the image */}
                    {assigned && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] rounded-full px-1.5 py-0.5 font-bold">
                        ✓
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h6 className={`font-bold mb-0 truncate ${assigned ? 'text-gray-500' : ''}`}>
                        {badge.BadgeName}
                      </h6>
                      {assigned && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Mapped
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {badge.BadgeDescription || "AI achievement unlocked."}
                    </p>
                    <div className="text-xs text-gray-400">
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {badge.BadgeCategory || "General"}
                      </span>
                      {badge.BadgeCode && (
                        <span className="ml-2 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                          {badge.BadgeCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ✅ Assign button - disabled if already assigned */}
                  <button
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200 ${
                      assigned 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300' 
                        : 'text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!assigned) {
                        onAssign(badge);
                      }
                    }}
                    disabled={assigned || saving}
                    title={assigned ? "Already assigned to this module" : "Assign this badge"}
                  >
                    {assigned ? (
                      <>
                        <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Mapped
                      </>
                    ) : (
                      <>
                        <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Assign
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableBadges;