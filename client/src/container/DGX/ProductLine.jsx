import React from "react";
import { Cpu } from "lucide-react";

const products = [
  { title: "DGX A100", status: "Production" },
  { title: "DGX H100", status: "Enterprise AI" },
  { title: "DGX H200", status: "Advanced AI" },
  { title: "DGX B200", status: "Coming Soon" },
];

const ProductLine = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="uppercase tracking-[4px] md:tracking-[6px] text-DGXgreen text-xs sm:text-sm">
            DGX Product Line
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 md:mt-5 leading-tight">
            AI Infrastructure Portfolio
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((item, index) => (
            <div
              key={index}
              className="
                relative
                overflow-hidden
                rounded-2xl lg:rounded-3xl
                p-5 sm:p-6 lg:p-8
                bg-gradient-to-br
                from-cyan-500/10
                via-white/5
                to-transparent
                border border-white/10
                group
                hover:-translate-y-1
                lg:hover:-translate-y-3
                transition-all
                duration-500
              "
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-cyan-500/5" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-DGXgreen/10 border border-cyan-400/20 flex items-center justify-center mb-5 sm:mb-6">
                  <Cpu className="text-DGXgreen w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white break-words">
                  {item.title}
                </h3>

                {/* Status */}
                <div className="mt-5 sm:mt-6 inline-flex px-3 sm:px-4 py-2 rounded-full bg-DGXgreen/10 border border-cyan-400/20 text-DGXgreen text-xs sm:text-sm">
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductLine;