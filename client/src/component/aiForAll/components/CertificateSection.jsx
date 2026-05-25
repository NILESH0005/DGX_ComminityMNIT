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
          Showcase your AI learning achievements with verified certificates,
          QR validation, digital profiles, and future-ready skill recognition.
        </p>

      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {certificates.map((cert, index) => (

          <div
            key={index}
            className="group relative bg-white border border-[#013D54]/8 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-[#013D54]/10 transition-all duration-500 hover:-translate-y-2"
          >

            {/* Top Gradient */}
            <div
              className={`h-3 bg-gradient-to-r ${cert.color}`}
            />

            {/* Content */}
            <div className="p-8">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">

                <div
                  className={`w-20 h-20 rounded-[24px] bg-gradient-to-br ${cert.color} flex items-center justify-center text-4xl shadow-lg`}
                >
                  {cert.icon}
                </div>

                <div className="text-right">

                  <div className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                    {cert.level}
                  </div>

                </div>

              </div>

              {/* Title */}
              <h3
                className="text-2xl font-bold text-[#013D54] mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {cert.title}
              </h3>

              {/* Description */}
              <p className="text-[#6b7280] text-sm leading-relaxed mb-6">
                {cert.desc}
              </p>

              {/* Skills */}
              <div className="space-y-3 mb-8">

                {cert.skills.map((skill, i) => (

                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >

                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">

                      <svg
                        className="w-3 h-3 text-green-600"
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

                    <span className="text-sm text-[#4b5563] font-medium">
                      {skill}
                    </span>

                  </div>

                ))}

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#013D54]/8 pt-5">

                <div>

                  <p className="text-xs text-[#6b7280] mb-1">
                    Certificate Verification
                  </p>

                  <div className="flex items-center gap-2">

                    <div className="w-2 h-2 rounded-full bg-green-500" />

                    <span className="text-green-600 text-sm font-semibold">
                      QR Verified
                    </span>

                  </div>

                </div>

                <button className="text-[#013D54] hover:text-green-600 text-sm font-semibold transition-colors duration-300">
                  Preview →
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Showcase Section */}
      <div className="mt-24 max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              ✦ Smart Certificate Ecosystem
            </div>

            <h3
              className="text-4xl md:text-5xl font-bold text-[#013D54] mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              More Than Just a Certificate
            </h3>

            <p className="text-[#6b7280] text-lg leading-relaxed mb-8">
              Every AI certificate is linked to your personalized AI profile,
              achievement history, badges, and verified learning journey.
            </p>

            {/* Features */}
            <div className="space-y-5">

              {[
                "QR-based Certificate Verification",
                "Public AI Learner Profile",
                "Skill & Achievement Showcase",
                "Downloadable & Shareable Certificates",
                "Institution & DGX Powered Recognition",
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4"
                >

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

          </div>

          {/* RIGHT CERTIFICATE PREVIEW */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute inset-0 bg-green-500/10 blur-[120px] rounded-full" />

            {/* Certificate */}
            <div className="relative bg-gradient-to-br from-[#013D54] to-[#01516e] rounded-[40px] p-10 shadow-2xl overflow-hidden">

              {/* Decorative */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/10 blur-[100px]" />

              {/* Certificate Content */}
              <div className="relative z-10 bg-white rounded-[28px] p-10">

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

                  {/* QR */}
                  <div className="w-20 h-20 bg-[#013D54] rounded-2xl flex items-center justify-center text-white font-black">
                    QR
                  </div>

                </div>

                {/* Body */}
                <div className="text-center py-8 border-y border-dashed border-[#013D54]/15">

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
                    for successfully completing the AI Awareness For All
                    learning pathway and demonstrating excellence in AI
                    learning, creativity, and innovation.
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

                    <p className="text-xs text-[#6b7280] mb-1">
                      Powered By
                    </p>

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