import React from "react";

const features = [
  {
    icon: "⚡",
    title: "GPU Accelerated Training",
    points: [
      "NVIDIA DGX Systems",
      "CUDA-optimized workflows",
      "Mixed Precision Training",
      "Distributed Multi-node Computing",
    ],
    tag: "CUDA · DGX",
  },

  {
    icon: "☸",
    title: "Kubernetes Infrastructure",
    points: [
      "GPU-enabled Kubernetes Clusters",
      "Enterprise-grade Orchestration",
      "Resource Quotas",
      "Namespace Isolation",
    ],
    tag: "Kubernetes · Helm",
  },

  {
    icon: "🔧",
    title: "Model Optimization",
    points: [
      "Memory Management",
      "Kernel Optimization",
      "TensorRT Optimization",
    ],
    tag: "TensorRT · CUDA",
  },

  {
    icon: "🤖",
    title: "LLM Fine-Tuning",
    points: ["NVIDIA NeMo", "Hugging Face Transformers", "LoRA PEFT"],
    tag: "NeMo · LoRA",
  },

  {
    icon: "📊",
    title: "RAPIDS Data Science",
    points: ["cuDF", "cuML", "cuGraph", "GPU-powered ETL Pipelines"],
    tag: "RAPIDS · cuDF",
  },

  {
    icon: "🚀",
    title: "Triton Inference Server",
    points: [
      "NVIDIA Triton",
      "Dynamic Batching",
      "Ensemble Pipelines",
      "gRPC & REST APIs",
    ],
    tag: "Triton",
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
          Everything you need to master the NVIDIA AI stack — from GPU
          infrastructure to production-grade Generative AI pipelines.
        </p>
      </div>

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
              className="text-lg font-semibold text-[#013D54] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {f.title}
            </h3>

            {/* Points */}
            <ul className="space-y-2 mb-5">
              {f.points.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-[#6b7280]"
                >
                  <span className="text-[#76B900] mt-[2px]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Tag */}
            <div className="inline-flex items-center bg-[#f0fde4] text-[#3d6600] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#76B900]/20">
              {f.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
