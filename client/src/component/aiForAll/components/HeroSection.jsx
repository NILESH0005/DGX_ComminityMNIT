import { useNavigate, useLocation } from "react-router-dom";

const stats = [
  { num: "25K+", label: "Students Learning AI" },
  { num: "15", label: "AI Achievement Badges" },
  { num: "40+", label: "Interactive AI Modules" },
  { num: "100%", label: "Future Ready Skills" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();

  const { moduleId, moduleName, uiType, hasCertificate } = location.state || {};

  const handleStartLearning = () => {
    const encodedId = btoa(moduleId.toString());

    navigate(`/module/${encodedId}`, {
      state: {
        moduleId,
        moduleName,
        uiType,
        hasCertificate,
      },
    });
  };

  return (
    <section className="relative  overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef6fb 60%, #f0f7e6 100%)",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* Background Glow */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#76B900]/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="absolute bottom-0 left-[-50px] w-[300px] h-[300px] bg-[#013D54]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
        {/* LEFT */}
        <div className="flex-1 max-w-2xl w-full">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-[#76B900]/10 border border-[#76B900]/30 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full animate-pulse" />
            INDIA'S AI LEARNING MOVEMENT
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] text-[#013D54] mb-4 sm:mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            AI
            <span className="text-[#76B900]"> For All</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#4a6b7a] leading-relaxed max-w-xl mb-6 sm:mb-8">
            Learn AI through interactive pathways, achievement badges,
            smart challenges, AI projects, and future-ready certifications
            designed for the next generation of learners.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap mb-8 sm:mb-12">
            {/* Start Learning */}
            <button
              onClick={handleStartLearning}
              className="bg-[#76B900] hover:bg-[#619a00] text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-[#76B900]/20"
            >
              Start Learning
            </button>

            {/* Explore Tracks */}
            <button
              onClick={() => {
                const section = document.getElementById("tracks");
                section?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-transparent text-[#013D54] text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border-2 border-[#013D54]/20 hover:border-[#013D54] hover:bg-[#013D54]/4 transition-all"
            >
              Explore Tracks
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 sm:gap-10 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl sm:text-3xl font-bold text-[#013D54]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <span className="text-[#76B900]">{s.num}</span>
                </div>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 max-w-md w-full mt-6 lg:mt-0">
          <div className="bg-white rounded-3xl shadow-2xl shadow-[#013D54]/10 p-5 sm:p-7 border border-[#013D54]/6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className="font-bold text-lg sm:text-xl text-[#013D54]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  AI Learning Dashboard
                </h3>
                <p className="text-[#6b7280] text-xs sm:text-sm">
                  Personalized AI journey
                </p>
              </div>

              {/* AI Logo */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#76B900] to-[#5f9400] text-white font-black flex items-center justify-center shadow-lg text-lg sm:text-xl">
                AI
              </div>
            </div>

            {/* Progress */}
            <div className="bg-[#f8faf5] rounded-2xl p-4 sm:p-5 border border-[#013D54]/6 mb-5">
              <div className="flex justify-between mb-3">
                <span className="text-[#013D54] font-medium text-sm sm:text-base">
                  AI Progress
                </span>
                <span className="text-[#76B900] font-bold text-sm sm:text-base">
                  Level 8
                </span>
              </div>

              <div className="w-full bg-[#dfe7db] rounded-full h-3 overflow-hidden">
                <div className="bg-[#76B900] h-full w-[72%]" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
              <div className="bg-[#f8faf5] border border-[#76B900]/10 rounded-2xl p-4 sm:p-5">
                <p className="text-[#6b7280] text-xs sm:text-sm mb-2">
                  Certificates
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#013D54]">
                  01
                </h3>
              </div>

              <div className="bg-[#f8faf5] border border-cyan-500/10 rounded-2xl p-4 sm:p-5">
                <p className="text-[#6b7280] text-xs sm:text-sm mb-2">
                  XP Earned
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#013D54]">
                  8.4K
                </h3>
              </div>
            </div>

            {/* Achievement Progress */}
            <div className="bg-[#013D54] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold text-sm sm:text-base">
                  Final Certification
                </h4>
                <span className="text-[#76B900] text-xs sm:text-sm font-bold">
                  72%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
                <div className="bg-[#76B900] h-full w-[72%]" />
              </div>

              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                Complete all AI milestones, achievement badges,
                and innovation tracks to unlock the final
                AI Awareness For All Certificate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}