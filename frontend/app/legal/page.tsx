"use client";

import { useEffect, useState } from "react";
import { Scale, FileText, AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";

type SupplyTerms = {
  terms: Array<{ title: string; text: string }>;
  legalDisclaimer: string;
};

export default function LegalPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let supply: SupplyTerms = {
    terms: [],
    legalDisclaimer: ""
  };

  try {
    if (settings.supplyTermsJson) {
      supply = JSON.parse(settings.supplyTermsJson);
    }
  } catch (e) {}

  return (
    <>
      <PageHero
        eyebrow="Legal & Regulatory"
        title="Terms of Supply & Disclaimers."
        text="Review the statutory frameworks governing our mineral supply operations, title transfers, and geological data disclaimers."
      />

      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <MotionReveal>
              <div className="rounded-3xl border border-navy/10 bg-ivory/20 p-8 shadow-card">
                <div className="flex items-center gap-3 text-navy">
                  <Scale className="text-gold" size={24} />
                  <h3 className="font-display text-2xl font-bold">Terms of Raw Material Supply</h3>
                </div>
                <p className="mt-4 text-xs text-charcoal/50 uppercase tracking-widest">Commercial Regulatory Framework</p>

                <div className="mt-8 grid gap-8">
                  {supply.terms && supply.terms.map((term, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-xs text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-display text-base font-bold text-navy">{term.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-charcoal/70">{term.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MotionReveal>

            <div className="grid gap-6">
              <MotionReveal delay={0.12}>
                <div className="rounded-3xl border border-red-100 bg-red-50/50 p-8 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-navy">Website Legal Disclaimer</h3>
                  <p className="mt-4 text-xs leading-5 text-charcoal/75">
                    {supply.legalDisclaimer || "The data hosted on this platform is for informational purposes only and is delivered on an 'as-is' and 'as-available' basis without any express or implied warranties."}
                  </p>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.2}>
                <div className="rounded-3xl border border-navy/10 bg-mist p-8 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gold shadow-sm">
                    <FileText size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-navy">Order Formation</h3>
                  <p className="mt-4 text-xs leading-5 text-charcoal/70">
                    SSE expressly rejects any standard purchase terms or unilateral buyer mandates unless explicitly integrated via a signed Order Acceptance. Final commercial parameters are defined at shipment origin by independent lot surveyors.
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
