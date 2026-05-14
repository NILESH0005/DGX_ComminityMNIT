import React from "react";

const features = [
  {
    icon: "⚡",
    title: "GPU Accelerated Training",
    desc: "Train large-scale AI models using NVIDIA DGX systems with CUDA-optimized workflows, mixed precision, and distributed computing across multiple nodes.",
    tag: "CUDA · DGX",
  },
  {
    icon: "☸",
    title: "Kubernetes Infrastructure",
    desc: "Deploy and manage AI workloads on GPU-enabled Kubernetes clusters with enterprise-grade orchestration, resource quotas, and namespace isolation.",
    tag: "K8s · Helm",
  },
  {
    icon: "🔧",
    title: "CUDA Optimization",
    desc: "Deep dive into CUDA programming for high-performance computing — memory management, kernel tuning, warp-level primitives, and profiling with Nsight.",
    tag: "CUDA · Nsight",
  },
  {
    icon: "🤖",
    title: "LLM Fine-Tuning",
    desc: "Fine-tune large language models using NVIDIA NeMo, Hugging Face transformers, LoRA, and PEFT techniques on DGX GPU clusters at scale.",
    tag: "NeMo · LoRA",
  },
  {
    icon: "📊",
    title: "RAPIDS Data Science",
    desc: "Accelerate your data science pipelines with GPU-powered RAPIDS libraries — cuDF, cuML, and cuGraph — for end-to-end ETL and ML workflows.",
    tag: "RAPIDS · cuDF",
  },
  {
    icon: "🚀",
    title: "Triton Inference Server",
    desc: "Deploy and scale ML models in production using NVIDIA Triton with TensorRT optimization, dynamic batching, and ensemble pipelines via gRPC/REST APIs.",
    tag: "Triton · TensorRT",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      {/* Section header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-[#76B900]/8 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ Platform Features
        </div>
        <h2
          className="text-4xl font-bold text-[#013D54] mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Built for Enterprise AI Engineers
        </h2>
        <p className="text-[#6b7280] text-lg leading-relaxed">
          Everything you need to master the NVIDIA AI stack — from GPU infrastructure
          to production-grade Generative AI pipelines.
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-white border border-[#013D54]/6 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#013D54]/8 hover:border-[#76B900]/30 cursor-default"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-[#76B900]/12 to-[#013D54]/8 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>

            {/* Title */}
            <h3
              className="text-lg font-semibold text-[#013D54] mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {f.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{f.desc}</p>

            {/* Tag */}
            <div className="inline-flex items-center bg-[#f0fde4] text-[#3d6600] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#76B900]/20">
              {f.tag}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-[#013D54] to-[#01516e] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3
            className="text-white text-xl font-bold mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to unlock GPU-accelerated AI skills?
          </h3>
          <p className="text-white/60 text-sm">
            Join 2,400+ engineers already trained on DGX infrastructure.
          </p>
        </div>
       
      </div>
    </section>
  );
}