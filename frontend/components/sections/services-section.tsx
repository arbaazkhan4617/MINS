"use client";

import { useEffect, useState } from "react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";
import * as LucideIcons from "lucide-react";

export function ServicesSection() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let items: Array<{ title: string; text: string; icon?: string }> = [];
  try {
    items = JSON.parse(settings.servicesJson);
  } catch (e) {
    items = [];
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <MotionReveal>
            <SectionHeading
              eyebrow="Services"
              title="Business support rooted in practical execution."
              text="From trading and product supply to consultancy and customer support, each service is shaped around real operating needs."
            />
          </MotionReveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => {
            const IconComponent = (LucideIcons[service.icon as keyof typeof LucideIcons] as any) || LucideIcons.BriefcaseBusiness;
            return (
              <MotionReveal key={service.title} delay={index * 0.04}>
                <article className="group h-full rounded-2xl border border-navy/10 bg-gradient-to-br from-ivory to-white p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-premium">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold shadow-card">
                      <IconComponent size={23} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal/68">
                    {service.text}
                  </p>
                </article>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

