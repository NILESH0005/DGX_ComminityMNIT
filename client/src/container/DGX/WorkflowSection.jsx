import React from "react";

const workflow = [
  "Consultation",
  "Infrastructure Planning",
  "DGX Deployment",
  "Cluster Configuration",
  "AI Environment Setup",
  "Training & Support",
];

const WorkflowSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="uppercase tracking-[4px] md:tracking-[6px] text-DGXgreen text-xs sm:text-sm">
            Deployment Workflow
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 md:mt-5 leading-tight">
            End-to-End Infrastructure Deployment
          </h2>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {workflow.map((item, index) => (
            <div
              key={index}
              className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                lg:rounded-3xl
                p-5
                sm:p-6
                text-center
                hover:-translate-y-1
                lg:hover:-translate-y-2
                transition-all
                duration-500
              "
            >
              {/* Step Number */}
              <div
                className="
                  w-12 h-12
                  sm:w-14 sm:h-14
                  rounded-full
                  bg-DGXgreen/10
                  border
                  border-cyan-400/20
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-4
                  sm:mb-5
                  text-DGXgreen
                  font-bold
                  text-sm
                  sm:text-base
                "
              >
                {index + 1}
              </div>

              <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;