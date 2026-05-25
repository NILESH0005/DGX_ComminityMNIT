import React, { useState } from "react";

const learningTracks = [
  {
    id: 0,
    title: "AI Awareness Foundations",
    short: "Foundations",
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
    level: "Beginner",
    description:
      "Start your AI journey with foundational concepts, AI tools, prompting basics, and digital productivity workflows.",
    modules: [
      "Introduction to Artificial Intelligence",
      "Everyday AI Tools & Applications",
      "Prompt Engineering Basics",
      "AI Safety & Responsible Usage",
    ],
    outcome: "Build confidence using AI in daily learning and creativity.",
  },

  {
    id: 1,
    title: "AI Creativity & Productivity",
    short: "Creativity",
    icon: "🎨",
    color: "from-cyan-500 to-blue-600",
    level: "Intermediate",
    description:
      "Learn how to create content, presentations, graphics, videos, and productivity workflows using modern AI tools.",
    modules: [
      "AI for Presentations & Research",
      "AI Image & Video Generation",
      "Content Creation with AI",
      "AI Automation Workflows",
    ],
    outcome: "Use AI to boost creativity, learning, and productivity.",
  },

  {
    id: 2,
    title: "AI Projects & Innovation",
    short: "Projects",
    icon: "🚀",
    color: "from-violet-500 to-purple-700",
    level: "Advanced",
    description:
      "Build real-world AI mini-projects, solve practical challenges, and participate in AI innovation activities.",
    modules: [
      "AI Project Building",
      "AI-Based Problem Solving",
      "Team Innovation Challenges",
      "AI Showcase & Portfolio",
    ],
    outcome: "Develop hands-on AI project experience and innovation skills.",
  },

  {
    id: 3,
    title: "Future AI Careers & Leadership",
    short: "Leadership",
    icon: "🏆",
    color: "from-orange-500 to-red-600",
    level: "Future Ready",
    description:
      "Explore future AI career pathways, leadership opportunities, AI entrepreneurship, and emerging technologies.",
    modules: [
      "AI Career Roadmaps",
      "AI Entrepreneurship",
      "Future of Work with AI",
      "Leadership & Collaboration",
    ],
    outcome: "Become future-ready with AI leadership and career awareness.",
  },
];

export default function LearningTracksSection() {
  const [activeTrack, setActiveTrack] = useState(0);

  const current = learningTracks[activeTrack];

  return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#f8fffe] to-[#eefcff]">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">

        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ AI Learning Roadmap
        </div>

        <h2
          className="text-4xl md:text-5xl font-bold text-[#013D54] mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Your AI Learning Journey
        </h2>

        <p className="text-[#6b7280] text-lg leading-relaxed">
          Progress through structured AI pathways designed to take learners
          from AI awareness to innovation, creativity, and future-ready careers.
        </p>

      </div>

      {/* Roadmap Progress */}
      <div className="max-w-5xl mx-auto mb-14">

        <div className="flex items-center justify-between relative">

          {/* Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-[#013D54]/10 rounded-full z-0" />

          <div
            className="absolute top-6 left-0 h-1 bg-green-500 rounded-full z-0 transition-all duration-500"
            style={{
              width: `${(activeTrack / (learningTracks.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          {learningTracks.map((track, i) => (

            <button
              key={track.id}
              onClick={() => setActiveTrack(i)}
              className="relative z-10 flex flex-col items-center gap-3 group"
            >

              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 transition-all duration-300 ${
                  i <= activeTrack
                    ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/30"
                    : "bg-white border-[#013D54]/15"
                }`}
              >

                {i < activeTrack ? (
                  <svg
                    className="w-5 h-5 text-white"
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
                  <span>{track.icon}</span>
                )}

              </div>

              {/* Label */}
              <span
                className={`text-xs md:text-sm font-semibold text-center max-w-[100px] leading-tight transition-colors ${
                  i === activeTrack
                    ? "text-[#013D54]"
                    : "text-[#6b7280]"
                }`}
              >
                {track.short}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* Active Track Content */}
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div>

            <div
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${current.color} text-white text-xs font-semibold px-4 py-2 rounded-full mb-5`}
            >
              {current.level}
            </div>

            <h3
              className="text-4xl font-bold text-[#013D54] mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {current.title}
            </h3>

            <p className="text-[#6b7280] text-lg leading-relaxed mb-8">
              {current.description}
            </p>

            {/* Modules */}
            <div className="space-y-4 mb-8">

              {current.modules.map((module, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4 bg-white border border-[#013D54]/8 rounded-2xl p-4 shadow-sm"
                >

                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>

                  <div>

                    <h4 className="font-semibold text-[#013D54]">
                      {module}
                    </h4>

                    <p className="text-sm text-[#6b7280] mt-1">
                      Interactive AI learning module with guided activities and practice.
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Outcome */}
            <div className="bg-gradient-to-r from-green-50 to-cyan-50 border border-green-200 rounded-2xl p-5">

              <div className="flex items-start gap-3">

                <div className="text-2xl">
                  🎯
                </div>

                <div>

                  <h4 className="font-bold text-[#013D54] mb-1">
                    Learning Outcome
                  </h4>

                  <p className="text-[#6b7280]">
                    {current.outcome}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT VISUAL */}
          <div className="relative">

            <div className="bg-[#050810] rounded-[32px] p-8 border border-white/10 shadow-2xl overflow-hidden">

              {/* Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 blur-[100px]" />

              {/* Dashboard */}
              <div className="relative z-10">

                <div className="flex items-center justify-between mb-8">

                  <div>

                    <h3 className="text-2xl font-bold text-white">
                      AI Journey Progress
                    </h3>

                    <p className="text-zinc-400 text-sm">
                      Personalized AI roadmap tracking
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-full bg-green-500 text-black font-black flex items-center justify-center">
                    AI
                  </div>

                </div>

                {/* Progress */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6">

                  <div className="flex justify-between mb-3">

                    <span className="text-zinc-300">
                      Overall Completion
                    </span>

                    <span className="text-green-400 font-bold">
                      68%
                    </span>

                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-green-500 h-full w-[68%]" />
                  </div>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-zinc-400 text-sm mb-1">
                      XP Earned
                    </p>

                    <h3 className="text-3xl font-bold text-white">
                      8.4K
                    </h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-zinc-400 text-sm mb-1">
                      Badges
                    </p>

                    <h3 className="text-3xl font-bold text-white">
                      14
                    </h3>
                  </div>

                </div>

                {/* AI Levels */}
                <div className="space-y-4">

                  {learningTracks.map((track, index) => (

                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-2xl px-5 py-4 border transition-all duration-300 ${
                        index === activeTrack
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        <div className="text-2xl">
                          {track.icon}
                        </div>

                        <div>

                          <h4 className="text-white font-semibold">
                            {track.short}
                          </h4>

                          <p className="text-zinc-400 text-sm">
                            {track.level}
                          </p>

                        </div>

                      </div>

                      <div className="text-green-400 font-bold">
                        {index <= activeTrack ? "Completed" : "Locked"}
                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}