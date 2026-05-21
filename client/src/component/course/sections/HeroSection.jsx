import React from "react";
import { useNavigate } from "react-router-dom";

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
<<<<<<< HEAD
=======
        quizAccessOnSubModuleCompletion: localStorage.getItem(
          "quizAccessOnSubModuleCompletion",
        ),

        hasCertificate: localStorage.getItem("hasCertificate"),
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
      },
    });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 overflow-hidden flex flex-col">
      {/* Floating background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#76B900]/6 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-50px] w-[300px] h-[300px] bg-[#013D54]/4 rounded-full blur-[60px] pointer-events-none" />

      <button
        onClick={handleGetStarted}
        className="bg-[#76B900] hover:bg-[#619a00] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
      >
        Get Started
      </button>

      {/* Hero Content */}
      <div className="flex-1 flex items-center gap-16 px-12 py-16 max-w-7xl mx-auto w-full">
        {/* Left */}
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#76B900]/10 border border-[#76B900]/30 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#76B900] rounded-full animate-pulse" />
<<<<<<< HEAD
            AI User Enablement Program 
=======
            AI User Enablement Program
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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

          <div className="flex gap-4 flex-wrap mb-12">
            {/* ✅ Main Get Started button */}

            <button
              onClick={() => {
                const section = document.getElementById("curriculum");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-transparent text-[#013D54] text-base font-semibold px-8 py-3.5 rounded-xl border-2 border-[#013D54]/20 hover:border-[#013D54] hover:bg-[#013D54]/4 transition-all"
            >
              View Curriculum
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-bold text-[#013D54]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
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

        {/* Right — Infrastructure Card */}
        <div className="flex-1 max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl shadow-[#013D54]/10 p-6 border border-[#013D54]/6">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="font-semibold text-sm text-[#013D54]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                DGX H100 Cluster
              </span>
<<<<<<< HEAD
             
=======
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
            </div>

            {/* GPU chips grid */}
            <div className="grid grid-cols-4 gap-1.5 mb-5">
              {gpuChips.map((chip) => (
                <div
                  key={chip.id}
                  className={`h-7 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    chip.active
                      ? "bg-gradient-to-br from-[#76B900] to-[#619a00] text-white"
                      : "bg-gradient-to-br from-[#013D54] to-[#01516e] text-[#76B900]"
                  }`}
                >
                  H100
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { val: "640", key: "GB HBM3" },
                { val: "3.2", key: "TB/s BW" },
                { val: "4PB", key: "Storage" },
              ].map((m) => (
                <div
                  key={m.key}
                  className="bg-[#f8faf5] rounded-lg p-3 text-center"
                >
                  <div
                    className="text-lg font-bold text-[#013D54]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {m.val}
                  </div>
                  <div className="text-[10px] text-[#76B900] font-semibold">
                    {m.key}
                  </div>
                </div>
              ))}
            </div>

            {/* Code block */}
            <div className="bg-[#013D54] rounded-xl p-4 font-mono text-xs leading-relaxed">
              <div className="text-[#4a8a6a]"># Launch DGX training job</div>
              <div className="text-[#76B900]">
                kubectl apply -f{" "}
                <span className="text-[#9ed86e]">train-job.yaml</span>
              </div>
              <div className="text-[#9ed86e]">✓ GPU nodes: 8/8 allocated</div>
              <div className="text-[#9ed86e]">✓ CUDA 12.3 ready</div>
              <div className="text-[#76B900]">
                torchrun --nproc_per_node=
                <span className="text-yellow-300">8</span> train.py
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
