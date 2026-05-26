import type { Metadata } from "next";
import { MediaGallery } from "@/components/sections/media-gallery";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Browse the MINS modern media gallery with image and video cards, filters, lazy loading, and lightbox preview."
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Image and video gallery for company updates."
        text="A clean gallery with filters, lazy-loaded cards, hover effects, and media preview for polished browsing."
      />
      <section className="bg-white py-20 sm:py-28">
        <div className="container-wide">
          <MotionReveal>
            <SectionHeading
              align="center"
              eyebrow="Gallery"
              title="Browse media by category."
              text="The gallery shows the same image and video content that is uploaded and managed from the admin dashboard."
            />
          </MotionReveal>
          <div className="mt-12">
            <MediaGallery />
          </div>
        </div>
      </section>
    </>
  );
}
