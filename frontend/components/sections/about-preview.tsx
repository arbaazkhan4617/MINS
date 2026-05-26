"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { resolveApiUrl } from "@/lib/api";
import { highlights } from "@/lib/data";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";

export function AboutPreview() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <MotionReveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-ivory p-3 shadow-premium">
            <img
              src={resolveApiUrl(settings.aboutImageUrl)}
              alt={`${settings.companyName} professional business discussion`}
              className="h-[420px] rounded-[1.35rem] object-cover"
            />
            <div className="absolute bottom-7 left-7 rounded-2xl bg-white/92 p-5 shadow-card backdrop-blur">
              <p className="font-display text-4xl font-semibold text-navy">15+</p>
              <p className="text-sm font-semibold text-charcoal/70">
                Years Experience
              </p>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12}>
          <SectionHeading
            eyebrow={settings.aboutEyebrow}
            title={settings.aboutTitle}
            text={settings.aboutContent}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-ivory p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={20} />
                <p className="text-sm font-semibold leading-6 text-charcoal/75">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <Button href="/about" variant="ghost" className="mt-8">
            Learn More About Us
          </Button>
        </MotionReveal>
      </div>
    </section>
  );
}
