// components/LearningPathNative.jsx (Updated - Fully Responsive)
import React from "react";
import ModuleCardNative from "./ModuleCardNative";

const LearningPathNative = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pb-16">
        {/* Header with Logo and Live Indicator */}
        <div className="flex items-center justify-between pt-5 pb-4 border-b border-gray-200">
          <div className="text-xs font-bold tracking-[0.12em] text-DGXblue uppercase font-['Syne']">
            Global <span className="text-DGXgreen">Infoventures</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-DGXgreen animate-pulse"></div>
            3 programs live
          </div>
        </div>
        {/* Hero Section */}
        <div className="py-10 md:py-14">
          <div className="text-xs font-medium tracking-[0.18em] text-DGXblue uppercase mb-4">
            AI Learning Platform
          </div>
          <h1 className="font-['Syne'] text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-[-0.02em] text-gray-900 mb-5">
            One Platform.
            <br />
            <span className="text-DGXgreen">Every Dimension</span> of AI.
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed mb-9">
            From curious beginners to working professionals — structured,
            hands-on AI programs built for the real world. Pick your path. Learn
            at your pace.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                value: "3",
                label: "Programs Running",
                subtitle: "Active AI learning paths",
              },
              {
                value: "100%",
                label: "Hands-on Learning",
                subtitle: "Project-based experience",
              },
              {
                value: "∞",
                label: "Self-paced Access",
                subtitle: "Learn anytime, anywhere",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-[#00C9A7]/12 bg-white px-7 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#00C9A7]/30"
              >
                {/* Top Accent */}
                <div className="absolute top-0 left-0 h-1 w-full bg-[#00C9A7]"></div>

                {/* Mini Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00C9A7]/10 bg-[#00C9A7]/5 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#00C9A7]"></div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-DGXgreen">
                    DGX Platform
                  </span>
                </div>

                {/* Main Number */}
                <div className="font-['Syne'] text-5xl md:text-6xl font-extrabold leading-none tracking-[-0.04em] text-DGXgreen">
                  {item.value}
                </div>

                {/* Title */}
                <h3 className="mt-5 font-['Syne'] text-xl font-bold text-gray-900 leading-tight">
                  {item.label}
                </h3>

                {/* Subtitle */}
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {item.subtitle}
                </p>

                {/* Bottom Line */}
                <div className="mt-7 flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-[#00C9A7]/10"></div>

                  <div className="h-2 w-2 rounded-full bg-[#00C9A7]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Feature Pills */}
      
        <div className="mb-12 flex flex-wrap gap-3">
          {[
            {
              label: "Certificates & Badges",
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
                    d="M12 3l2.5 5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1L12 3z"
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
                  className="h-5 w-5"
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
              label: "Self-paced",
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
            {
              label: "Quizzes & Assessments",
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
                    d="M9 9h6M9 13h3m-7 8h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
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
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h8M8 14h5m-7 6l-3-3V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H8z"
                  />
                </svg>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-[#00C9A7]/12 bg-white px-5 py-3"
            >
              {/* Icon Box */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C9A7]/6 text-DGXgreen">
                {item.icon}
              </div>

              {/* Text */}
              <div>
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
        {/* Section Label */}
        <section id="choose-your-path" className="mt-16">
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
        <div className="h-px bg-gray-200 my-10"></div>
        {/* Platform Features */}
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold tracking-[0.18em] text-DGXgreen uppercase mb-5">
            What's inside the platform
          </div>

          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">
            Built For
            <br />
            <span className="text-DGXgreen">Modern AI Learning.</span>
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
              className="group rounded-[28px] border border-[#00C9A7]/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#00C9A7]/30"
            >
              {/* Icon */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00C9A7]/8 text-DGXgreen">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-['Syne'] text-2xl font-bold leading-tight text-gray-900 mb-4">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[15px] leading-7 text-gray-500">
                {item.description}
              </p>
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
                <span className="text-DGXgreen">Journey Starts Here.</span>
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
                    label: "Industry Mentors",
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
                          d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0"
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

            {/* Right CTA */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  const section = document.getElementById("choose-your-path");

                  if (section) {
                    section.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-DGXgreen px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <span>Explore Programs</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Choose Your Path Section */}
        <div
          id="choose-your-path"
          className="mt-16 text-[11px] font-medium tracking-[0.18em] text-DGXgreen uppercase mb-5"
        ></div>
      </div>
    </div>
  );
};

export default LearningPathNative;
