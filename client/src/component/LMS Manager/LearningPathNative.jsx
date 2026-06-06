import React from "react";
import ModuleCardNative from "./ModuleCardNative";

const LearningPathNative = () => {
  return (
    <div className="min-h-screen" style={{ background: "white" }}>
      {/* Hero Section - matching HeroOverviewSection style */}
      <section
        className="relative py-6 px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef6fb 60%, #f0f7e6 100%)",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {/* Background Glow */}
        <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full blur-3xl opacity-20 bg-[#00C9A7]" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[240px] h-[240px] rounded-full blur-3xl opacity-10 bg-[#013D54]" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C9A7]/15 bg-[#00C9A7]/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-DGXgreen mb-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-DGXgreen" />
            Powered by GI Ventures
          </div>

          {/* Heading */}
          <h1
            className="font-['Syne'] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-gray-900"
            style={{
              fontSize: "clamp(38px,5vw,64px)",
            }}
          >
            One Platform
            <br />
            for
            <br />
            <span className="text-DGXgreen">Every Dimension</span>
            <br />
            of AI
          </h1>

          {/* Description */}
          <p
            className="text-base leading-relaxed mb-8 max-w-2xl"
            style={{ color: "#4b5563" }}
          >
            From curious beginners to working professionals — structured,
            hands-on AI programs built for the real world. Pick your path. Learn
            at your pace.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pb-16">
        {/* Feature Pills */}
        <div className="mb-12 mt-12 flex flex-wrap justify-center gap-4">
          {[
            {
              label: "Self-paced",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-DGXgreen"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7v5l3 2"
                  />
                </svg>
              ),
            },
            {
              label: "Independent Path Selection",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-DGXgreen"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h10M4 17h7"
                  />
                </svg>
              ),
            },
            {
              label: "Blogs & Discussions",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-DGXgreen"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h8M8 14h5m-7 6l-3-3V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H8z"
                  />
                </svg>
              ),
            },
            {
              label: "Quizzes & Assessments",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-DGXgreen"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9h6M9 13h3m-7 8h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              label: "Certificates & Badges",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-DGXgreen"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l2.5 5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1L12 3z"
                  />
                </svg>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex min-w-[260px] items-center gap-4 rounded-2xl border border-[#00C9A7]/12 bg-white px-5 py-4"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00C9A7]/6">
                {item.icon}
              </div>

              {/* Content */}
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900 leading-none">
                  {item.label}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  AI Learning Feature
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-200 my-10"></div>

        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold tracking-[0.18em] text-DGXgreen uppercase mb-5">
            What's inside the platform
          </div>

          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">
            Built For
            <br />
            <span className="text-DGXgreen">Modern AI Learning</span>
          </h2>

          <p className="mt-6 text-base text-gray-500 leading-relaxed max-w-3xl">
            A complete AI learning ecosystem focused on practical
            implementation, industry workflows, collaborative learning, and
            real-world outcomes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              title: "100% Hands-on",
              description:
                "Build production-ready AI workflows through guided labs, projects, and implementation-driven learning.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9l3 3-3 3M13 15h3M4 5h16v14H4V5z"
                  />
                </svg>
              ),
            },
            {
              title: "Certificates & Badges",
              description:
                "Earn milestone-based certifications and verifiable credentials across every program.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l2.5 5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1L12 3z"
                  />
                </svg>
              ),
            },
            {
              title: "Integrated Quizzes",
              description:
                "Continuous knowledge validation with interactive assessments and practical checkpoints.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9h6M9 13h3m-7 8h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "Blogs & Discussions",
              description:
                "Engage with technical discussions, AI trends, research updates, and community-driven insights.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h8M8 14h5m-7 6l-3-3V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H8z"
                  />
                </svg>
              ),
            },
            {
              title: "Flexible Learning Paths",
              description:
                "Choose any program independently and customize your AI learning journey without restrictions.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h11M4 12h16M4 17h9"
                  />
                </svg>
              ),
            },
            {
              title: "Self-paced Access",
              description:
                "Learn anytime with lifetime access to modules, projects, recordings, and platform resources.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7v5l3 2"
                  />
                </svg>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-[#00C9A7]/12 bg-white px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#00C9A7]/30"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00C9A7]/6 text-DGXgreen">
                  {item.icon}
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="font-['Syne'] text-lg font-bold leading-tight text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 border border-[#00C9A7]/15 rounded-[32px] bg-white p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            {/* Left Content */}
            <div className="max-w-3xl">
              {/* Top Label */}
              <div className="text-xs font-medium tracking-[0.18em] text-DGXgreen uppercase mb-4">
                DGX AI Ecosystem
              </div>

              {/* Heading */}
              <h2 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-[-0.02em] text-gray-900">
                Your AI
                <br />
                <span className="text-DGXgreen">Journey Starts Here</span>
              </h2>

              {/* Description */}
              <p className="mt-6 text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl">
                From foundational concepts to real-world AI deployment —
                immersive, structured programs designed for students,
                developers, and future AI engineers.
              </p>

              {/* Feature Tags */}
              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  {
                    label: "Hands-on Projects",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h16M4 17h10"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Self-paced Learning",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7v5l3 2"
                        />
                      </svg>
                    ),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 rounded-full border border-[#00C9A7]/15 bg-[#00C9A7]/5 px-5 py-2.5 text-sm font-semibold text-DGXgreen"
                  >
                    <div className="flex items-center justify-center text-DGXgreen">
                      {item.icon}
                    </div>

                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Choose Your Path Section */}
        <div
          id="choose-your-path"
          className="mt-8 text-[11px] font-medium tracking-[0.18em] text-DGXgreen uppercase mb-5"
        ></div>

        {/* Section Label */}
        <section id="choose-your-path">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#00C9A7]/15 bg-white px-5 py-2.5 mb-5">
            <div className="relative flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-DGXgreen"></div>

              <div className="absolute h-4 w-4 rounded-full border border-[#00C9A7]/30 animate-ping"></div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-DGXgreen">
              Choose your path
            </span>
          </div>

          {/* Your cards/components here */}
        </section>
        {/* ModuleCardNative - It will fetch and display its own data */}
        <ModuleCardNative />
      </div>
    </div>
  );
};

export default LearningPathNative;
