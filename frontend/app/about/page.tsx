"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CtaBanner } from "@/components/sections/cta-banner";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { resolveApiUrl } from "@/lib/api";
import { coreValues } from "@/lib/data";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";

const direction = [
  {
    title: "Vision",
    text: "To be a dependable corporate partner known for trust, consistency, and responsible business growth."
  },
  {
    title: "Mission",
    text: "To deliver quality services with professionalism, clear communication, and long-term customer satisfaction."
  },
  {
    title: "Aim",
    text: "To create measurable value for clients through practical solutions, timely execution, and ethical operations."
  }
];

const strengths = [
  "Experienced leadership and committed team",
  "Reliable network for trading and product supply",
  "Customer-first service culture",
  "Transparent and accountable execution model",
  "Scalable processes for future digital management"
];

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <>
      <PageHero
        eyebrow={`About ${settings.companyName}`}
        title="An established company built on professionalism and trust."
        text={settings.aboutContent}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <MotionReveal>
            <SectionHeading
              eyebrow={settings.aboutEyebrow}
              title={settings.aboutTitle}
              text={settings.aboutContent}
            />
            <p className="mt-6 text-base leading-8 text-charcoal/70">
              {settings.directorMessage}
            </p>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <img
              src={resolveApiUrl(settings.aboutImageUrl)}
              alt={`${settings.companyName} corporate office`}
              className="h-[440px] w-full rounded-[1.75rem] object-cover shadow-premium"
            />
          </MotionReveal>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-wide">
          <MotionReveal>
            <SectionHeading
              align="center"
              eyebrow="Direction"
              title="Vision, mission, and aim."
              text="Clear principles guide how the company works with clients, vendors, and internal teams."
            />
          </MotionReveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {direction.map((item, index) => (
              <MotionReveal key={item.title} delay={index * 0.06}>
                <article className="relative h-full rounded-2xl border border-navy/10 bg-white p-8 shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory font-bold text-gold">
                    0{index + 1}
                  </span>
                  <h2 className="mt-8 text-2xl font-bold text-navy">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-charcoal/70">{item.text}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <MotionReveal>
            <SectionHeading
              eyebrow="Core Values"
              title="Values that keep business relationships strong."
            />
            <div className="mt-8 grid gap-4">
              {coreValues.map((value) => (
                <div key={value} className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-ivory p-4">
                  <CheckCircle2 className="text-gold" size={20} />
                  <span className="font-semibold text-charcoal/75">{value}</span>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <div className="rounded-[1.75rem] bg-navy p-8 text-white shadow-premium sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sand">
                Director Message
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold">
                Trust is built through every promise we keep.
              </h2>
              <p className="mt-6 leading-8 text-white/76">{settings.directorMessage}</p>
              <p className="mt-8 font-semibold text-sand">Director, {settings.companyName}</p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-ivory py-20 sm:py-28">
        <div className="container-wide">
          <MotionReveal>
            <SectionHeading align="center" eyebrow="Company Strength" title="Practical strengths for dependable delivery." />
          </MotionReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strengths.map((strength, index) => (
              <MotionReveal key={strength} delay={index * 0.04}>
                <div className="rounded-2xl bg-white p-6 text-sm font-semibold leading-7 text-charcoal/72 shadow-card">
                  {strength}
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
