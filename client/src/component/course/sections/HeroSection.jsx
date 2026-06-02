import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../../../../public/images";

const stats = [
  { num: "2,400+", label: "Engineers Trained" },
  { num: "8 DGX", label: "GPU Lab Systems" },
  { num: "48+", label: "AI Projects" },
  { num: "12", label: "CUDA Modules" },
];

const gpuChips = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  active: i < 6,
}));

export default function HeroSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const moduleId = localStorage.getItem("moduleId");

    if (!moduleId) {
      navigate("/");
      return;
    }

    const encodedId = btoa(moduleId.toString());

    navigate(`/module/${encodedId}`, {
      state: {
        moduleName: localStorage.getItem("moduleName"),
        moduleId: moduleId,
        uiType: localStorage.getItem("uiType"),
        onBackShowSubModule: localStorage.getItem("onBackShowSubModule"),
        quizAccessOnSubModuleCompletion: localStorage.getItem(
          "quizAccessOnSubModuleCompletion",
        ),
        hasCertificate: localStorage.getItem("hasCertificate"),
      },
    });
  };

  return (
    <section
      className="relative  overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef6fb 60%, #f0f7e6 100%)",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* Floating background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#76B900]/6 rounded-full blur-[60px] pointer-events-none" />

      <div className="absolute bottom-0 left-[-50px] w-[300px] h-[300px] bg-[#013D54]/4 rounded-full blur-[60px] pointer-events-none" />

      {/* Hero Content */}
      <div className="flex-1 flex items-center gap-16 px-12 py-16 max-w-7xl mx-auto w-full">
        {/* Left */}
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#76B900]/10 border border-[#76B900]/30 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full animate-pulse" />
            AI User Enablement Program
          </div>

          <h1
            className="text-5xl font-bold leading-[1.1] text-[#013D54] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Master <span className="text-[#76B900]">GPU-Accelerated</span>
            <br />
            AI on NVIDIA DGX
          </h1>

          <p className="text-lg text-[#4a6b7a] mb-8 leading-relaxed max-w-xl">
            Enterprise-grade training on CUDA, Kubernetes, TensorRT, Triton, and
            Generative AI. Build production-ready skills on real DGX
            infrastructure.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap mb-12">
            {/* Get Started */}
            <button
              onClick={handleGetStarted}
              className="bg-[#76B900] hover:bg-[#619a00] text-white text-base font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#76B900]/20"
            >
              Get Started
            </button>

            {/* View Curriculum */}
            <button
              onClick={() => {
                const section = document.getElementById("curriculum");

                section?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-transparent text-[#013D54] text-base font-semibold px-8 py-3.5 rounded-xl border-2 border-[#013D54]/20 hover:border-[#013D54] hover:bg-[#013D54]/4 transition-all"
            >
              View Curriculum
            </button>
          </div>

          {/* Stats */}
          {/* <div className="flex gap-10 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-bold text-[#013D54]"
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
          </div> */}
        </div>

        {/* Right — Infrastructure Card */}
        <div className="flex-1 max-w-md">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={images.DGX}
              alt="DGX Platform"
              className="w-3/4 h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
