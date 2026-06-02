import React, { useState } from "react";

const workflows = [
  {
    id: 0,
    label: "AI Infrastructure & Kubernetes",
    shortLabel: "AI Infrastructure",
    icon: "🏗️",
    color: "from-[#013D54] to-[#01516e]",
    accent: "#013D54",

    modules: [
      {
        num: "01",
        title: "DGX Architecture & Kubernetes",
        outcome: "Deploy AI workloads on DGX",

        topics: [
          "DGX System Architecture",
          "GPU Configurations & NVLink",
          "Shared Storage for AI Workloads",
          "Kubernetes on DGX Clusters",
        ],

        practice: "Guided DGX Cluster Walkthrough",
      },

      {
        num: "02",
        title: "Containerized AI Applications",
        outcome: "Ship GPU-ready containers",

        topics: [
          "Docker for AI Workloads",
          "NVIDIA Container Toolkit",
          "GPU-enabled Kubernetes Deployments",
          "Namespace & Resource Quotas",
        ],

        practice: "Deploy Your First GPU Container",
      },

      {
        num: "03",
        title: "Guided Deployment Practice",
        outcome: "Run production AI jobs",

        topics: [
          "Real Cluster Job Scheduling",
          "Multi-node GPU Scheduling",
          "Helm Charts",
          "GPU Monitoring",
        ],

        practice: "End-to-End Deployment Lab",
      },
    ],
  },

  {
    id: 1,
    label: "Data-to-Model Engineering",
    shortLabel: "Data Engineering",
    icon: "🧪",
    color: "from-[#76B900] to-[#619a00]",
    accent: "#76B900",

    modules: [
      {
        num: "04",
        title: "Data Engineering & Annotation",
        outcome: "Build high-quality datasets",

        topics: [
          "Data Annotation Workflows",
          "Dataset Validation",
          "ETL Automation",
          "GPU-Accelerated Preprocessing",
        ],

        practice: "Annotate and Validate a Dataset",
      },

      {
        num: "05",
        title: "GPU-Based Model Training",
        outcome: "Train models at scale",

        topics: [
          "PyTorch with CUDA",
          "Distributed Training",
          "Mixed Precision Training",
          "Gradient Checkpointing",
        ],

        practice: "Multi-GPU Training on DGX",
      },

      {
        num: "06",
        title: "Model Evaluation & Tuning",
        outcome: "Optimize model performance",

        topics: [
          "Benchmark Frameworks",
          "GPU Profiling with Nsight",
          "Performance Metrics",
          "Hyperparameter Optimization",
        ],

        practice: "Profile and Tune a Trained Model",
      },
    ],
  },

  {
    id: 2,
    label: "High Performance Inference",
    shortLabel: "Inference",
    icon: "⚡",
    color: "from-[#1a5276] to-[#013D54]",
    accent: "#1a5276",

    modules: [
      {
        num: "07",
        title: "TensorRT Optimization",
        outcome: "Reduce inference latency by 5–10×",

        topics: [
          "INT8 / FP16 Quantization",
          "Graph Optimization",
          "Calibration Pipelines",
          "Kernel Tuning",
        ],

        practice: "Optimize ResNet with TensorRT",
      },

      {
        num: "08",
        title: "Triton Inference Server",
        outcome: "Serve AI models at enterprise scale",

        topics: [
          "Model Repository Setup",
          "Dynamic Batching",
          "Ensemble Pipelines",
          "gRPC & REST APIs",
        ],

        practice: "Deploy Transformer Models on Triton",
      },

      {
        num: "09",
        title: "DeepStream Applications",
        outcome: "Build real-time video AI systems",

        topics: [
          "DeepStream SDK",
          "Video Analytics",
          "Multi-stream Pipelines",
          "Edge Deployment",
        ],

        practice: "Video Inference Pipeline",
      },
    ],
  },

  {
    id: 3,
    label: "Generative AI & End-to-End Systems",
    shortLabel: "Generative AI",
    icon: "🤖",
    color: "from-[#2d6a2d] to-[#1a4a1a]",
    accent: "#2d6a2d",

    modules: [
      {
        num: "10",
        title: "LLM Fine-Tuning at Scale",
        outcome: "Fine-tune and deploy LLMs",

        topics: [
          "Hugging Face Transformers",
          "LoRA & PEFT",
          "NVIDIA NeMo",
          "Prompt Engineering",
        ],

        practice: "Fine-Tune LLaMA on DGX",
      },

      {
        num: "11",
        title: "NVIDIA NIM & RAPIDS",
        outcome: "Accelerate AI microservices",

        topics: [
          "NVIDIA NIM Architecture",
          "RAPIDS cuDF & cuML",
          "GPU Data Science",
          "Pipeline Optimization",
        ],

        practice: "Build a NIM-Powered API",
      },

      {
        num: "12",
        title: "End-to-End AI Pipelines",
        outcome: "Build production-ready GenAI applications",

        topics: [
          "Full-Stack AI Application Design",
          "CUDA + PyTorch Integration",
          "RAG Architectures",
          "Production Deployment Patterns",
        ],

        practice: "Build a Complete RAG Pipeline",
      },
    ],
  },
];

export default function CurriculumSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedModule, setExpandedModule] = useState(null);

  const current = workflows[activeTab];

  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#f8fffe] to-[#f0f9ff]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-[#76B900]/8 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ Curriculum
        </div>
        <h2
          className="text-4xl font-bold text-[#013D54] mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Four AI Engineering Workflows
        </h2>
        <p className="text-[#6b7280] text-lg leading-relaxed">
          A structured learning roadmap from GPU infrastructure fundamentals to
          end-to-end Generative AI pipelines.
        </p>
      </div>

      {/* Workflow progress bar */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#013D54]/10 z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-[#76B900] z-0 transition-all duration-500"
            style={{ width: `${(activeTab / (workflows.length - 1)) * 100}%` }}
          />
          {workflows.map((w, i) => (
            <button
              key={w.id}
              onClick={() => {
                setActiveTab(i);
                setExpandedModule(null);
              }}
              className="relative z-10 flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                  i <= activeTab
                    ? "bg-[#76B900] border-[#76B900] shadow-lg shadow-[#76B900]/30"
                    : "bg-white border-[#013D54]/20 group-hover:border-[#76B900]/50"
                }`}
              >
                {i < activeTab ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{w.icon}</span>
                )}
              </div>
              <span
                className={`text-xs font-semibold text-center max-w-[80px] leading-tight transition-colors ${
                  i === activeTab ? "text-[#013D54]" : "text-[#6b7280]"
                }`}
              >
                {w.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab buttons (mobile-friendly fallback) */}
      <div className="flex gap-2 flex-wrap justify-center mb-10 md:hidden">
        {workflows.map((w, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveTab(i);
              setExpandedModule(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              activeTab === i
                ? "bg-[#013D54] text-white border-[#013D54]"
                : "bg-white text-[#013D54] border-[#013D54]/15 hover:border-[#76B900] hover:text-[#76B900]"
            }`}
          >
            {w.shortLabel}
          </button>
        ))}
      </div>

      {/* Module cards */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {current.modules.map((mod, i) => {
            const isOpen = expandedModule === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#76B900]/40 shadow-xl shadow-[#013D54]/8"
                    : "border-[#013D54]/7 hover:shadow-lg hover:shadow-[#013D54]/6 hover:border-[#76B900]/20"
                }`}
              >
                {/* Card header */}
                <div className={`bg-gradient-to-r ${current.color} p-5`}>
                  <div className="text-[10px] font-bold text-white/60 mb-1 tracking-widest">
                    MODULE {mod.num}
                  </div>
                  <h3
                    className="text-white font-semibold text-base leading-snug"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {mod.title}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    🎯 {mod.outcome}
                  </div>
                </div>

                {/* Topics */}
                <div className="p-5">
                  <ul className="space-y-2 mb-4">
                    {mod.topics.map((t, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-[#4b5563]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] mt-1.5 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  {/* Practice lab badge */}
                  <button
                    onClick={() => setExpandedModule(isOpen ? null : i)}
                    className="w-full flex items-center justify-between bg-[#f0fde4] hover:bg-[#e6fbd2] border border-[#76B900]/20 rounded-xl px-4 py-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🧪</span>
                      <span className="text-xs font-semibold text-[#3d6600]">
                        Guided Practice
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-[#76B900] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded practice detail */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-24 mt-3" : "max-h-0"
                    }`}
                  >
                    <div className="bg-[#013D54]/4 rounded-xl px-4 py-3 border border-[#013D54]/8">
                      <p className="text-xs text-[#013D54] font-medium">
                        📋 Lab: {mod.practice}
                      </p>
                      <p className="text-xs text-[#6b7280] mt-1">
                        Hands-on GPU lab access on real DGX systems included.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow progress indicator */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#013D54]/8">
          <button
            onClick={() => {
              setActiveTab(Math.max(0, activeTab - 1));
              setExpandedModule(null);
            }}
            disabled={activeTab === 0}
            className="flex items-center gap-2 text-sm font-medium text-[#013D54] disabled:opacity-30 hover:text-[#76B900] transition-colors disabled:cursor-not-allowed"
          >
            ← Previous Workflow
          </button>
          <span className="text-xs text-[#6b7280] font-medium">
            {activeTab + 1} / {workflows.length} Workflows
          </span>
          <button
            onClick={() => {
              setActiveTab(Math.min(workflows.length - 1, activeTab + 1));
              setExpandedModule(null);
            }}
            disabled={activeTab === workflows.length - 1}
            className="flex items-center gap-2 text-sm font-medium text-[#013D54] disabled:opacity-30 hover:text-[#76B900] transition-colors disabled:cursor-not-allowed"
          >
            Next Workflow →
          </button>
        </div>
      </div>
    </section>
  );
}
