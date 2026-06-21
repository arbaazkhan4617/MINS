"use client";

import { useEffect, useState } from "react";
import { FileDown, ShieldCheck, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";
import { resolveApiUrl } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  description: string;
  variantName: string;
  coaUrl?: string;
};

export default function ProductsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let products: Product[] = [];
  try {
    products = JSON.parse(settings.productsJson || "[]");
  } catch (e) {
    products = [];
  }

  const handleDownloadCoA = (product: Product) => {
    if (!product.coaUrl) {
      setMessage(`Standard Certificate of Analysis (CoA) for ${product.variantName} is available upon request. Please contact our procurement desk.`);
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    setDownloadingId(product.id);
    const link = document.createElement("a");
    link.href = resolveApiUrl(product.coaUrl);
    link.target = "_blank";
    link.download = `${product.variantName}-CoA`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingId(null), 1000);
  };

  return (
    <>
      <PageHero
        eyebrow="Mineral Portfolio"
        title="Securing High-Grade Industrial Minerals."
        text="SSE operates certified mineral extractions supplying essential materials to the global steel, cement, chemical, and heavy manufacturing sectors."
      />

      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <MotionReveal>
            <SectionHeading
              align="center"
              eyebrow="Products & Applications"
              title="Geological Precision. Robust Supply."
              text="Explore our dynamic mineral reserves managed under certified international frameworks."
            />
          </MotionReveal>

          {message && (
            <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-4 text-center text-sm font-semibold text-amber-800 animate-pulse">
              {message}
            </div>
          )}

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <MotionReveal key={product.id} delay={index * 0.05}>
                <div className="flex h-full flex-col justify-between rounded-3xl border border-navy/10 bg-ivory/30 p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white">
                  <div>
                    <div className="flex items-center gap-2 text-gold">
                      <ShieldCheck size={20} />
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">{product.variantName}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold text-navy leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-charcoal/70">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-navy/5">
                    <button
                      onClick={() => handleDownloadCoA(product)}
                      disabled={downloadingId === product.id}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gold hover:text-navy disabled:bg-navy/50"
                    >
                      <FileDown size={16} />
                      {downloadingId === product.id ? "Downloading..." : "Download CoA"}
                    </button>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal delay={0.2}>
            <div className="mt-16 rounded-3xl border border-navy/10 bg-mist p-8 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                <div>
                  <h4 className="font-display text-2xl font-bold text-navy">
                    Need Custom Grading or Large Volume Off-takes?
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-charcoal/70">
                    We support long-term supply arrangements and customized sizing specifications to match your exact furnace or industrial raw feed parameters. Submit chemical metrics and port delivery destinations via our global procurement page.
                  </p>
                </div>
                <div className="flex justify-start lg:justify-end">
                  <a
                    href="/procurement"
                    className="inline-flex rounded-xl bg-gold px-6 py-4 text-sm font-bold uppercase tracking-wider text-navy transition hover:bg-navy hover:text-white"
                  >
                    Procurement Portal
                  </a>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
