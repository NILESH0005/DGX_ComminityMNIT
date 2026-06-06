import React from "react";
const stats = [
  { value: "32 PFLOPS", label: "AI Performance" },
  { value: "1128GB", label: "GPU Memory" },
  { value: "400Gb/s", label: "Networking" },
  { value: "Enterprise", label: "AI Stack" },
];
const StatsSection = () => {
  return (
    <section className="py-20">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {" "}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:-translate-y-2 transition-all duration-500"
            >
              {" "}
              <h2 className="text-4xl font-bold text-DGXgreen">
                {" "}
                {item.value}{" "}
              </h2>{" "}
              <p className="text-white mt-3"> {item.label} </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default StatsSection;
