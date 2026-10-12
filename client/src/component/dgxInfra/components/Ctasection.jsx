import { headingFont } from "./SectionHeader";

export default function CtaSection() {
  return (
    <section className="bg-[#76B900] py-16 sm:py-20 text-center px-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00222F] mb-3" style={headingFont}>
        Start Your DGX Journey
      </h2>
      <p className="text-base sm:text-lg text-[#12341E] mb-8">
        Begin with Linux prerequisites and build up to Run:ai.
      </p>
      <button
        onClick={() => document.getElementById("tracks")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-[#013D54] hover:bg-[#00566F] text-white font-bold px-8 py-3.5 rounded-xl transition-all"
      >
        Get Started
      </button>
    </section>
  );
}