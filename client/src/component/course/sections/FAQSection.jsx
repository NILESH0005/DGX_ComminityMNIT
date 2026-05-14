import React, { useState } from "react";

const faqs = [
  {
    category: "Eligibility",
    icon: "👤",
    question: "Who is this program designed for?",
    answer:
      "This program is designed for ML engineers, data scientists, software developers, cloud architects, and IT professionals who want to master GPU-accelerated AI using NVIDIA DGX systems, CUDA, Kubernetes, and modern Generative AI frameworks. It is ideal for enterprise teams looking to upskill on production-grade AI infrastructure.",
  },
  {
    category: "Prerequisites",
    icon: "🔑",
    question: "Is prior CUDA or GPU experience required?",
    answer:
      "No prior CUDA experience is required. The curriculum begins from NVIDIA DGX architecture fundamentals and progressively advances into CUDA programming, distributed training, and inference optimization. Basic Python and ML knowledge is helpful but not mandatory for the AI Awareness and User Enablement tiers.",
  },
  {
    category: "Certification",
    icon: "🏆",
    question: "Are industry certifications provided upon completion?",
    answer:
      "Yes. Upon successful completion of each workflow stage, participants receive industry-recognized digital badges and certificates. The full program awards the DGX AI User Enablement Certificate, which is recognized by NVIDIA partner organizations and enterprise AI teams across India and globally.",
  },
  {
    category: "Format",
    icon: "📅",
    question: "Are sessions live or self-paced?",
    answer:
      "The program offers both live instructor-led sessions and self-paced learning modules. Live sessions include GPU lab access on real DGX infrastructure, Q&A with mentors, guided practice labs, and peer collaboration. Self-paced modules allow flexible learning between sessions. A cohort-based schedule is followed for team enrollments.",
  },
  {
    category: "Labs",
    icon: "🧪",
    question: "What GPU labs and hands-on projects are included?",
    answer:
      "Every workflow stage includes hands-on GPU lab access on DGX H100 systems. Projects span Kubernetes cluster deployment, multi-GPU distributed training, LLM fine-tuning with NeMo, TensorRT optimization, Triton Inference Server deployment, RAPIDS accelerated data science, and end-to-end Generative AI pipeline construction using NVIDIA NIM.",
  },
  {
    category: "Beginners",
    icon: "🌱",
    question: "Is this program beginner-friendly?",
    answer:
      "The AI Awareness and AI User Enablement tiers start from foundational concepts and are accessible to motivated beginners. For the Native AI Engineer track, familiarity with Python and basic ML concepts is recommended. All programs include structured onboarding, a pre-learning resource kit, and dedicated mentor support for learners at every level.",
  },
  {
    category: "Enterprise",
    icon: "🏢",
    question: "Do you offer corporate or team enrollment?",
    answer:
      "Yes. We offer dedicated enterprise cohorts, custom curriculum tracks, team dashboards, and on-site/remote delivery options for organizations. Enterprise enrollments include dedicated account managers, custom branding, and direct integrations with your internal LMS. Contact our enterprise team for group pricing and pilot options.",
  },
  {
    category: "Support",
    icon: "💬",
    question: "What kind of ongoing support do learners receive?",
    answer:
      "All enrolled learners receive access to a private community forum, mentor office hours, 1:1 code reviews on project submissions, a DGX lab environment, course update access for 12 months, and a curated resource library. Enterprise learners additionally get dedicated Slack channels and a named instructor for escalations.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category))),
  ];
  const filtered =
    filter === "All" ? faqs : faqs.filter((f) => f.category === filter);

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-[#76B900]/8 border border-[#76B900]/20 text-[#3d6600] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ✦ FAQ
        </div>
        <h2
          className="text-4xl font-bold text-[#013D54] mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Frequently Asked Questions
        </h2>
        <p className="text-[#6b7280] text-lg leading-relaxed">
          Everything you need to know before enrolling in the AI User Enablement
          Program.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === cat
                ? "bg-[#013D54] text-white border-[#013D54]"
                : "bg-white text-[#013D54] border-[#013D54]/15 hover:border-[#76B900]/50 hover:text-[#76B900]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isOpen
                  ? "border-[#76B900]/35 shadow-lg shadow-[#013D54]/6"
                  : "border-[#013D54]/8 hover:border-[#76B900]/25"
              }`}
            >
              {/* Question row */}
              <button
                className="w-full text-left px-6 py-5 bg-white flex items-center justify-between gap-4 hover:bg-[#76B900]/3 transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{faq.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#76B900] uppercase tracking-widest block mb-0.5">
                      {faq.category}
                    </span>
                    <span
                      className="text-[#013D54] font-semibold text-sm md:text-base leading-snug block"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {faq.question}
                    </span>
                  </div>
                </div>

                {/* Arrow icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isOpen
                      ? "bg-[#76B900] text-white rotate-180"
                      : "bg-[#013D54]/6 text-[#013D54]"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
                style={{
                  transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="px-6 pb-6 bg-white border-t border-[#013D54]/5">
                  <div className="pt-4">
                    <p className="text-sm text-[#4b5563] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto mt-14 bg-gradient-to-br from-[#f0fde4] to-[#f0f9ff] border border-[#76B900]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3
            className="text-[#013D54] text-lg font-bold mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Still have questions?
          </h3>
          <p className="text-sm text-[#6b7280]">
            Our team typically responds within 24 hours on business days.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-white border border-[#013D54]/15 hover:border-[#76B900] text-[#013D54] text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
            💬 Chat with Us
          </button>
        </div>
      </div>
    </section>
  );
}
