import React, { useState } from "react";

const mentors = [
  {
    initials: "AK",
    avatarBg: "#013D54",
    name: "Arjun Kapoor",
    role: "Senior AI Infrastructure Engineer",
    company: "Ex-NVIDIA · Ex-Google",
    experience: "12+ Years Experience",
    bio: "Arjun has architected GPU clusters for Fortune 500 enterprises and contributed to CUDA runtime libraries at NVIDIA. He specializes in DGX deployment and Kubernetes-based AI orchestration.",
    skills: ["CUDA", "DGX", "Kubernetes", "TensorRT", "NVLink"],
    rating: 4.9,
    students: "920+",
    courses: 4,
    linkedin: "#",
    twitter: "#",
    github: "#",
  },
  {
    initials: "PS",
    avatarBg: "#76B900",
    name: "Priya Sharma",
    role: "ML Platform Architect",
    company: "Ex-Meta · Ex-Amazon",
    experience: "10+ Years Experience",
    bio: "Priya has built ML platforms serving billions of inference requests. Her expertise spans PyTorch, NVIDIA NeMo, and enterprise-scale Triton deployments for recommendation and NLP systems.",
    skills: ["PyTorch", "NeMo", "Triton", "RAPIDS", "Distributed ML"],
    rating: 4.95,
    students: "780+",
    courses: 3,
    linkedin: "#",
    twitter: "#",
    github: "#",
  },
  {
    initials: "RS",
    avatarBg: "#1a5276",
    name: "Rahul Sinha",
    role: "Generative AI Specialist",
    company: "Ex-Mistral · Ex-Cohere",
    experience: "8+ Years Experience",
    bio: "Rahul is a Generative AI researcher with deep expertise in LLM fine-tuning, RAG architecture, and NVIDIA NIM microservices. He has published papers on efficient transformer inference.",
    skills: ["LLM Fine-Tuning", "NIM", "RAG", "HuggingFace", "LoRA"],
    rating: 4.92,
    students: "640+",
    courses: 3,
    linkedin: "#",
    twitter: "#",
    github: "#",
  },
  {
    initials: "MT",
    avatarBg: "#2d6a2d",
    name: "Meera Thakur",
    role: "DevOps & GPU Systems Lead",
    company: "Ex-IBM · Ex-Wipro",
    experience: "9+ Years Experience",
    bio: "Meera has led GPU infrastructure modernization for large-scale enterprise AI platforms. She specializes in MLOps pipelines, Helm-based deployments, and GPU monitoring at scale.",
    skills: ["Kubernetes", "Docker", "Helm", "MLOps", "Prometheus"],
    rating: 4.88,
    students: "560+",
    courses: 2,
    linkedin: "#",
    twitter: "#",
    github: "#",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-[#76B900]" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-[#013D54] ml-1">{rating}</span>
    </div>
  );
}

function SocialIcon({ type, href }) {
  const icons = {
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  };

  return (
    <a
      href={href}
      className="w-8 h-8 rounded-lg border border-[#013D54]/10 bg-white flex items-center justify-center text-[#013D54]/60 hover:bg-[#013D54] hover:text-white hover:border-[#013D54] transition-all duration-200"
    >
      {icons[type]}
    </a>
  );
}

export default function MentorSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-[#76B900]/8 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ Expert Instructors
        </div>
        <h2
          className="text-4xl font-bold text-[#013D54] mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Learn From Industry Leaders
        </h2>
        <p className="text-[#6b7280] text-lg leading-relaxed">
          Our mentors have built and deployed AI systems at NVIDIA, Meta, Google, and
          leading enterprise AI teams worldwide.
        </p>
      </div>

      {/* Mentor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {mentors.map((m, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`bg-white border rounded-2xl p-6 flex flex-col transition-all duration-300 cursor-default ${
              hovered === i
                ? "border-[#76B900]/30 shadow-2xl shadow-[#013D54]/10 -translate-y-1"
                : "border-[#013D54]/6 shadow-sm"
            }`}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3 ring-4 ring-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${m.avatarBg}, ${m.avatarBg}cc)`,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {m.initials}
              </div>
              <h3
                className="text-base font-bold text-[#013D54] text-center mb-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {m.name}
              </h3>
              <p className="text-xs text-[#76B900] font-semibold text-center mb-0.5">{m.role}</p>
              <p className="text-[11px] text-[#6b7280] text-center">{m.company}</p>
            </div>

            {/* Rating & stats */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#013D54]/6">
              <StarRating rating={m.rating} />
              <span className="text-[11px] text-[#6b7280] font-medium">{m.experience}</span>
            </div>

            {/* Bio */}
            <p className="text-xs text-[#6b7280] leading-relaxed mb-4 flex-1">{m.bio}</p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#f0f9ff] rounded-lg p-2.5 text-center">
                <div className="text-sm font-bold text-[#013D54]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {m.students}
                </div>
                <div className="text-[10px] text-[#6b7280] font-medium">Students</div>
              </div>
              <div className="bg-[#f0fde4] rounded-lg p-2.5 text-center">
                <div className="text-sm font-bold text-[#3d6600]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {m.courses}
                </div>
                <div className="text-[10px] text-[#6b7280] font-medium">Courses</div>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-4">
              {m.skills.map((s, j) => (
                <span
                  key={j}
                  className="bg-[#76B900]/8 text-[#3d6600] border border-[#76B900]/20 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2 justify-center">
              <SocialIcon type="linkedin" href={m.linkedin} />
              <SocialIcon type="twitter" href={m.twitter} />
              <SocialIcon type="github" href={m.github} />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}