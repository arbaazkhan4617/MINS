"use client";

import { useEffect, useState } from "react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";
import * as LucideIcons from "lucide-react";

export function WhyChooseUs() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let items: Array<{ title: string; text: string; icon?: string }> = [];
  try {
    items = JSON.parse(settings.whyChooseUsJson);
  } catch (e) {
    items = [];
  }

  return (
    <section className="bg-mist py-16 sm:py-24">
      <div className="container-wide">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <MotionReveal>
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Reliability that feels personal, not procedural."
              text="We pair professional standards with human responsiveness, because customers trust teams that stay present through the full journey."
            />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-gold/20 bg-white p-6 shadow-card">
              <p className="font-display text-3xl font-semibold text-navy">Clear, steady, accountable.</p>
              <p className="mt-3 text-sm leading-7 text-charcoal/68">
                Our work style is simple: understand the requirement, keep every stakeholder informed, and close the loop with care.
              </p>
            </div>
          </MotionReveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {items.map((item, index) => {
            const IconComponent = (LucideIcons[item.icon as keyof typeof LucideIcons] as any) || LucideIcons.BadgeCheck;
            return (
              <MotionReveal key={item.title} delay={index * 0.05}>
                <div className="h-full rounded-2xl border border-navy/10 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-ivory">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-gold">
                    <IconComponent size={21} />
                  </div>
                  <h3 className="text-base font-bold text-navy">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal/68">
                    {item.text}
                  </p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

