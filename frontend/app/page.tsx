"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";
import { ShieldCheck, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { resolveApiUrl } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  description: string;
  variantName: string;
};

type AllocationItem = {
  mineral: string;
  status: string;
  color: string;
};

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let products: Product[] = [];
  try {
    products = JSON.parse(settings.productsJson || "[]");
  } catch (e) {}

  let allocations: AllocationItem[] = [];
  try {
    allocations = JSON.parse(settings.assetAllocationsJson || "[]");
  } catch (e) {}

  const getStatusColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600 bg-blue-50 border-blue-200";
      case "green": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "yellow": return "text-amber-600 bg-amber-50 border-amber-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <>
      <Hero />
      <AboutPreview />
      <WhyChooseUs />

      {/* Mineral Portfolio Overview */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <MotionReveal>
            <SectionHeading
              align="center"
              eyebrow="Mineral Portfolio"
              title="High-Grade Raw Materials Supply"
              text="Direct access to our certified mining extractions and metallurgical configurations."
            />
          </MotionReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product, index) => (
              <MotionReveal key={product.id} delay={index * 0.05}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-navy/10 bg-ivory/20 p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{product.variantName}</span>
                    <h3 className="mt-2 text-lg font-bold text-navy">{product.name}</h3>
                    <p className="mt-3 text-xs leading-6 text-charcoal/65">{product.description}</p>
                  </div>
                  <Link href="/products" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:text-navy">
                    View Specifications <ArrowRight size={14} />
                  </Link>
                </div>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/products" className="inline-flex rounded-xl bg-navy px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gold hover:text-navy">
              View Entire Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Asset Allocation status widget section */}
      <section className="bg-ivory/30 py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <MotionReveal>
            <SectionHeading
              eyebrow="Asset Status"
              title="Real-Time Allocation Availability"
              text="Review current availability levels across our active reserves of Hematite, Manganese, Laterite, and Ochre."
            />
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/70">
                <ShieldCheck className="text-gold" size={16} /> Certified ISO Management Systems
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/70">
                <Truck className="text-gold" size={16} /> Secure Tarped Logistics
              </div>
            </div>
            <Link href="/procurement" className="mt-8 inline-flex rounded-xl bg-gold px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy transition hover:bg-navy hover:text-white">
              Go to Procurement Terminal
            </Link>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-premium sm:p-8">
              <h3 className="font-display text-lg font-bold text-navy">Live Status Board</h3>
              <div className="mt-6 space-y-3">
                {allocations.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex flex-col gap-2 rounded-xl border border-navy/5 bg-ivory/10 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-navy">{item.mineral}</span>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${getStatusColor(item.color)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Corporate CPCB environmental compliance banner */}
      <section className="bg-navy py-16 text-white">
        <div className="container-wide text-center max-w-3xl">
          <MotionReveal>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Environmental Excellence</span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl leading-tight">
              Governed by International Standards
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Our extraction sites conform strictly to the Central Pollution Control Board (CPCB) guidelines. We run continuous airborne surveillance and particulate filtration protocols to secure a sustainable mining environment.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/safety" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-navy">
                ISO & Safety Protocols
              </Link>
              <Link href="/legal" className="rounded-xl border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gold hover:text-navy hover:border-gold">
                Disclaimers & Terms
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
