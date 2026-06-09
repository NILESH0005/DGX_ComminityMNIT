import React from "react";

const stats = [
  { value: "32 PFLOPS", label: "AI Performance" },
  { value: "1128GB", label: "GPU Memory" },
  { value: "400Gb/s", label: "Networking" },
  { value: "Enterprise", label: "AI Stack" },
];

const StatsSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, index) => (
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
                backdrop-blur-xl
                hover:-translate-y-1
                lg:hover:-translate-y-2
                transition-all
                duration-500
                text-center
              "
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-DGXgreen break-words">
                {item.value}
              </h2>

              <p className="text-white mt-2 sm:mt-3 text-sm sm:text-base">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;