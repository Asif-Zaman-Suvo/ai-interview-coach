import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingSection } from "@/components/landing/PricingSection";
import { CtaBanner } from "@/components/landing/CtaBanner";

export const metadata: Metadata = {
  title: "Interview Coach — AI mock interviews & feedback",
  description:
    "Practice interviews with AI, real-time feedback, and personalized coaching. Free to start.",
};

export default function MarketingHomePage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <CtaBanner />
    </main>
  );
}
