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
    <section className="py-28">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {" "}
        <div className="text-center mb-16">
          {" "}
          <p className="uppercase tracking-[6px] text-DGXgreen text-sm">
            {" "}
            DGX Product Line{" "}
          </p>{" "}
          <h2 className="text-5xl font-bold text-white mt-5">
            {" "}
            AI Infrastructure Portfolio{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {" "}
          {products.map((item, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent border border-white/10 rounded-3xl p-8 overflow-hidden group hover:-translate-y-3 transition-all duration-500"
            >
              {" "}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-cyan-500/5"></div>{" "}
              <div className="w-16 h-16 rounded-2xl bg-DGXgreen/10 border border-cyan-400/20 flex items-center justify-center mb-6">
                {" "}
                <Cpu className="text-DGXgreen" size={30} />{" "}
              </div>{" "}
              <h3 className="text-3xl font-bold text-white"> {item.title} </h3>{" "}
              <div className="mt-6 inline-flex px-4 py-2 rounded-full bg-DGXgreen/10 border border-cyan-400/20 text-DGXgreen text-sm">
                {" "}
                {item.status}{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default ProductLine;
