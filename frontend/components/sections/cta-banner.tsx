"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { defaultHomepageContent, fetchHomepageContent } from "@/lib/homepage-store";

export function CtaBanner() {
  const [ctaTitle, setCtaTitle] = useState(defaultHomepageContent.ctaTitle);

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const content = await fetchHomepageContent();
      if (mounted) {
        setCtaTitle(content.ctaTitle);
      }
    }

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container-wide">
        <MotionReveal>
          <div className="overflow-hidden rounded-[2rem] bg-ivory p-8 shadow-premium sm:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
                  Work With MINS
                </p>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-navy sm:text-5xl">
                  {ctaTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-charcoal/70">
                  Connect with our team for a professional conversation about
                  trading, supply, consulting, or service support.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button href="/contact">
                  Contact Us <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button href="/work" variant="ghost">
                  View Work
                </Button>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
