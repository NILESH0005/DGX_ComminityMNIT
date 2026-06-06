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
    <section className="py-28">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {" "}
        <div className="grid md:grid-cols-3 gap-8">
          {" "}
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500"
              >
                {" "}
                <Icon className="text-DGXgreen mb-6" size={42} />{" "}
                <h3 className="text-3xl font-bold text-white">
                  {" "}
                  {item.title}{" "}
                </h3>{" "}
                <p className="text-slate-300 mt-5 leading-relaxed">
                  {" "}
                  {item.desc}{" "}
                </p>{" "}
              </div>
            );
          })}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default FeaturesSection;
