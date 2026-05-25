import React from "react";

const certificates = [
  {
    title: "AI Awareness Certificate",
    level: "Foundation Level",
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
    desc: "Awarded for successfully completing the AI Awareness Foundations pathway and beginner AI learning modules.",
    skills: [
      "AI Fundamentals",
      "Prompt Engineering Basics",
      "AI Productivity Tools",
      "Responsible AI Usage",
    ],
  },

  {
    title: "AI Creativity Certificate",
    level: "Intermediate Level",
    icon: "🎨",
    color: "from-cyan-500 to-blue-600",
    desc: "Recognizes learners who demonstrate creative AI usage across content, design, automation, and digital productivity.",
    skills: [
      "AI Content Creation",
      "AI Presentation Design",
      "Workflow Automation",
      "Creative AI Tools",
    ],
  },

  {
    title: "AI Innovation Certificate",
    level: "Advanced Level",
    icon: "🚀",
    color: "from-violet-500 to-purple-700",
    desc: "Issued to students who complete AI projects, innovation challenges, and practical AI implementation activities.",
    skills: [
      "AI Projects",
      "Problem Solving",
      "AI Innovation",
      "Collaborative Learning",
    ],
  },
];

export default function CertificateSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ Verified AI Certifications
        </div>

        <h2
          className="text-4xl md:text-5xl font-bold text-[#013D54] mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Earn Industry-Style AI Certificates
        </h2>

        <p className="text-[#6b7280] text-lg leading-relaxed">
          Showcase your AI learning achievements with verified certificates, QR
          validation, digital profiles, and future-ready skill recognition.
        </p>
      </div>

      {/* Certificates Grid */}
      {/* Main Certificate Showcase */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              ✦ Final AI Certification
            </div>

            <h3
              className="text-4xl md:text-5xl font-bold text-[#013D54] mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AI Awareness For All Certification
            </h3>

            <p className="text-[#6b7280] text-lg leading-relaxed mb-8">
              Unlock the official AI Awareness For All Certificate after
              completing all AI learning milestones, innovation pathways,
              badges, projects, and achievement levels.
            </p>

            {/* Requirements */}
            <div className="space-y-5 mb-10">
              {[
                "Complete All AI Learning Tracks",
                "Unlock All Achievement Badges",
                "Finish AI Challenges & Activities",
                "Reach 100% AI Progress",
                "Complete Final AI Assessment",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>

                  <span className="text-[#4b5563] text-base font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-[#013D54]/5 border border-[#013D54]/10 rounded-2xl p-5">
                <p className="text-sm text-[#6b7280] mb-2">AI Milestones</p>

                <h4 className="text-3xl font-black text-[#013D54]">15+</h4>
              </div>

              <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-5">
                <p className="text-sm text-[#6b7280] mb-2">
                  Achievement Badges
                </p>

                <h4 className="text-3xl font-black text-green-600">15</h4>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-green-500/10 blur-[120px] rounded-full" />

            {/* Certificate Card */}
            <div className="relative bg-gradient-to-br from-[#013D54] to-[#01516e] rounded-[40px] p-10 shadow-2xl overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/10 blur-[100px]" />

              {/* Certificate */}
              <div className="relative z-10 bg-white rounded-[30px] p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-green-600 text-xs font-bold tracking-[0.3em] uppercase mb-2">
                      AI FOR ALL
                    </p>

                    <h3
                      className="text-3xl font-black text-[#013D54]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Certificate of Achievement
                    </h3>
                  </div>

                  {/* AI Badge */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-black font-black text-xl">
                    AI
                  </div>
                </div>

                {/* Body */}
                <div className="text-center py-10 border-y border-dashed border-[#013D54]/15">
                  <p className="text-[#6b7280] text-sm mb-4">
                    This certificate is proudly awarded to
                  </p>

                  <h2
                    className="text-5xl font-black text-[#013D54] mb-5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Student Name
                  </h2>

                  <p className="text-[#4b5563] leading-relaxed max-w-xl mx-auto">
                    for successfully completing the complete AI Awareness For
                    All learning ecosystem including AI pathways, projects,
                    achievements, and innovation milestones.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-8">
                  <div>
                    <p className="text-xs text-[#6b7280] mb-1">
                      Certificate ID
                    </p>

                    <h4 className="font-bold text-[#013D54]">
                      AIFA-2026-00291
                    </h4>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#6b7280] mb-1">Powered By</p>

                    <h4 className="font-bold text-green-600">
                      DGX AI Ecosystem
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}
