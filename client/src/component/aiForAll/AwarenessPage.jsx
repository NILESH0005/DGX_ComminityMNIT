// import FeaturesSection from "./sections/FeaturesSection";
// import LearningTracksSection from "./sections/LearningTracksSection";
// import BadgeSection from "./sections/BadgeSection";
// import CertificateSection from "./sections/CertificateSection";
// import CommunitySection from "./sections/CommunitySection";
// import LeaderboardSection from "./sections/LeaderboardSection";
// import FAQSection from "./sections/FAQSection";
// import FooterSection from "./sections/FooterSection";

import BadgeSection from "./components/BadgeSection";
import CertificateSection from "./components/CertificateSection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import LearningTracksSection from "./components/LearningTracksSection";

export default function AwarenessPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden scroll-smooth">

      {/* Background Blur Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-green-500/20 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

      </div>

      {/* Main Content */}
      <main className="relative z-10">

        {/* Hero */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* Features */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* Learning Tracks */}
        <section id="tracks">
          <LearningTracksSection />
        </section>

        {/* Badges */}
        <section id="badges">
          <BadgeSection />
        </section>

        {/* Certificates */}
        <section id="certificates">
          <CertificateSection />
        </section>

       

      </main>
    </div>
  );
}