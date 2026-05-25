const oddModules = [
  "GPU infrastructure & containerisation",
  "Deep learning & neural networks",
  "Computer vision & object detection",
  "Model training on DGX platform",
  "GenAI foundations & LLM inference",
  "Image segmentation models",
];

const evenModules = [
  "Facial recognition systems",
  "Prompting & structured outputs",
  "LLM fine-tuning with LoRA/PEFT",
  "RAG & vector retrieval",
  "Agentic workflows & guardrails",
  "Capstone — full-stack AI system",
];

const workflow = [
  {
    label: "Lectures",
    sub: "Concept-first, applied immediately",
    color: "#013D54",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="15" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: "Hands-on Sessions",
    sub: "Live coding on DGX platform ",
    color: "#76B900",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#76B900" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    label: "Team Assignments",
    sub: "Collaborative AI project builds",
    color: "#013D54",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#013D54" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Capstone + Viva",
    sub: "Live deployment & assessment",
    color: "#d97706",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" style={{ margin: "auto", display: "block" }}>
        <polyline points="15 14 20 9 15 4" />
        <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
      </svg>
    ),
  },
];

const SemesterStructureSection = () => (
  <section className="py-12 px-6" style={{ background: "#fafbfc", fontFamily: "'IBM Plex Sans', sans-serif" }}>
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6b7280" }}>
        Course Structure
      </p>
      <h2 className="font-bold mb-2" style={{ fontSize: "clamp(20px,3vw,28px)", color: "#013D54" }}>
        Two semesters, progressive depth.
      </h2>
      <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
        Odd semester builds CV and GenAI foundations. Even semester advances into LLMs, RAG, and agentic systems.
      </p>

      {/* Semester Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { title: "Odd Semester", modules: oddModules, dot: "#013D54" },
          { title: "Even Semester", modules: evenModules, dot: "#76B900" },
        ].map((sem, i) => (
          <div key={i} className="rounded-lg p-5" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full inline-block" style={{ width: 8, height: 8, background: sem.dot }} />
                <span className="text-sm font-semibold" style={{ color: "#013D54" }}>{sem.title}</span>
              </div>
              <span className="text-xs font-mono" style={{ color: "#6b7280" }}>40 hrs</span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {sem.modules.map((mod, j) => (
                <li
                  key={j}
                  className="flex items-center gap-2 text-sm py-1"
                  style={{
                    color: "#374151",
                    borderBottom: j < sem.modules.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>›</span>
                  {mod}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Workflow */}
      <h2 className="font-bold mb-1" style={{ fontSize: "20px", color: "#013D54" }}>
        How the program runs
      </h2>
      <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
        Every concept is immediately put to work — no isolated lectures, no toy environments.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {workflow.map((w, i) => (
          <div
            key={i}
            className="rounded-lg p-5 text-center transition-all duration-200"
            style={{ background: "#fff", border: "1px solid #e2e8f0" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(1,61,84,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <div className="mb-3">{w.icon}</div>
            <div className="text-sm font-semibold mb-1" style={{ color: "#111" }}>{w.label}</div>
            <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{w.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SemesterStructureSection;