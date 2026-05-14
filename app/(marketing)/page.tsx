import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingSection } from "@/components/landing/PricingSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { loadPublicTestimonials } from "@/lib/load-public-testimonials";
import { loadLandingDashboardPreview } from "@/lib/load-landing-dashboard-preview";

export const metadata: Metadata = {
  title: "Interview Coach — AI mock interviews & feedback",
  description:
    "Practice interviews with AI, real-time feedback, and personalized coaching. Free to start.",
};

export default async function MarketingHomePage() {
  const [testimonials, dashboardPreview] = await Promise.all([
    loadPublicTestimonials(),
    loadLandingDashboardPreview(),
  ]);

  return (
    <main>
      <HeroSection dashboardPreview={dashboardPreview} />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials items={testimonials} />
      <PricingSection />
      <CtaBanner />
    </main>
  );
}
