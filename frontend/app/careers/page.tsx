"use client";

import { useEffect, useState } from "react";
import { Award, Briefcase, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CareerForm } from "@/components/sections/career-form";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";

const benefits = [
  {
    title: "Safe Work Environment",
    text: "We prioritize security and occupational health with strict ISO 45001 safety compliance.",
    icon: ShieldCheck
  },
  {
    title: "Professional Team",
    text: "Work alongside industry specialists, geologists, and experienced mine managers.",
    icon: Users
  },
  {
    title: "Growth Opportunities",
    text: "Build a long-term career in mineral operations with continuous training and skill development.",
    icon: Briefcase
  },
  {
    title: "Industry Excellence",
    text: "Be part of a company committed to sustainable resources and CPCB environmental compliance.",
    icon: Award
  }
];

export default function CareersPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Join Our Team"
        title={`Build a meaningful career at ${settings.companyName}.`}
        text="Explore exciting opportunities in mineral extraction, geosciences, site logistics, and operations."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionReveal>
            <SectionHeading
              eyebrow="Work With Us"
              title="Apply for open positions."
              text="Fill out the form below and upload your latest resume. Our HR department will review your application."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card hover:shadow-premium transition duration-300"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-gold">
                    <benefit.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-bold text-navy text-lg">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/70">{benefit.text}</p>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <CareerForm />
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
