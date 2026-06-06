import React from "react";
const CTASection = () => {
  return (
    <section className="py-28">
      {" "}
      <div className="max-w-5xl mx-auto px-6">
        {" "}
        <div className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent p-14 text-center">
          {" "}
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>{" "}
          <div className="relative z-10">
            {" "}
            <p className="uppercase tracking-[6px] text-DGXgreen text-sm">
              {" "}
              AI Infrastructure Solutions{" "}
            </p>{" "}
            <h2 className="text-5xl font-bold text-white mt-5 leading-tight">
              {" "}
              Ready To Build Your{" "}
              <span className="block text-DGXgreen">
                {" "}
                AI Innovation Lab?{" "}
              </span>{" "}
            </h2>{" "}
            <p className="text-slate-300 mt-8 max-w-2xl mx-auto text-lg">
              {" "}
              Deploy enterprise-grade NVIDIA DGX systems for modern AI research,
              generative AI, and accelerated computing environments.{" "}
            </p>{" "}
            <button className="mt-10 px-8 py-4 rounded-xl bg-DGXgreen hover:bg-white transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/30">
              {" "}
              Contact Our Team{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default CTASection;
