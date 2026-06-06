import React from "react";
import { motion } from "framer-motion";
import { images } from "../../../public";
const HeroSection = () => {
  return (
    <section className="relative  overflow-hidden">
      {" "}
      {/* GRID */}{" "}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />{" "}
      {/* GLOW */}{" "}
      <div className="absolute top-0 left-0  bg-cyan-500/20 blur-[150px] rounded-full"></div>{" "}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {" "}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {" "}
          {/* LEFT */}{" "}
          <div>
            {" "}
            <p className="uppercase tracking-[6px] text-white text-sm mb-5">
              {" "}
              AI Infrastructure{" "}
            </p>{" "}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {" "}
              Powering The Future{" "}
              <span className="block text-DGXgreen">
                {" "}
                Of AI Infrastructure{" "}
              </span>{" "}
            </h1>{" "}
            <p className="mt-8 text-lg text-slate-300 leading-relaxed">
              {" "}
              Enterprise-grade NVIDIA DGX deployments for universities, AI labs,
              and research institutions.{" "}
            </p>{" "}
          </div>{" "}
          {/* RIGHT */}{" "}
          <div className="relative flex justify-center items-center">
            {" "}
            <div className="absolute w-[500px] h-[500px] border border-cyan-400/20 rounded-full animate-ping"></div>{" "}
            <div className="absolute w-[400px] h-[400px] border border-cyan-400/10 rounded-full"></div>{" "}
            <motion.img
              src={images.AnimatedDGX}
              alt="DGX"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-10 w-full max-w-[650px] object-contain drop-shadow-[0_30px_80px_rgba(0,255,255,0.35)]"
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default HeroSection;
