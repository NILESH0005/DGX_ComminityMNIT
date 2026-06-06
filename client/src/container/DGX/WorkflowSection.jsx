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
    <section className="py-28">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {" "}
        <div className="text-center mb-16">
          {" "}
          <p className="uppercase tracking-[6px] text-DGXgreen text-sm">
            {" "}
            Deployment Workflow{" "}
          </p>{" "}
          <h2 className="text-5xl font-bold text-white mt-5">
            {" "}
            End-to-End Infrastructure Deployment{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {" "}
          {workflow.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:-translate-y-2 transition-all duration-500"
            >
              {" "}
              <div className="w-14 h-14 rounded-full bg-DGXgreen/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-5 text-DGXgreen font-bold">
                {" "}
                {index + 1}{" "}
              </div>{" "}
              <p className="text-white font-medium"> {item} </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default WorkflowSection;
