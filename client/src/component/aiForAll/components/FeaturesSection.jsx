import React from "react";

const features = [
  {
    icon: "🎯",
    title: "Structured Milestone-Based Learning",
    desc: "Clearly defined milestones, progressive learning paths, guided learner journeys, and milestone completion tracking.",
    tag: "Milestones · Tracking",
  },

  {
    icon: "🏆",
    title: "Badges & Certifications",
    desc: "Earn industry-style AI badges and verified digital certificates as learners progress through the program.",
    tag: "Badges · Certificates",
  },

  {
    icon: "📊",
    title: "Personalized Learning Dashboard",
    desc: "Track learning progress, completion percentage, badge collections, and learning streaks through a smart AI dashboard.",
    tag: "Dashboard · Progress",
  },

  {
    icon: "🚀",
    title: "Future-Ready Skills",
    desc: "Learn AI tools, Prompt Engineering, productivity workflows, and digital innovation skills for the future workforce.",
    tag: "AI Skills · Future",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ AI Platform Features
        </div>

        <h2
          className="text-4xl font-bold text-[#013D54] mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Built for the Next Generation of AI Learners
        </h2>

        <p className="text-[#6b7280] text-lg leading-relaxed">
          A powerful AI-native learning ecosystem combining personalized
          education, gamification, certifications, and real-world AI
          experiences.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-white border border-[#013D54]/6 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#013D54]/8 hover:border-green-400/40 cursor-default"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/15 to-cyan-500/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <p className="text-sm text-[#6b7280] leading-relaxed mb-4">
              {f.desc}
            </p>

            {/* Tag */}
            <div className="inline-flex items-center bg-green-50 text-green-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-green-200">
              {f.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
