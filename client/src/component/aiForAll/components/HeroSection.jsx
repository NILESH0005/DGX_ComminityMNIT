import { useNavigate, useLocation } from "react-router-dom";

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
    <section className="relative py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            ✦ INDIA'S AI LEARNING MOVEMENT
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            AI
            <span className="text-green-400"> For All</span>
          </h1>

          <p className="text-zinc-300 text-lg leading-relaxed max-w-xl mb-8">
            Learn AI through interactive pathways, smart badges, real-world
            projects, AI challenges, and verified certifications.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleStartLearning}
              className="bg-green-400 hover:bg-green-300 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Start Learning
            </button>

            <button className="border border-white/15 hover:border-green-400 hover:text-green-400 px-8 py-4 rounded-2xl transition-all duration-300">
              Explore Tracks
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Student Dashboard</h3>

                <p className="text-zinc-400 text-sm">AI Learning Journey</p>
              </div>

              <div className="w-16 h-16 rounded-full bg-green-400 text-black font-black flex items-center justify-center">
                AI
              </div>
            </div>

            {/* Progress */}
            <div className="bg-black/30 rounded-2xl p-5 border border-white/10 mb-5">
              <div className="flex justify-between mb-3">
                <span>AI Progress</span>
                <span className="text-green-400">Level 8</span>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div className="bg-green-400 h-full w-[72%]" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                <p className="text-zinc-400 text-sm">Certificates</p>

                <h3 className="text-3xl font-bold mt-2">12</h3>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                <p className="text-zinc-400 text-sm">XP Earned</p>

                <h3 className="text-3xl font-bold mt-2">8.4K</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
