import React from "react";
// import StatsSection from "./StatsSection";
// import ProductLine from "./ProductLine";
// import FeaturesSection from "./FeaturesSection";
// import WorkflowSection from "./WorkflowSection";
// import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import ProductLine from "./ProductLine";
import FeaturesSection from "./FeaturesSection";
import WorkflowSection from "./WorkflowSection";
import CTASection from "./CTASection";
import DGXAccessPortal from "./DGXAccessPortal";

const DGXControlCenter = () => {
  return (
    <main className="bg-[#020617] overflow-hidden">
      <HeroSection />
      <DGXAccessPortal />
      <StatsSection />
      <ProductLine />
      <FeaturesSection />
      <WorkflowSection />
      <CTASection />
    </main>
  );
};

export default DGXControlCenter;
