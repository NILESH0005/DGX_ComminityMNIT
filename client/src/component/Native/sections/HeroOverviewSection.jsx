import { useNavigate, useLocation } from "react-router-dom";

const HeroOverviewSection = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { moduleId, moduleName, uiType, hasCertificate } = location.state || {};

  const handleGetStarted = () => {
    const encodedId = btoa(moduleId.toString());

    navigate(`/module/${encodedId}`, {
      state: {
        moduleId,
        moduleName,
        uiType,
        hasCertificate,
      },
    });
  };

  const meta = [
    {
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "80 Hours Total",
    },
    {
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      label: "Odd + Even Semester 2026–27",
    },
    {
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      label: "Lecture + Hands-on + Capstone",
    },
    {
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: "7 Full-Stack Projects",
    },
  ];

  return (
    <section
      className="relative py-16 px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef6fb 60%, #f0f7e6 100%)",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* Background Glow */}
      <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full blur-3xl opacity-20 bg-[#76B900]" />

      <div className="absolute bottom-[-120px] left-[-80px] w-[240px] h-[240px] rounded-full blur-3xl opacity-10 bg-[#013D54]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold tracking-widest uppercase mb-5"
          style={{
            background: "#f0f7e6",
            color: "#76B900",
            border: "1px solid #c6e580",
          }}
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: "#76B900" }}
          />
          Powered by NVIDIA DGX Platform
        </div>

        {/* Heading */}
        <h1
          className="font-bold leading-tight mb-5"
          style={{
            color: "#111",
            fontSize: "clamp(32px,5vw,54px)",
          }}
        >
          Train on <span style={{ color: "#76B900" }}>Real AI.</span>
          <br />
          Build What Matters.
        </h1>

        {/* Description */}
        <p
          className="text-base leading-relaxed mb-8 max-w-2xl"
          style={{ color: "#4b5563" }}
        >
          An 80-hour industry program bridging the gap between AI theory and
          production deployment — from computer vision to agentic systems, on
          enterprise-grade hardware.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={handleGetStarted}
            className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] shadow-lg"
            style={{
              background: "linear-gradient(135deg, #76B900 0%, #5f9400 100%)",
            }}
          >
            Get Started
          </button>

          <button
            onClick={() => {
              const section = document.getElementById("semester-structure");
              section?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-7 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 hover:bg-[#013D54]/5"
            style={{
              borderColor: "#d1d5db",
              color: "#013D54",
              background: "#ffffff",
            }}
          >
            View Curriculum
          </button>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-5">
          {meta.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm"
              style={{ color: "#6b7280" }}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className="max-w-4xl mx-auto mt-12 border-t"
        style={{ borderColor: "#e2e8f0" }}
      />
    </section>
  );
};

export default HeroOverviewSection;
