"use client";

import { useEffect, useState } from "react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { stats } from "@/lib/data";
import { defaultHomepageContent, fetchHomepageContent } from "@/lib/homepage-store";

export function StatsSection() {
  const [statValues, setStatValues] = useState(defaultHomepageContent.stats);

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const content = await fetchHomepageContent();
      if (mounted) {
        setStatValues(content.stats);
      }
    }

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-navy py-16 text-white">
      <div className="container-wide grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <MotionReveal key={stat.label} delay={index * 0.05}>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-8 text-center backdrop-blur">
              <p className="font-display text-5xl font-semibold text-sand">
                {statValues[index] ?? stat.value}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
                {stat.label}
              </p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
