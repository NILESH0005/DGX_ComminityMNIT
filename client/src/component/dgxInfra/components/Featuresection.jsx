import { Server, ShieldCheck, Activity, Wrench } from "lucide-react";
import SectionHeader, { headingFont } from "./SectionHeader";

const features = [
  { icon: Server, title: "Deploy", text: "Provision cluster systems with BCM and ship GPU-enabled applications with containers." },
  { icon: ShieldCheck, title: "Administer", text: "Run DGX systems, Slurm partitions, and Kubernetes clusters with confidence." },
  { icon: Activity, title: "Monitor & Secure", text: "Keep users, permissions, racks, and cluster resources organized and protected." },
  { icon: Wrench, title: "Troubleshoot", text: "Diagnose networking, infrastructure, and GPU workload issues at every layer." },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16 sm:py-24" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader
          tag="DGX Management Curriculum"
          title="Built for the Next Generation of Infrastructure Engineers"
          text="From Linux and data-center fundamentals to DGX hardware, GPU management, storage, networking, Kubernetes, Slurm, BCM, Run:ai, containers, and AI workload operations."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-[#013D54]/10 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#76B900] hover:shadow-2xl hover:shadow-[#013D54]/10"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9BD92E] to-[#76B900] flex items-center justify-center shadow-lg shadow-[#76B900]/30 mb-5">
                <Icon className="w-6 h-6 text-[#013D54]" />
              </div>
              <h3 className="text-xl font-bold text-[#013D54] mb-2" style={headingFont}>{title}</h3>
              <p className="text-sm text-[#4a6b7a] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}