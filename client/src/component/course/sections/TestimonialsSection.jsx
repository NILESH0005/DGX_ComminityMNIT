import React, { useState } from "react";

const testimonials = [
  {
    name: "Vikram Nair",
    role: "ML Engineer",
    company: "Infosys",
    avatar: "VN",
    avatarBg: "#013D54",
    rating: 5,
    text: "The DGX infrastructure module was a game-changer. I went from theory to deploying GPU clusters in production within weeks. The hands-on labs on real DGX hardware made all the difference.",
    outcome: "Promoted to AI Infrastructure Lead",
    tag: "DGX · Kubernetes",
  },
  {
    name: "Sneha Patel",
    role: "Data Scientist",
    company: "TCS",
    avatar: "SP",
    avatarBg: "#76B900",
    rating: 5,
    text: "RAPIDS and TensorRT optimization content is unmatched anywhere online. My model inference pipelines are now 8× faster in production. Highly recommend this to every ML engineer.",
    outcome: "Built 8× faster inference pipeline",
    tag: "TensorRT · RAPIDS",
  },
  {
    name: "Aditya Rao",
    role: "AI Platform Lead",
    company: "HCL Technologies",
    avatar: "AR",
    avatarBg: "#1a5276",
    rating: 5,
    text: "The Triton Inference Server curriculum is detailed and truly enterprise-ready. Our entire team now uses these skills daily in production serving. Best upskilling investment we've made.",
    outcome: "Deployed Triton for 10M daily requests",
    tag: "Triton · TensorRT",
  },
  {
    name: "Kavya Menon",
    role: "NLP Engineer",
    company: "Wipro",
    avatar: "KM",
    avatarBg: "#2d6a2d",
    rating: 5,
    text: "LLM fine-tuning with NeMo and NVIDIA NIM was exactly what I needed to level up. The instructors are world-class and the content is constantly updated with the latest releases.",
    outcome: "Fine-tuned LLM for enterprise use case",
    tag: "NeMo · NIM · LoRA",
  },
  {
    name: "Rohit Gupta",
    role: "Cloud Architect",
    company: "Accenture",
    avatar: "RG",
    avatarBg: "#7d3c98",
    rating: 5,
    text: "Kubernetes for AI workloads was covered with incredible depth. From multi-node GPU scheduling to production deployments — this program has everything you need to modernize your AI stack.",
    outcome: "Architected GPU K8s cluster for client",
    tag: "Kubernetes · DGX",
  },
  {
    name: "Ananya Singh",
    role: "Research Engineer",
    company: "IIT Delhi",
    avatar: "AS",
    avatarBg: "#922b21",
    rating: 5,
    text: "As a researcher transitioning to industry, this program bridged every single gap. The CUDA programming and distributed training labs are genuinely world-class. Exceptional value.",
    outcome: "Landed NVIDIA research internship",
    tag: "CUDA · Distributed Training",
  },
];

const metrics = [
  { value: "4.9/5", label: "Average Rating", icon: "⭐" },
  { value: "97%", label: "Completion Rate", icon: "📈" },
  { value: "2,400+", label: "Engineers Trained", icon: "👩‍💻" },
  { value: "89%", label: "Got Promoted", icon: "🚀" },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-[#76B900]" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(null);

  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#f0f9ff] to-[#f8fffe]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-[#76B900]/8 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ Student Success
        </div>
        <h2
          className="text-4xl font-bold text-[#013D54] mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Engineers Transforming Their Careers
        </h2>
        <p className="text-[#6b7280] text-lg leading-relaxed">
          Hear from professionals who've applied DGX AI skills to real enterprise challenges.
        </p>
      </div>

      {/* Success metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 text-center border border-[#013D54]/6 shadow-sm"
          >
            <div className="text-2xl mb-1">{m.icon}</div>
            <div
              className="text-2xl font-bold text-[#013D54] mb-0.5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {m.value}
            </div>
            <div className="text-xs text-[#6b7280] font-medium">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonial cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`bg-white rounded-2xl p-6 border flex flex-col transition-all duration-300 cursor-default ${
              active === i
                ? "border-[#76B900]/30 shadow-xl shadow-[#013D54]/8 -translate-y-1"
                : "border-[#013D54]/6"
            }`}
          >
            {/* Top row: stars + tag */}
            <div className="flex items-center justify-between mb-4">
              <Stars count={t.rating} />
              <span className="text-[10px] font-semibold text-[#3d6600] bg-[#f0fde4] border border-[#76B900]/20 px-2.5 py-1 rounded-full">
                {t.tag}
              </span>
            </div>

            {/* Quote */}
            <blockquote className="text-sm text-[#374151] leading-relaxed mb-5 flex-1 italic">
              "{t.text}"
            </blockquote>

            {/* Outcome badge */}
            <div className="flex items-center gap-2 bg-[#f0f9ff] border border-[#013D54]/8 rounded-xl px-3 py-2 mb-5">
              <span className="text-sm">✅</span>
              <span className="text-xs font-semibold text-[#013D54]">{t.outcome}</span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#013D54]/6">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{
                  background: t.avatarBg,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#013D54]">{t.name}</div>
                <div className="text-xs text-[#6b7280]">
                  {t.role} · {t.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom trust line */}
      <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
        {["Infosys", "TCS", "HCL", "Wipro", "Accenture", "IBM"].map((c) => (
          <span
            key={c}
            className="text-sm font-semibold text-[#013D54]/30 tracking-wide uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}