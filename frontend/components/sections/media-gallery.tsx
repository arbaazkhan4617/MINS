"use client";

import { useEffect, useMemo, useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { resolveApiUrl } from "@/lib/api";
import { fetchMediaItems, type MediaItem } from "@/lib/media-store";
import { cn } from "@/lib/utils";

function isPlayableVideo(item: MediaItem) {
  return item.type === "Video" && /\.(mp4|webm|ogg|mov|m4v)(?:[?#]|$)/i.test(item.url);
}

export function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [active, setActive] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    void fetchMediaItems().then(setItems);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );

  const subCategories = useMemo(() => {
    const scopedItems = active === "All" ? items : items.filter((item) => item.category === active);
    return ["All", ...Array.from(new Set(scopedItems.map((item) => item.subCategory).filter(Boolean)))];
  }, [active, items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryMatches = active === "All" || item.category === active;
      const subCategoryMatches = activeSubCategory === "All" || item.subCategory === activeSubCategory;
      return categoryMatches && subCategoryMatches;
    });
  }, [active, activeSubCategory, items]);

  function selectCategory(category: string) {
    setActive(category);
    setActiveSubCategory("All");
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => selectCategory(category)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-semibold transition",
              active === category
                ? "border-navy bg-navy text-white"
                : "border-navy/10 bg-white text-charcoal/70 hover:border-gold/60 hover:text-navy"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {subCategories.length > 1 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {subCategories.map((subCategory) => (
            <button
              key={subCategory}
              type="button"
              onClick={() => setActiveSubCategory(subCategory)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition",
                activeSubCategory === subCategory
                  ? "border-gold bg-gold text-navy"
                  : "border-navy/10 bg-white text-charcoal/65 hover:border-gold/60 hover:text-navy"
              )}
            >
              {subCategory}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <MotionReveal key={item.id} delay={index * 0.04}>
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ivory text-left shadow-card"
            >
              {isPlayableVideo(item) ? (
                <video
                  src={resolveApiUrl(item.url)}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={resolveApiUrl(item.url)}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/72 via-navy/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand">
                  {item.category}
                </p>
                {item.subCategory ? (
                  <p className="mt-1 text-xs font-semibold text-white/80">
                    {item.subCategory}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center justify-between">
                  <h2 className="font-semibold">{item.title}</h2>
                  {item.type === "Video" ? <PlayCircle size={25} /> : null}
                </div>
              </div>
            </button>
          </MotionReveal>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-ivory p-8 text-center text-sm font-semibold text-charcoal/60">
          No media has been uploaded yet.
        </div>
      ) : null}

      {selected ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] grid place-items-center bg-navy/80 p-4 backdrop-blur"
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-premium">
            <button
              type="button"
              aria-label="Close media preview"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-3 text-navy shadow-card"
            >
              <X size={18} />
            </button>
            {isPlayableVideo(selected) ? (
              <video src={resolveApiUrl(selected.url)} className="max-h-[72vh] w-full object-cover" controls autoPlay />
            ) : (
              <img src={resolveApiUrl(selected.url)} alt={selected.title} className="max-h-[72vh] w-full object-cover" />
            )}
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                {selected.category}
              </p>
              {selected.subCategory ? (
                <p className="mt-1 text-sm font-semibold text-charcoal/60">
                  {selected.subCategory}
                </p>
              ) : null}
              <h2 className="mt-2 text-2xl font-bold text-navy">
                {selected.title}
              </h2>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
