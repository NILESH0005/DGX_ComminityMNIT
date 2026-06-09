import React from "react";
import { BrainCircuit, Database, Zap } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Generative AI",
    desc: "Power LLMs and AI research infrastructure.",
  },
  {
    icon: Database,
    title: "AI Data Centers",
    desc: "Scalable GPU clusters for enterprise workloads.",
  },
  {
    icon: Zap,
    title: "High Performance",
    desc: "Accelerated compute for universities and labs.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  bg-gradient-to-br
                  from-cyan-500/10
                  via-white/5
                  to-transparent
                  border
                  border-white/10
                  rounded-2xl
                  lg:rounded-3xl
                  p-5
                  sm:p-6
                  lg:p-8
                  text-center
                  md:text-left
                  hover:-translate-y-1
                  lg:hover:-translate-y-2
                  transition-all
                  duration-500
                "
              >
                <Icon
                  className="
                    text-DGXgreen
                    mb-4
                    md:mb-6
                    mx-auto
                    md:mx-0
                    w-10
                    h-10
                    sm:w-12
                    sm:h-12
                  "
                />

                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {item.title}
                </h3>

                <p className="text-slate-300 mt-4 md:mt-5 leading-relaxed text-sm sm:text-base">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;