"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Save, Upload, Video } from "lucide-react";
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

const statisticLabels = [
  "Years Experience",
  "Projects Coordinated",
  "Customers Served",
  "Commitment"
];

export function HomepageContentManager() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(defaultHomepageContent.heroMediaSrc);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      const savedContent = await fetchHomepageContent();
      if (!mounted) return;
      setContent(savedContent);
      setPreviewUrl(savedContent.heroMediaSrc);
    }

    setContent(loadHomepageContent());
    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.heroHeadline.trim() || !content.heroSubheading.trim()) {
      setMessage("Hero headline and subheadline are required.");
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
      let nextContent = content;

      if (selectedFile) {
        const uploaded = await uploadHomepageMedia(selectedFile, token);
        nextContent = {
          ...content,
          heroMediaSrc: uploaded.url,
          heroMediaType: uploaded.type
        };
      }

      const savedContent = await persistHomepageContent(nextContent, token);
      setContent(savedContent);
      setPreviewUrl(savedContent.heroMediaSrc);
      setSelectedFile(null);
      setMessage("Homepage content saved to database. Visit the home page to see the updated content.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save homepage content.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleHeroMediaUpload(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setMessage("Please upload an image or video file for hero media.");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(localPreviewUrl);
    setContent({
      ...content,
      heroMediaType: file.type.startsWith("video/") ? "video" : "image"
    });
    setMessage("Hero media selected. Click Save Changes to upload it and publish it.");
  }

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
      <form onSubmit={handleSave}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-navy">Manage Homepage Content</h1>
            <p className="mt-2 text-sm text-charcoal/60">
              Update the hero headline, hero subheadline, hero image/video, statistics, CTA text, and featured sections.
            </p>
          </div>
          <Button type="submit" className="gap-2" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Hero Headline
            <textarea
              value={content.heroHeadline}
              onChange={(event) => setContent({ ...content, heroHeadline: event.target.value })}
              rows={2}
              className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal leading-7 outline-none transition focus:border-gold"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-navy">
            Hero Subheading
            <textarea
              value={content.heroSubheading}
              onChange={(event) => setContent({ ...content, heroSubheading: event.target.value })}
              rows={4}
              className="resize-none rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-normal leading-7 outline-none transition focus:border-gold"
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-center">
            <div className="overflow-hidden rounded-2xl bg-navy shadow-card">
              {content.heroMediaType === "video" ? (
                <video src={resolveApiUrl(previewUrl)} className="h-40 w-full object-cover" muted loop playsInline controls />
              ) : (
                <img src={resolveApiUrl(previewUrl)} alt="Hero media preview" className="h-40 w-full object-cover" />
              )}
            </div>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Hero Background Media
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(event) => handleHeroMediaUpload(event.target.files?.[0] ?? null)}
                className="rounded-xl border border-navy/10 bg-ivory px-4 py-3 text-sm font-normal outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-gold"
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                <input
                  value={content.heroMediaSrc.startsWith("data:") ? "" : content.heroMediaSrc}
                  onChange={(event) =>
                    {
                      setSelectedFile(null);
                      setPreviewUrl(event.target.value);
                      setContent({
                        ...content,
                        heroMediaSrc: event.target.value
                      });
                    }
                  }
                  placeholder="Or paste image/video URL"
                  className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
                />
                <select
                  value={content.heroMediaType}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      heroMediaType: event.target.value as HomepageContent["heroMediaType"]
                    })
                  }
                  className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-normal outline-none transition focus:border-gold"
                >
                  <option value="image">Image URL</option>
                  <option value="video">Video URL</option>
                </select>
              </div>
              <span className="flex items-center gap-2 text-xs font-normal leading-5 text-charcoal/55">
                {content.heroMediaType === "video" ? <Video size={14} /> : <ImageIcon size={14} />}
                Current hero media: {content.heroMediaType}. Upload a file or paste a direct media URL.
              </span>
              <span className="flex items-center gap-2 text-xs font-normal leading-5 text-charcoal/55">
                <Upload size={14} />
                Uploaded files are saved in the backend uploads folder and stored in the database.
              </span>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-navy">
            CTA Title
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
