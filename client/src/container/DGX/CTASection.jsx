import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            md:rounded-[32px]
            lg:rounded-[40px]
            border
            border-cyan-400/20
            bg-gradient-to-br
            from-cyan-500/10
            via-white/5
            to-transparent
            p-6
            sm:p-8
            md:p-10
            lg:p-14
            text-center
          "
        >
          {/* Glow */}
          <div
            className="
              absolute
              top-0
              left-0
              w-40
              h-40
              sm:w-56
              sm:h-56
              lg:w-72
              lg:h-72
              bg-cyan-500/20
              blur-[80px]
              sm:blur-[100px]
              lg:blur-[120px]
              rounded-full
            "
          />

          <div className="relative z-10">
            <p className="uppercase tracking-[4px] md:tracking-[6px] text-DGXgreen text-xs sm:text-sm">
              AI Infrastructure Solutions
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 md:mt-5 leading-tight">
              Ready To Build Your
              <span className="block text-DGXgreen">
                AI Innovation Lab?
              </span>
            </h2>

            <p className="text-slate-300 mt-6 md:mt-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Deploy enterprise-grade NVIDIA DGX systems for modern AI
              research, generative AI, and accelerated computing
              environments.
            </p>

            <button
              onClick={() => navigate("/ContactUs")}
              className="
                mt-8
                md:mt-10
                w-full
                sm:w-auto
                px-6
                sm:px-8
                py-3
                sm:py-4
                rounded-xl
                bg-DGXgreen
                hover:bg-white
                transition-all
                duration-300
                font-semibold
                shadow-lg
                shadow-cyan-500/30
              "
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;