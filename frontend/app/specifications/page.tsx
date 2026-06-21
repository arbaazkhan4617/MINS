"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Truck, Sparkles, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";

type SpecsData = {
  description: string;
  specificationsTable: Array<{ parameter: string; value: string }>;
  secureLogistics: string;
};

export default function SpecificationsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let specs: SpecsData = {
    description: "",
    specificationsTable: [],
    secureLogistics: ""
  };

  try {
    if (settings.technicalSpecsJson) {
      specs = JSON.parse(settings.technicalSpecsJson);
    }
  } catch (e) {}

  return (
    <>
      <PageHero
        eyebrow="Technical Specifications"
        title="Metric Metallurgical Parameters."
        text="All physical and chemical parameters detailed represent typical operational extraction grades. Exact contractual parameters are verified per shipment."
      />

      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <MotionReveal>
              <div className="rounded-3xl border border-navy/10 bg-ivory/20 p-8 shadow-card">
                <h3 className="font-display text-2xl font-bold text-navy">Typical Mineral Asset Configurations</h3>
                <p className="mt-4 text-sm leading-7 text-charcoal/70">
                  {specs.description || "The physical and chemical configurations detailed below represent typical parameters for our core asset extractions. Exact parameters are verified via independent lot certification at the point of loading."}
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 bg-white">
                  <div className="grid grid-cols-[1.2fr_0.8fr] bg-navy px-6 py-4 text-xs font-bold uppercase tracking-wider text-white">
                    <span>Mineral / Parameter</span>
                    <span>Typical Configuration Value</span>
                  </div>
                  <div className="divide-y divide-navy/10">
                    {specs.specificationsTable && specs.specificationsTable.map((item, index) => (
                      <div key={index} className="grid grid-cols-[1.2fr_0.8fr] px-6 py-4 text-sm text-charcoal/80">
                        <span className="font-semibold text-navy">{item.parameter}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MotionReveal>

            <div className="grid gap-6">
              <MotionReveal delay={0.1}>
                <div className="rounded-3xl border border-navy/10 bg-mist p-8 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gold shadow-sm">
                    <Truck size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-navy">Secure Logistics & Tarps</h3>
                  <p className="mt-4 text-sm leading-6 text-charcoal/70">
                    {specs.secureLogistics || "Every bulk haulage unit carrying Blue Dust is securely sheeted with heavy-duty polymer tarpaulins, passing through high-impact wheel-and-chassis washing bays before exiting the lease perimeter to prevent off-site track-out."}
                  </p>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.2}>
                <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-8 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-navy">Regulatory Notice</h3>
                  <p className="mt-4 text-xs leading-5 text-charcoal/75">
                    No fixed timelines apply. S S Enterprises executes final chemical grading configurations at the loading point via authorized independent surveyors. Those findings constitute the definitive metrics for commercial invoicing.
                  </p>
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
