import React from "react";
import { motion } from "framer-motion";
import { images } from "../../../public";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] md:bg-[size:70px_70px]" />

      {/* GLOW */}
      <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-cyan-500/20 blur-[120px] md:blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <p className="uppercase tracking-[4px] md:tracking-[6px] text-white text-xs sm:text-sm mb-4 md:mb-5">
              AI Infrastructure
            </p>

            <h1 className="font-bold text-white leading-tight text-4xl sm:text-5xl md:text-6xl xl:text-7xl">
              Powering The Future
              <span className="block text-DGXgreen">
                Of AI Infrastructure
              </span>
            </h1>

            <p className="mt-6 md:mt-8 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Enterprise-grade NVIDIA DGX deployments for universities, AI
              labs, and research institutions.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center items-center min-h-[280px] sm:min-h-[350px] md:min-h-[450px]">
            {/* Outer Ring */}
            <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] border border-cyan-400/20 rounded-full animate-ping" />

            {/* Inner Ring */}
            <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] border border-cyan-400/10 rounded-full" />

            <motion.img
              src={images.AnimatedDGX}
              alt="DGX"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="
                relative z-10
                w-full
                max-w-[280px]
                sm:max-w-[400px]
                md:max-w-[550px]
                lg:max-w-[650px]
                object-contain
                drop-shadow-[0_30px_80px_rgba(0,255,255,0.35)]
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;