import { useNavigate, useLocation } from "react-router-dom";
import { headingFont } from "./SectionHeader";

const stats = [
  { num: "10", label: "Modules" },
  { num: "10", label: "Hands-on Labs" },
  { num: "Linux → Run:ai", label: "Full-stack Coverage" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId, moduleName, uiType, hasCertificate } = location.state || {};

  const handleStartLearning = () => {
    if (moduleId === undefined || moduleId === null) {
      document.getElementById("tracks")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const encodedId = btoa(moduleId.toString());
    navigate(`/module/${encodedId}`, {
      state: { moduleId, moduleName, uiType, hasCertificate },
    });
  };

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        backgroundColor: "#00222F",
        backgroundImage:
          "radial-gradient(900px 500px at 85% 10%, rgba(118,185,0,.28), transparent 60%), radial-gradient(700px 500px at 0% 100%, rgba(0,140,180,.30), transparent 60%), linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 48px 48px, 48px 48px",
      }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24 max-w-7xl mx-auto w-full">
        {/* LEFT */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="inline-flex items-center gap-2 bg-[#76B900]/15 border border-[#76B900]/40 text-[#B8EC5E] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full animate-pulse" />
            NVIDIA DGX MANAGEMENT CURRICULUM
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] mb-4 sm:mb-6" style={headingFont}>
            DGX Infrastructure
            <span className="text-[#9BD92E]"> Management</span>
          </h1>

          <p className="text-base sm:text-lg text-[#BFD6DE] leading-relaxed max-w-xl mb-6 sm:mb-8">
            Build the skills required to deploy, administer, monitor, secure,
            and troubleshoot enterprise NVIDIA DGX environments.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap mb-8 sm:mb-12">
            <button
              onClick={handleStartLearning}
              className="bg-[#76B900] hover:bg-[#8bd100] text-[#00222F] text-sm sm:text-base font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-[#76B900]/30"
            >
              Get Started
            </button>
            <button
              onClick={() => document.getElementById("tracks")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/10 text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border-2 border-white/25 hover:border-white hover:bg-white/15 transition-all"
            >
              Explore Modules
            </button>
          </div>

          <div className="flex gap-6 sm:gap-10 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold text-[#9BD92E]" style={headingFont}>
                  {s.num}
                </div>
                <div className="text-xs text-[#8FB0BC] font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 max-w-md w-full flex flex-col gap-5">
          {/* Terminal */}
          <div className="bg-[#03141C] border border-[#1E4558] rounded-2xl px-5 py-4 font-mono text-sm leading-8 text-[#BFD6DE] shadow-2xl shadow-black/40">
            <div className="flex gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            {[
              ["nvidia-smi", "Module 05"],
              ["docker run --gpus all", "Module 07"],
              ["sinfo", "Module 08"],
              ["kubectl get nodes", "Module 09"],
            ].map(([cmd, mod]) => (
              <div key={cmd}>
                <span className="text-[#76B900]">$</span> {cmd}{" "}
                <span className="text-[#7FA3B2]"># {mod}</span>
              </div>
            ))}
          </div>

          {/* Dashboard (sample values) */}
          <div className="bg-white text-[#013D54] rounded-3xl shadow-2xl shadow-black/30 p-5 sm:p-7 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg sm:text-xl" style={headingFont}>DGX Learning Dashboard</h3>
                <p className="text-[#6b7280] text-xs sm:text-sm">Personalized infrastructure journey</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#76B900] to-[#5f9400] text-[#00222F] font-black flex items-center justify-center shadow-lg text-base sm:text-lg">
                DGX
              </div>
            </div>

            <div className="bg-[#f8faf5] rounded-2xl p-4 sm:p-5 border border-[#013D54]/6 mb-4">
              <div className="flex justify-between mb-3">
                <span className="font-medium text-sm sm:text-base">Course Progress</span>
                <span className="text-[#3C6A00] font-bold text-sm sm:text-base">10 Modules</span>
              </div>
              <div className="w-full bg-[#dfe7db] rounded-full h-3 overflow-hidden">
                <div className="bg-[#76B900] h-full w-[40%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="bg-[#f8faf5] border border-[#76B900]/10 rounded-2xl p-4">
                <p className="text-[#6b7280] text-xs sm:text-sm mb-1">Hands-on Labs</p>
                <h3 className="text-2xl sm:text-3xl font-black">10</h3>
              </div>
              <div className="bg-[#f8faf5] border border-[#76B900]/10 rounded-2xl p-4">
                <p className="text-[#6b7280] text-xs sm:text-sm mb-1">Current Module</p>
                <h3 className="text-2xl sm:text-3xl font-black">04</h3>
              </div>
            </div>

            <div className="bg-[#013D54] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold text-sm sm:text-base">Final Certification</h4>
                <span className="text-[#9BD92E] text-xs sm:text-sm font-bold">40%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
                <div className="bg-[#76B900] h-full w-[40%]" />
              </div>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                Complete all 10 modules and labs to unlock your DGX certificate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}