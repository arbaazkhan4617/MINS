"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, HeartPulse, Eye, Activity } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";

type SafetyData = {
  overview: string;
  items: Array<{ title: string; text: string }>;
};

export default function SafetyPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let safety: SafetyData = {
    overview: "",
    items: []
  };

  try {
    if (settings.safetyGuidelinesJson) {
      safety = JSON.parse(settings.safetyGuidelinesJson);
    }
  } catch (e) {}

  const icons = [Activity, Eye, HeartPulse];

  return (
    <>
      <PageHero
        eyebrow="Safety & Systems"
        title="ISO Excellence & Safety Operations."
        text="SSE operates under an integrated management system certified for international quality, environmental stewardship, and safety standards."
      />

      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <MotionReveal>
              <SectionHeading
                eyebrow="Zero-Harm Environment"
                title="Engineering Safety. Prioritizing Compliance."
                text={safety.overview || "SSE enforces a strict risk assessment, occupational health guidelines, and operational control structure aimed at achieving an absolute zero-harm workplace."}
              />

              <div className="mt-8 grid gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-ivory/30 p-4">
                  <CheckCircle2 className="text-gold shrink-0" size={22} />
                  <span className="font-semibold text-navy text-sm">ISO 14001:2015 Environmental Management System</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-ivory/30 p-4">
                  <CheckCircle2 className="text-gold shrink-0" size={22} />
                  <span className="font-semibold text-navy text-sm">ISO 45001:2018 Occupational Health & Safety Management System</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-ivory/30 p-4">
                  <CheckCircle2 className="text-gold shrink-0" size={22} />
                  <span className="font-semibold text-navy text-sm">ISO 9001:2015 Quality Management System</span>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <div className="relative rounded-[2rem] border border-navy/10 bg-navy p-8 text-white shadow-premium sm:p-12 overflow-hidden">
                <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-gold/10 blur-2xl" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Safety Stewardship</p>
                <h3 className="mt-4 font-display text-3xl font-bold leading-tight">
                  Absolute Zero-Harm Protocols
                </h3>
                <p className="mt-6 text-sm leading-7 text-white/80">
                  Our operational limits are actively monitored. From environmental containment vectors to mechanized equipment interfaces, safety is integrated programmatically into all site tasks.
                </p>
              </div>
            </MotionReveal>
          </div>

          <div className="mt-20">
            <MotionReveal>
              <h3 className="font-display text-3xl font-bold text-navy text-center mb-12">Core Safety Actions</h3>
            </MotionReveal>
            <div className="grid gap-8 md:grid-cols-3">
              {safety.items && safety.items.map((item, index) => {
                const IconComponent = icons[index % icons.length] || ShieldCheck;
                return (
                  <MotionReveal key={index} delay={index * 0.06}>
                    <div className="h-full rounded-3xl border border-navy/10 bg-white p-8 shadow-card transition duration-300 hover:border-gold/50 hover:shadow-premium">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold shadow-sm">
                        <IconComponent size={24} />
                      </div>
                      <h4 className="mt-6 font-display text-lg font-bold text-navy">{item.title}</h4>
                      <p className="mt-4 text-sm leading-7 text-charcoal/70">{item.text}</p>
                    </div>
                  </MotionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
