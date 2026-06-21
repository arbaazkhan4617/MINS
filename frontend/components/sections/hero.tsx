"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import {
  defaultHomepageContent,
  fetchHomepageContent,
  type HomepageContent
} from "@/lib/homepage-store";
import { cn } from "@/lib/utils";

type HeroSlide = {
  mediaSrc: string;
  mediaType: "image" | "video";
  headline: string;
  subheading: string;
  badge?: string;
  exploreBtnText?: string;
  exploreBtnLink?: string;
  contactBtnText?: string;
  contactBtnLink?: string;
};

export function Hero() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  let slides: HeroSlide[] = [];
  try {
    slides = JSON.parse(content.heroSlidesJson || "[]");
  } catch {
    slides = [];
  }

  if (slides.length === 0) {
    slides = [
      {
        mediaSrc: content.heroMediaSrc,
        mediaType: content.heroMediaType,
        headline: content.heroHeadline,
        subheading: content.heroSubheading,
        badge: "Professional. Trusted. Established.",
        exploreBtnText: "Explore Work",
        exploreBtnLink: "/work",
        contactBtnText: "Contact Us",
        contactBtnLink: "/contact"
      }
    ];
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const currentSlide = slides[currentIndex];
    if (currentSlide.mediaType === "video") {
      // Auto-sliding for videos is handled by the video's onEnded event
      return;
    }

    const timer = setTimeout(() => {
      nextSlide();
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentIndex, slides.length]);

  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-navy">
      {slides.map((slide, index) => {
        const slideMediaSrc = resolveApiUrl(slide.mediaSrc);
        const isActive = index === currentIndex;

        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {slide.mediaType === "video" ? (
              <video
                key={`${index}-${isActive}`}
                className="absolute inset-0 -z-20 h-full w-full object-cover"
                autoPlay={isActive}
                muted
                playsInline
                preload="metadata"
                loop={slides.length === 1}
                src={slideMediaSrc}
                onEnded={isActive ? nextSlide : undefined}
              />
            ) : (
              <img
                src={slideMediaSrc}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/82 via-navy/58 to-navy/28" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/10 via-transparent to-navy/42" />
            <div className="container-wide flex min-h-[calc(100vh-5rem)] items-center py-20">
              <div
                className={cn(
                  "max-w-3xl transform transition-all duration-700 ease-out delay-200",
                  isActive ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                )}
              >
                {slide.badge && (
                  <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white backdrop-blur">
                    {slide.badge}
                  </p>
                )}
                <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                  {slide.headline}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">
                  {slide.subheading}
                </p>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Button href={slide.exploreBtnLink || "/work"} variant="secondary">
                    {slide.exploreBtnText || "Explore Work"} <ArrowRight className="ml-2" size={18} />
                  </Button>
                  <Button href={slide.contactBtnLink || "/contact"} className="bg-gold text-navy hover:bg-sand">
                    {slide.contactBtnText || "Contact Us"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-navy/30 p-2.5 text-white backdrop-blur transition-all duration-300 hover:bg-gold hover:text-navy hover:border-gold sm:p-3"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-navy/30 p-2.5 text-white backdrop-blur transition-all duration-300 hover:bg-gold hover:text-navy hover:border-gold sm:p-3"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-3 w-3 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-gold w-7"
                    : "bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
