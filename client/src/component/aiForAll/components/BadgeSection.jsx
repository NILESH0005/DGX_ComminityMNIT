import React from "react";

const badges = [
  {
    icon: "🌱",
    title: "AI Explorer",
    level: "Beginner Badge",
    xp: "250 XP",
    desc: "Awarded for completing your first AI awareness modules and learning the basics of AI tools.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: "⚡",
    title: "Prompt Master",
    level: "Skill Badge",
    xp: "500 XP",
    desc: "Earned after mastering prompt engineering and building effective AI workflows.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: "🎨",
    title: "AI Creator",
    level: "Creative Badge",
    xp: "750 XP",
    desc: "Recognizes students who create AI-powered content, presentations, and projects.",
    color: "from-pink-500 to-violet-600",
  },
  {
    icon: "🚀",
    title: "Innovation Champion",
    level: "Project Badge",
    xp: "1200 XP",
    desc: "Awarded for completing hands-on AI innovation challenges and collaborative projects.",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: "🏆",
    title: "AI Leader",
    level: "Leadership Badge",
    xp: "2000 XP",
    desc: "Given to learners who actively contribute, mentor peers, and lead AI learning initiatives.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: "🤖",
    title: "Future AI Innovator",
    level: "Elite Badge",
    xp: "5000 XP",
    desc: "The highest AI achievement awarded to top-performing future-ready AI learners.",
    color: "from-violet-600 to-indigo-700",
  },
];

export default function BadgeSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#050810] overflow-hidden">

      {/* Background Glow */}
      <div className="absolute left-0 top-0 w-72 h-72 bg-green-500/10 blur-[120px] rounded-full" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">

        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ AI Achievement System
        </div>

        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Earn AI Badges & Achievements
        </h2>

        <p className="text-zinc-400 text-lg leading-relaxed">
          Unlock milestone-based badges, level up your AI profile,
          and showcase your learning achievements across the AI ecosystem.
        </p>

      </div>

      {/* Badges Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {badges.map((badge, index) => (

          <div
            key={index}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] p-8 hover:border-green-400/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >

            {/* Glow Effect */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${badge.color} blur-[120px]`}
            />

            {/* Content */}
            <div className="relative z-10">

              {/* Badge Icon */}
              <div
                className={`w-24 h-24 rounded-[28px] bg-gradient-to-br ${badge.color} flex items-center justify-center text-5xl shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                {badge.icon}
              </div>

              {/* Badge Level */}
              <div className="inline-flex items-center bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {badge.level}
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {badge.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {badge.desc}
              </p>

              {/* XP */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="w-3 h-3 rounded-full bg-green-400" />

                  <span className="text-green-400 font-semibold text-sm">
                    {badge.xp}
                  </span>

                </div>

                <button className="text-white/70 hover:text-green-400 text-sm font-semibold transition-colors duration-300">
                  View Badge →
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Bottom Achievement Strip */}
      <div className="relative z-10 mt-20 max-w-6xl mx-auto">

        <div className="bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-violet-500/10 border border-white/10 rounded-[36px] p-10 backdrop-blur-xl">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                ✦ AI Progression System
              </div>

              <h3
                className="text-4xl font-bold text-white mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Level Up Your AI Journey
              </h3>

              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Earn XP through learning modules, AI projects, quizzes,
                challenges, and community participation to unlock
                advanced achievements and elite AI recognition.
              </p>

              <div className="flex flex-wrap gap-4">

                <button className="bg-green-400 hover:bg-green-300 text-black font-bold px-7 py-4 rounded-2xl transition-all duration-300 hover:scale-105">
                  Start Earning XP
                </button>

                <button className="border border-white/15 hover:border-green-400 hover:text-green-400 text-white px-7 py-4 rounded-2xl transition-all duration-300">
                  Explore Challenges
                </button>

              </div>

            </div>

            {/* RIGHT */}
            <div className="relative">

              <div className="bg-[#050810] border border-white/10 rounded-[32px] p-8 overflow-hidden">

                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 blur-[100px]" />

                {/* User Card */}
                <div className="relative z-10">

                  <div className="flex items-center justify-between mb-8">

                    <div>

                      <h4 className="text-2xl font-bold text-white">
                        Student Achievement
                      </h4>

                      <p className="text-zinc-400 text-sm">
                        Personalized AI profile
                      </p>

                    </div>

                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-black font-black text-xl">
                      AI
                    </div>

                  </div>

                  {/* XP Progress */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">

                    <div className="flex justify-between mb-3">

                      <span className="text-zinc-300">
                        Current Level
                      </span>

                      <span className="text-green-400 font-bold">
                        Level 12
                      </span>

                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                      <div className="bg-green-400 h-full w-[76%]" />
                    </div>

                    <p className="text-zinc-500 text-xs mt-3">
                      7,600 XP / 10,000 XP needed for next level
                    </p>

                  </div>

                  {/* Achievement Stats */}
                  <div className="grid grid-cols-2 gap-4">

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                      <p className="text-zinc-400 text-sm mb-2">
                        Total Badges
                      </p>

                      <h3 className="text-3xl font-bold text-white">
                        18
                      </h3>

                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                      <p className="text-zinc-400 text-sm mb-2">
                        Challenges Won
                      </p>

                      <h3 className="text-3xl font-bold text-white">
                        07
                      </h3>

                    </div>

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