import React, { useContext } from "react";
import { Cpu, ArrowRight } from "lucide-react";
import ApiContext from "../../context/ApiContext";

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
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert("Unable to access DGX");
      return;
    }

    const DGX_SERVER_URL = import.meta.env.VITE_DGX_SERVER_URL;

    const accessURL = `${DGX_SERVER_URL}/?token=${encodeURIComponent(
      data.token
    )}`;

    // Open in a new tab
    window.open(accessURL, "_blank", "noopener,noreferrer");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] bg-cyan-500/10 blur-[120px] lg:blur-[180px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="uppercase tracking-[4px] md:tracking-[6px] text-DGXgreen text-xs sm:text-sm">
            Secure Infrastructure Access
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 md:mt-5 leading-tight">
            DGX Command Portal
          </h2>

          <p className="text-DGXgreen max-w-3xl mx-auto mt-5 md:mt-6 text-base md:text-lg leading-relaxed px-2">
            Access enterprise-grade AI infrastructure, GPU clusters, AI
            research environments, and secure administrative systems through a
            unified DGX access gateway.
          </p>
        </div>

        {/* Main Container */}
        <div className="relative overflow-hidden rounded-[24px] md:rounded-[36px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent p-6 sm:p-8 md:p-10 lg:p-14 group hover:-translate-y-1 lg:hover:-translate-y-2 transition-all duration-500">
          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-cyan-500/5" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-DGXgreen/10 border border-cyan-400/20 flex items-center justify-center mx-auto lg:mx-0">
                <Cpu
                  className="text-cyan-400"
                  size={window.innerWidth < 640 ? 32 : 48}
                />
              </div>

              <p className="uppercase tracking-[3px] md:tracking-[4px] text-DGXgreen text-xs sm:text-sm mt-6 md:mt-8">
                Unified AI Infrastructure Access
              </p>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 md:mt-5 leading-tight">
                Launch DGX Environment
              </h3>

              <p className="text-slate-300 mt-5 md:mt-6 leading-relaxed text-base md:text-lg">
                Securely access DGX AI infrastructure with intelligent
                role-based routing for students, researchers, administrators,
                and enterprise operators.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-10">
                <div className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  GPU Accelerated Access
                </div>

                <div className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  AI Research Workspace
                </div>

                <div className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  Enterprise Security
                </div>

                <div className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  Role-Based Control
                </div>
              </div>
            </div>

            {/* Right CTA */}
            <div className="flex flex-col items-center w-full lg:w-auto">
              <button
                onClick={handleAccess}
                className="group/btn inline-flex items-center justify-center gap-3 md:gap-4 w-full sm:w-auto px-6 sm:px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-DGXgreen hover:bg-cyan-400 transition-all duration-300 text-white font-semibold text-base md:text-lg shadow-2xl shadow-cyan-500/30"
              >
                Access DGX Portal

                <ArrowRight
                  size={22}
                  className="group-hover/btn:translate-x-1 transition-all duration-300"
                />
              </button>

              <p className="text-slate-400 text-sm mt-4 md:mt-5 text-center max-w-xs">
                Intelligent routing based on your access privileges
              </p>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="mt-10 md:mt-14 flex flex-wrap justify-center gap-3 md:gap-6">
          <div className="px-4 md:px-5 py-2 md:py-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 text-xs sm:text-sm text-center">
            AI Infrastructure Active
          </div>

          <div className="px-4 md:px-5 py-2 md:py-3 rounded-full border border-green-400/20 bg-green-500/10 text-green-300 text-xs sm:text-sm text-center">
            GPU Nodes Online
          </div>

          <div className="px-4 md:px-5 py-2 md:py-3 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-xs sm:text-sm text-center">
            Enterprise Secure Access
          </div>
        </div>
      </div>
    </section>
  );
};

export default DGXAccessPortal;