const roles = [
  {
    title: "AI/ML Engineer",
    sub: "PyTorch · TensorFlow · Deployment",
    iconStroke: "#013D54",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Computer Vision Engineer",
    sub: "YOLO · CNNs · OpenCV · Segmentation",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      </svg>
    ),
  },
  {
    title: "MLOps Engineer",
    sub: "Docker · Kubernetes · CI/CD",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#76B900" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    title: "GenAI / LLM Engineer",
    sub: "RAG · Agents · NIM · Hugging Face",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "AI Solutions Architect",
    sub: "System Design · Multi-modal AI",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#76B900" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Responsible AI Specialist",
    sub: "Guardrails · NeMo · Bias Mitigation",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const techStack = [
  "NVIDIA DGX Platform", "PyTorch", "TensorFlow", "YOLO", "OpenCV",
  "Hugging Face", "LoRA / PEFT", "vLLM", "LangChain", "NeMo Guardrails",
  "Docker", "Kubernetes", "NVIDIA NIM", "Gemini API", "Vector DB",
  "scikit-learn", "U-Net", "Vision Transformers",
];

const CareerTechStackSection = () => (
  <section className="py-12 px-6 bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
    <div className="max-w-4xl mx-auto">
      <h2 className="font-bold mb-2" style={{ fontSize: "clamp(20px,3vw,26px)", color: "#013D54" }}>
        Six high-demand roles. One program.
      </h2>
      <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
        Graduates emerge ready for specialised AI engineering positions across industry tracks.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-10">
        {roles.map((r, i) => (
          <div
            key={i}
            className="rounded-lg p-5 text-center transition-all duration-200"
            style={{ background: "#fff", border: "1px solid #e2e8f0" }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(1,61,84,0.09)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div className="mb-3">{r.icon}</div>
            <div className="text-sm font-semibold mb-1" style={{ color: "#111" }}>{r.title}</div>
            <div className="text-xs" style={{ color: "#6b7280" }}>{r.sub}</div>
          </div>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "0 0 32px" }} />

      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6b7280" }}>
        Tech Stack
      </p>
      <h2 className="font-bold mb-2" style={{ fontSize: "22px", color: "#013D54" }}>
        Industry tools from day one.
      </h2>
      <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
        No toy environments. You train and deploy on the same infrastructure used in production AI labs.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {techStack.map((t, i) => (
          <span
            key={i}
            className="text-xs font-medium px-4 py-1 rounded-full transition-all duration-200"
            style={{
              border: "1px solid #e2e8f0",
              color: "#374151",
              background: "#fff",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#76B900";
              e.currentTarget.style.color = "#76B900";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.color = "#374151";
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default CareerTechStackSection;