import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/cta-banner";
import { PageHero } from "@/components/sections/page-hero";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Work",
  description: "Explore MINS project categories, credible portfolio outcomes, and business work showcases."
};

const outcomes = [
  "Clear coordination between customer, vendor, and service teams",
  "Better documentation and delivery visibility",
  "Practical support that continues after initial execution"
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Practical work delivered with clear business outcomes."
        text="Explore service engagements that focus on supply, coordination, customer support, and trustworthy execution rather than decorative portfolio claims."
      />
      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <MotionReveal>
            <SectionHeading
              align="center"
              eyebrow="Projects"
              title="Filter real business categories."
              text="Project cards highlight the requirement, category, and outcome so the work feels credible and client-oriented."
            />
          </MotionReveal>
          <div className="mt-10">
            <PortfolioGrid />
          </div>
        </div>
      </section>
      <section className="bg-[#FFF8EA] py-16">
        <div className="container-wide grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <MotionReveal>
            <SectionHeading
              eyebrow="How We Measure Work"
              title="A project is successful when the client feels informed and confident."
            />
          </MotionReveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {outcomes.map((outcome, index) => (
              <MotionReveal key={outcome} delay={index * 0.05}>
                <div className="h-full rounded-2xl bg-white p-5 text-sm font-semibold leading-7 text-charcoal/72 shadow-card">
                  {outcome}
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}

