import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import CurriculumSection from "./sections/CurriculumSection";
import MentorSection from "./sections/MentorSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FAQSection from "./sections/FAQSection";

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden scroll-smooth">
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />
        
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <section
          id="hero"
          className="relative"
        >
          <HeroSection />
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative"
        >
          <FeaturesSection />
        </section>

        {/* Curriculum Section */}
        <section
          id="curriculum"
          className="relative"
        >
          <CurriculumSection />
        </section>

        {/* Mentor Section */}
        <section
          id="mentor"
          className="relative"
        >
          <MentorSection />
        </section>

        {/* Testimonials Section */}
        <section
          id="students"
          className="relative"
        >
          <TestimonialsSection />
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="relative"
        >
          <FAQSection />
        </section>
      </main>
    </div>
  );
}