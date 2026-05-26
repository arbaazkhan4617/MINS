import { AboutPreview } from "@/components/sections/about-preview";
import { ClientsTrustSection } from "@/components/sections/clients-trust-section";
import { CompanyTimeline } from "@/components/sections/company-timeline";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Hero } from "@/components/sections/hero";
import { MediaPreview } from "@/components/sections/media-preview";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TrustSection } from "@/components/sections/trust-section";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { WowSection } from "@/components/sections/wow-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <TrustSection />
      <WhyChooseUs />
      <ServicesSection />
      <FeaturedWork />
      <CompanyTimeline />
      <ClientsTrustSection />
      <WowSection />
      <MediaPreview />
      <StatsSection />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
