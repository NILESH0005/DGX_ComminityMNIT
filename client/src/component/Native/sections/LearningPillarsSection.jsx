const pillars = [
  {
    title: "Computer Vision",
    desc: "YOLO · CNNs · Vision Transformers · U-Net — object detection, tracking, segmentation",
    iconBg: "#eef6fb",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      </svg>
    ),
  },
  {
    title: "GPU Infrastructure",
    desc: "Operate DGX platform clusters with Docker, Kubernetes, and GPU resource optimisation",
    iconBg: "#f0f7e6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#76B900" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="2" x2="9" y2="4" /><line x1="15" y1="2" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="22" /><line x1="15" y1="20" x2="15" y2="22" />
        <line x1="2" y1="9" x2="4" y2="9" /><line x1="2" y1="15" x2="4" y2="15" />
        <line x1="20" y1="9" x2="22" y2="9" /><line x1="20" y1="15" x2="22" y2="15" />
      </svg>
    ),
  },
  {
    title: "GenAI & LLM Engineering",
    desc: "Fine-tune LLMs with LoRA/PEFT, deploy via NIM, craft structured prompts and outputs",
    iconBg: "#fef9ec",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "RAG & Agentic AI",
    desc: "Vector databases, LangChain tool-calling, retrieval pipelines with multi-format document ingestion",
    iconBg: "#eef6fb",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: "Responsible AI",
    desc: "NVIDIA NeMo Guardrails — prevent hallucinations, bias, and unsafe outputs in production",
    iconBg: "#fff0f0",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "End-to-End Delivery",
    desc: "Dataset → training → containerised deployment across CV, NLP, and multi-modal projects",
    iconBg: "#f0f7e6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#76B900" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const LearningPillarsSection = () => (
  <section className="py-12 px-6 bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6b7280" }}>
        What You Will Learn
      </p>
      <h2 className="font-bold mb-2" style={{ fontSize: "clamp(20px,3vw,28px)", color: "#013D54" }}>
        Six pillars. One complete AI engineer.
      </h2>
      <p className="text-sm mb-7" style={{ color: "#6b7280" }}>
        Every module is immediately applied in projects — no isolated theory, no toy datasets.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="rounded-lg p-5 transition-all duration-200 cursor-default"
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(1,61,84,0.09)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              className="flex items-center justify-center rounded-md mb-3"
              style={{ width: 32, height: 32, background: p.iconBg }}
            >
              {p.icon}
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: "#013D54" }}>{p.title}</div>
            <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LearningPillarsSection;