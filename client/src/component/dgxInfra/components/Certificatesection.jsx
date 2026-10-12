import { Check } from "lucide-react";
import { headingFont } from "./SectionHeader";

export default function CertificateSection() {
  return (
    <section className="bg-[#f5fafb] pb-16 sm:pb-24" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div
          className="rounded-[2.5rem] p-8 sm:p-14 flex flex-col lg:flex-row items-center gap-10 lg:gap-14 text-white"
          style={{
            background:
              "radial-gradient(600px 300px at 90% 0%, rgba(118,185,0,.3), transparent 60%), linear-gradient(135deg, #013D54, #00566F)",
          }}
        >
          <div className="flex-1">
            <span className="inline-block bg-[#76B900]/20 border border-[#76B900]/40 text-[#B8EC5E] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full">
              Final DGX Certification
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mt-5 mb-4" style={headingFont}>
              Prove You Can Run DGX Infrastructure
            </h2>
            <p className="text-base sm:text-lg text-[#BFD6DE] mb-6">
              Unlock your [CERTIFICATE NAME] after completing every module and lab in the curriculum.
            </p>
            {["Complete all 10 modules", "Finish all 10 hands-on labs", "Reach 100% course progress"].map((t) => (
              <div key={t} className="flex items-center gap-3 font-bold mt-3.5">
                <span className="w-7 h-7 rounded-full bg-[#76B900] text-[#00222F] flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
                {t}
              </div>
            ))}
          </div>

          {/* Certificate preview – replace with your real certificate image */}
          <div className="w-full max-w-md bg-[#FBF6E6] border-[10px] border-[#C9A961] rounded-xl px-8 py-11 text-center text-[#3A2F10]">
            <div className="text-xs font-extrabold tracking-[2px] text-[#7A6425]">[ORGANIZATION LOGO]</div>
            <div className="text-3xl font-extrabold mt-5" style={headingFont}>Certificate</div>
            <div className="text-sm mt-1 mb-5">of Skilling in</div>
            <div className="text-xl font-extrabold text-[#013D54]" style={headingFont}>DGX Infrastructure Management</div>
            <div className="mt-7 mx-auto max-w-[220px] border-t-[1.5px] border-[#C9A961] pt-2 text-xs text-[#7A6425]">
              [LEARNER NAME]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}