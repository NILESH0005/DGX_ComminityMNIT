import { useEffect } from "react";

import HeroOverviewSection from "./sections/HeroOverviewSection";
import LearningPillarsSection from "./sections/LearningPillarsSection";
import SemesterStructureSection from "./sections/SemesterStructureSection";
import CareerTechStackSection from "./sections/CareerTechStackSection";
import { useLocation } from "react-router-dom";

const NativeAiCoursePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();

  const totalHours = location.state?.totalEstimatedHours;
  const totalMinutes = location.state?.totalEstimatedMinutes;

  // console.log(totalHours);

  return (
    <main
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* Section 1: Hero + Overview */}
      <HeroOverviewSection
        totalHours={totalHours}
        totalMinutes={totalMinutes}
      />

      {/* Section 2: Six Learning Pillars */}
      <LearningPillarsSection />

      {/* Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e2e8f0",
          margin: 0,
        }}
      />

      {/* Section 3: Semester Structure + Workflow */}
      <SemesterStructureSection />

      {/* Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e2e8f0",
          margin: 0,
        }}
      />

      {/* Section 4: Career Roles + Tech Stack */}
      <CareerTechStackSection />
    </main>
  );
};

export default NativeAiCoursePage;
