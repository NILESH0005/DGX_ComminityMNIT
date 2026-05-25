import React, { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";

export default function BadgeSection() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllBadges, setShowAllBadges] = useState(false);

  const { fetchData } = useContext(ApiContext);

  const badgeMeta = {
    "AI Guardian": {
      desc: "Awarded for understanding Responsible AI and ethical AI practices.",
      xp: "500 XP",
      level: "Responsible AI",
    },

    "Pattern Explorer": {
      desc: "Recognizes learners exploring Machine Learning concepts.",
      xp: "700 XP",
      level: "Machine Learning",
    },

    "Peak Runner": {
      desc: "Awarded for achieving the highest learning streak.",
      xp: "1000 XP",
      level: "Highest Streak",
    },

    "Future Learner": {
      desc: "Given to students exploring future AI technologies.",
      xp: "900 XP",
      level: "Future AI",
    },

    "Logic Beginner": {
      desc: "Awarded for completing foundational AI basics.",
      xp: "250 XP",
      level: "Foundations",
    },

    "First Spark": {
      desc: "Awarded after completing the first AI module.",
      xp: "100 XP",
      level: "First Module Completion",
    },

    "AI Beginner": {
      desc: "Awarded on first login to the AI platform.",
      xp: "50 XP",
      level: "First Login",
    },

    "AI Sprinter": {
      desc: "Recognizes quick learners completing early milestones.",
      xp: "450 XP",
      level: "First Finisher",
    },

    "Domain Explorer": {
      desc: "Awarded for exploring multiple AI domains.",
      xp: "600 XP",
      level: "Domains",
    },

    "AI Achiever": {
      desc: "Awarded for successfully completing the full AI course.",
      xp: "2500 XP",
      level: "Course Completion",
    },

    "AI User": {
      desc: "Recognizes students mastering practical AI tools.",
      xp: "400 XP",
      level: "AI Tools",
    },

    "Flow Runner": {
      desc: "Awarded for maintaining a 7-day learning streak.",
      xp: "700 XP",
      level: "7-Day Streak",
    },

    "AI Progressor": {
      desc: "Awarded after reaching 50% course completion.",
      xp: "1200 XP",
      level: "50% Completion",
    },

    "AI Starter": {
      desc: "Awarded after reaching 25% completion.",
      xp: "500 XP",
      level: "25% Completion",
    },

    "AI Finisher": {
      desc: "Awarded for achieving 100% completion.",
      xp: "5000 XP",
      level: "100% Completion",
    },
  };

  const fetchBadges = async () => {
    try {
      setLoading(true);

      const response = await fetchData("badgesapi/badges", "GET");

      console.log("BADGES API:", response);

      if (response?.success) {
        setBadges(response.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-20">Loading badges...</div>
    );
  }

  const displayedBadges = showAllBadges ? badges : badges.slice(0, 3);

  return (
    <section className="relative py-24 px-6 md:px-12 bg-gradient-to-b from-white to-[#f5faf7] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#76B900]/5 rounded-full blur-[120px]" />

      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#013D54]/5 rounded-full blur-[100px]" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-[#76B900]/10 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full animate-pulse" />
          AI ACHIEVEMENT SYSTEM
        </div>

        <h2
          className="text-4xl md:text-5xl font-black text-[#013D54] mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Earn AI Badges & Milestones
        </h2>

        <p className="text-[#6b7280] text-lg leading-relaxed">
          Unlock achievement-based AI badges through learning pathways,
          challenges, streaks, milestones, and AI innovation activities.
        </p>
      </div>

      {/* Badge Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {displayedBadges.map((badge, index) => {
          const meta = badgeMeta[badge.badge_name] || {};

          return (
            <div
              key={badge.id || index}
              className="group relative bg-white rounded-[30px] border border-[#013D54]/8 p-8 shadow-lg shadow-[#013D54]/5 hover:shadow-2xl hover:shadow-[#013D54]/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#76B900]/5 to-cyan-500/5" />

              {/* Content */}
              <div className="relative z-10">
                {/* Badge Image */}
                <div className="w-28 h-28 rounded-[28px] overflow-hidden mb-6 bg-[#f8faf5] border border-[#013D54]/6 p-4 mx-auto">
                  <img
                    src={`data:image/png;base64,${badge.badge}`}
                    alt={badge.badge_name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Level */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center bg-[#76B900]/10 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-3 py-1 rounded-full">
                    {meta.level || "AI Badge"}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold text-[#013D54] mb-3 text-center"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {badge.badge_name}
                </h3>

                {/* Description */}
                <p className="text-[#6b7280] text-sm leading-relaxed mb-6 text-center min-h-[72px]">
                  {meta.desc || "AI achievement unlocked."}
                </p>

                {/* XP */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#76B900]" />

                  <span className="text-[#76B900] font-bold text-sm">
                    {meta.xp || "500 XP"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="relative z-10 flex justify-center mt-16">
        <button
          onClick={() => setShowAllBadges(!showAllBadges)}
          className="bg-[#76B900] hover:bg-[#5f9400] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-[#76B900]/20"
        >
          {showAllBadges ? "Show Less" : `See All Badges (${badges.length})`}
        </button>
      </div>
    </section>
  );
}
