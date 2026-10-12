import CertificateSection from "./Certificatesection";
import CtaSection from "./Ctasection";
import FeaturesSection from "./Featuresection";
import HeroSection from "./HeroSection";
import LearningTracksSection from "./Learningtracksection";
import TechMarquee from "./Techmarquee";

export default function DgxPage() {
  return (
    <>
      <HeroSection />
      <TechMarquee />
      <FeaturesSection />
      <LearningTracksSection />
      <CertificateSection />
      {/* <CtaSection /> */}
      <footer className="bg-[#00222F] text-[#8FB0BC] text-center text-sm py-6">
        DGX Management Curriculum · [YOUR ORGANIZATION]
      </footer>
    </>
  );
}