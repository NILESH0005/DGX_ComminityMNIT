import React, { useContext } from "react";
import { Cpu, ArrowRight } from "lucide-react";
import ApiContext from "../../context/ApiContext";
import { use } from "react";

const DGXAccessPortal = () => {
  const { user, userToken } = useContext(ApiContext);

  console.log("ehoooo teh usseerr", user);

  const handleAccess = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASEURL}lms/generate-dgx-token`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        },
      );

      const data = await response.json();

      if (!data.success) {
        alert("Unable to access DGX");
        return;
      }

      const DGX_SERVER_URL = import.meta.env.VITE_DGX_SERVER_URL;

      const accessURL = `${DGX_SERVER_URL}/?token=${encodeURIComponent(
        data.token,
      )}`;

      window.location.href = accessURL;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-[180px] rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[6px] text-DGXgreen text-sm">
            Secure Infrastructure Access
          </p>

          <h2 className="text-4xl md:text-6xl font-bold text-white mt-5">
            DGX Command Portal
          </h2>

          <p className="text-DGXgreen max-w-3xl mx-auto mt-6 text-lg leading-relaxed">
            Access enterprise-grade AI infrastructure, GPU clusters, AI research
            environments, and secure administrative systems through a unified
            DGX access gateway.
          </p>
        </div>

        {/* Single Access Container */}
        <div className="relative overflow-hidden rounded-[36px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent p-10 md:p-14 group hover:-translate-y-2 transition-all duration-500">
          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-cyan-500/5"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="w-24 h-24 rounded-3xl bg-DGXgreen/10 border border-cyan-400/20 flex items-center justify-center">
                <Cpu className="text-cyan-400" size={48} />
              </div>

              <p className="uppercase tracking-[4px] text-DGXgreen text-sm mt-8">
                Unified AI Infrastructure Access
              </p>

              <h3 className="text-5xl font-bold text-white mt-5 leading-tight">
                Launch DGX Environment
              </h3>

              <p className="text-slate-300 mt-6 leading-relaxed text-lg">
                Securely access DGX AI infrastructure with intelligent
                role-based routing for students, researchers, administrators,
                and enterprise operators.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mt-10">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  GPU Accelerated Access
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  AI Research Workspace
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Enterprise Security
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Role-Based Control
                </div>
              </div>
            </div>

            {/* Right Side CTA */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleAccess}
                className="group/btn inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-DGXgreen hover:bg-cyan-400 transition-all duration-300 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/30"
              >
                Access DGX Portal
                <ArrowRight
                  size={24}
                  className="group-hover/btn:translate-x-1 transition-all duration-300"
                />
              </button>

              <p className="text-slate-400 text-sm mt-5 text-center">
                Intelligent routing based on your access privileges
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          <div className="px-5 py-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 text-sm">
            AI Infrastructure Active
          </div>

          <div className="px-5 py-3 rounded-full border border-green-400/20 bg-green-500/10 text-green-300 text-sm">
            GPU Nodes Online
          </div>

          <div className="px-5 py-3 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-sm">
            Enterprise Secure Access
          </div>
        </div>
      </div>
    </section>
  );
};

export default DGXAccessPortal;
