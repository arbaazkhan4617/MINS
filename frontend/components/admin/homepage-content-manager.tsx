"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import {
  defaultHomepageContent,
  fetchHomepageContent,
  loadHomepageContent,
  persistHomepageContent,
  uploadHomepageMedia,
  type HomepageContent
} from "@/lib/homepage-store";

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

const statisticLabels = [
  "Years Experience",
  "Projects Coordinated",
  "Customers Served",
  "Commitment"
];

export function HomepageContentManager() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const savedContent = await fetchHomepageContent();
      if (!mounted) return;
      setContent(savedContent);
      try {
        const parsed = JSON.parse(savedContent.heroSlidesJson || "[]") as HeroSlide[];
        setSlides(parsed);
      } catch {
        setSlides([]);
      }
    }

    const local = loadHomepageContent();
    setContent(local);
    try {
      setSlides(JSON.parse(local.heroSlidesJson || "[]") as HeroSlide[]);
    } catch {
      setSlides([]);
    }

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (slides.length === 0) {
      setMessage("At least one hero slide is required.");
      return;
    }

    // Verify all slides have title
    if (slides.some((s) => !s.headline.trim() || !s.subheading.trim())) {
      setMessage("Headline and subheading are required for all slides.");
      return;
    }

    const token = window.localStorage.getItem("mins-admin-token");
    if (!token) {
      setMessage("Please login again before saving homepage content.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const nextContent = {
        ...content,
        heroSlidesJson: JSON.stringify(slides),
        // Sync first slide to top-level fields for backwards compatibility
        heroHeadline: slides[0].headline,
        heroSubheading: slides[0].subheading,
        heroMediaSrc: slides[0].mediaSrc,
        heroMediaType: slides[0].mediaType
      };

      const savedContent = await persistHomepageContent(nextContent, token);
      setContent(savedContent);
      try {
        const parsed = JSON.parse(savedContent.heroSlidesJson || "[]") as HeroSlide[];
        setSlides(parsed);
      } catch {
        // fallback
      }
      setMessage("Homepage content saved successfully. Visit the home page to see the updated slider.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save homepage content.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSlideMediaUpload(file: File, index: number) {
    const token = window.localStorage.getItem("mins-admin-token");
    if (!token) {
      setMessage("Please login again before uploading media.");
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setMessage("Please upload an image or video file.");
      return;
    }

    setMessage(`Uploading media for Slide ${index + 1}...`);
    try {
      const uploaded = await uploadHomepageMedia(file, token);
      const updated = [...slides];
      updated[index] = {
        ...updated[index],
        mediaSrc: uploaded.url,
        mediaType: uploaded.type
      };
      setSlides(updated);
      setMessage(`Media uploaded successfully for Slide ${index + 1}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload slide media.");
    }
  }

  function addSlide() {
    setSlides([
      ...slides,
      {
        mediaSrc: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85",
        mediaType: "image",
        headline: "New Dynamic Slide Title",
        subheading: "Mines and Minerals corporate operations description.",
        badge: "PROFESSIONAL. TRUSTED. ESTABLISHED.",
        exploreBtnText: "Explore Work",
        exploreBtnLink: "/work",
        contactBtnText: "Contact Us",
        contactBtnLink: "/contact"
      }
    ]);
  }

  function removeSlide(index: number) {
    if (slides.length <= 1) {
      setMessage("You must keep at least one slide.");
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  }

  function moveSlide(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSlides(updated);
  }

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <form onSubmit={handleSave}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-navy">Manage Homepage Content</h1>
            <p className="mt-2 text-sm text-charcoal/60">
              Configure multiple hero banner slides (images/videos), dynamic callouts, statistics counters, and details.
            </p>
          </div>
          <Button type="submit" className="gap-2" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-8 grid gap-6">
          {/* Slides Editor Header */}
          <div className="flex items-center justify-between border-b border-navy/10 pb-3">
            <h2 className="text-lg font-bold text-navy">Hero Carousel Slides ({slides.length})</h2>
            <Button type="button" onClick={addSlide} variant="ghost" className="gap-1.5 py-1.5 h-9">
              <Plus size={16} />
              Add Banner Slide
            </Button>
          </div>

          {/* Slides List */}
          <div className="grid gap-6">
            {slides.map((slide, index) => (
              <div key={index} className="rounded-2xl border border-navy/10 bg-ivory p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-navy/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy text-base">Slide {index + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSlide(index, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-charcoal hover:bg-navy/5 disabled:opacity-40"
                        title="Move Up"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(index, "down")}
                        disabled={index === slides.length - 1}
                        className="rounded p-1 text-charcoal hover:bg-navy/5 disabled:opacity-40"
                        title="Move Down"
                      >
                        <ArrowDown size={15} />
                      </button>
                    </div>
                  </div>
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    Headline / Title
                    <input
                      type="text"
                      value={slide.headline}
                      onChange={(event) => {
                        const updated = [...slides];
                        updated[index] = { ...updated[index], headline: event.target.value };
                        setSlides(updated);
                      }}
                      required
                      className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none focus:border-gold"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    Badge / Eyebrow Text
                    <input
                      type="text"
                      value={slide.badge || ""}
                      onChange={(event) => {
                        const updated = [...slides];
                        updated[index] = { ...updated[index], badge: event.target.value };
                        setSlides(updated);
                      }}
                      placeholder="e.g. PROFESSIONAL. TRUSTED. ESTABLISHED."
                      className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none focus:border-gold"
                    />
                  </label>
                </div>

                <label className="mt-4 grid gap-2 text-sm font-semibold text-navy">
                  Subheading / Description Text
                  <textarea
                    value={slide.subheading}
                    onChange={(event) => {
                      const updated = [...slides];
                      updated[index] = { ...updated[index], subheading: event.target.value };
                      setSlides(updated);
                    }}
                    required
                    rows={2}
                    className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none focus:border-gold"
                  />
                </label>

                <div className="mt-4 grid gap-4 lg:grid-cols-[200px_1fr] lg:items-center">
                  <div className="overflow-hidden rounded-xl bg-navy shadow-sm border border-navy/10">
                    {slide.mediaType === "video" ? (
                      <video src={resolveApiUrl(slide.mediaSrc)} className="h-28 w-full object-cover" muted playsInline controls />
                    ) : (
                      <img src={resolveApiUrl(slide.mediaSrc)} alt={`Slide ${index + 1} preview`} className="h-28 w-full object-cover" />
                    )}
                  </div>
                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    Background Image/Video
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        if (file) void handleSlideMediaUpload(file, index);
                      }}
                      className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-gold file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
                    />
                    <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                      <input
                        value={slide.mediaSrc}
                        onChange={(event) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], mediaSrc: event.target.value };
                          setSlides(updated);
                        }}
                        placeholder="Or paste direct media URL"
                        className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none focus:border-gold"
                      />
                      <select
                        value={slide.mediaType}
                        onChange={(event) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], mediaType: event.target.value as "image" | "video" };
                          setSlides(updated);
                        }}
                        className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none focus:border-gold"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <label className="grid gap-1.5 text-xs font-semibold text-navy">
                    Explore Button Text
                    <input
                      type="text"
                      value={slide.exploreBtnText || ""}
                      onChange={(event) => {
                        const updated = [...slides];
                        updated[index] = { ...updated[index], exploreBtnText: event.target.value };
                        setSlides(updated);
                      }}
                      placeholder="Explore Work"
                      className="rounded-lg border border-navy/10 bg-white px-3 py-2 font-normal outline-none focus:border-gold"
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold text-navy">
                    Explore Button Link
                    <input
                      type="text"
                      value={slide.exploreBtnLink || ""}
                      onChange={(event) => {
                        const updated = [...slides];
                        updated[index] = { ...updated[index], exploreBtnLink: event.target.value };
                        setSlides(updated);
                      }}
                      placeholder="/work"
                      className="rounded-lg border border-navy/10 bg-white px-3 py-2 font-normal outline-none focus:border-gold"
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold text-navy">
                    Contact Button Text
                    <input
                      type="text"
                      value={slide.contactBtnText || ""}
                      onChange={(event) => {
                        const updated = [...slides];
                        updated[index] = { ...updated[index], contactBtnText: event.target.value };
                        setSlides(updated);
                      }}
                      placeholder="Contact Us"
                      className="rounded-lg border border-navy/10 bg-white px-3 py-2 font-normal outline-none focus:border-gold"
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold text-navy">
                    Contact Button Link
                    <input
                      type="text"
                      value={slide.contactBtnLink || ""}
                      onChange={(event) => {
                        const updated = [...slides];
                        updated[index] = { ...updated[index], contactBtnLink: event.target.value };
                        setSlides(updated);
                      }}
                      placeholder="/contact"
                      className="rounded-lg border border-navy/10 bg-white px-3 py-2 font-normal outline-none focus:border-gold"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* CTA & Stats section */}
          <div className="mt-6 border-t border-navy/10 pt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              CTA Banner Title
              <textarea
                value={content.ctaTitle}
                onChange={(event) => setContent({ ...content, ctaTitle: event.target.value })}
                rows={2}
                className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal leading-7 outline-none transition focus:border-gold"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-4">
              {content.stats.map((value, index) => (
                <label key={index} className="grid gap-2 text-sm font-semibold text-navy">
                  {statisticLabels[index] ?? `Statistic ${index + 1}`}
                  <input
                    value={value}
                    onChange={(event) => {
                      const nextStats = [...content.stats] as HomepageContent["stats"];
                      nextStats[index] = event.target.value;
                      setContent({ ...content, stats: nextStats });
                    }}
                    className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal outline-none transition focus:border-gold"
                  />
                </label>
              ))}
            </div>
          </div>

          {message ? (
            <p className={message.includes("required") || message.includes("Unable") || message.includes("login") ? "text-sm font-semibold text-red-700" : "text-sm font-semibold text-emerald-700"}>
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
