"use client";

import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { resolveApiUrl } from "@/lib/api";
import { fetchMediaItems, type MediaItem } from "@/lib/media-store";

function isPlayableVideo(item: MediaItem) {
  return item.type === "Video" && /\.(mp4|webm|ogg|mov|m4v)(?:[?#]|$)/i.test(item.url);
}

export function MediaPreview() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    void fetchMediaItems().then((media) => setItems(media.slice(0, 6)));
  }, []);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <MotionReveal>
            <SectionHeading
              eyebrow="Media"
              title="A refined gallery for company moments and work previews."
              text="Images and videos are uploaded, categorized, edited, and removed through the admin media module."
            />
          </MotionReveal>
          <Button href="/media" variant="ghost">
            View Gallery
          </Button>
        </div>

        {items.length > 0 ? (
          <div className="masonry mt-12 columns-1 sm:columns-2 lg:columns-3">
            {items.map((item, index) => (
              <MotionReveal key={item.id} delay={index * 0.04}>
                <div className="group relative mb-6 overflow-hidden rounded-2xl bg-ivory shadow-card">
                  {isPlayableVideo(item) ? (
                    <video
                      src={resolveApiUrl(item.url)}
                      className="w-full object-cover transition duration-500 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={resolveApiUrl(item.url)}
                      alt={item.title}
                      className="w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand">
                      {item.category}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.type === "Video" ? <PlayCircle size={24} /> : null}
                    </div>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl bg-ivory p-8 text-center text-sm font-semibold text-charcoal/60">
            No media has been uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
}
