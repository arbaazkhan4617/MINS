"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { resolveApiUrl } from "@/lib/api";
import {
  defaultHomepageContent,
  fetchHomepageContent,
  type HomepageContent
} from "@/lib/homepage-store";

export function Hero() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const savedContent = await fetchHomepageContent();
      if (mounted) {
        setContent(savedContent);
      }
    }

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  const heroMediaSrc = resolveApiUrl(content.heroMediaSrc);

  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-navy">
      {content.heroMediaType === "video" ? (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src={heroMediaSrc}
        />
      ) : (
        <img
          src={heroMediaSrc}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/82 via-navy/58 to-navy/28" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/10 via-transparent to-navy/42" />
      <div className="container-wide flex min-h-[calc(100vh-5rem)] items-center py-20">
        <MotionReveal className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white backdrop-blur">
            Professional. Trusted. Established.
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {content.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">
            {content.heroSubheading}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button href="/work" variant="secondary">
              Explore Work <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button href="/contact" className="bg-gold text-navy hover:bg-sand">
              Contact Us
            </Button>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
