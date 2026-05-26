"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  loadProjectsFromStorage,
  type ProjectItem
} from "@/lib/project-store";

export function FeaturedWork() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    function syncProjects() {
      setProjects(
        loadProjectsFromStorage().filter((project) => project.status === "Published")
      );
    }

    syncProjects();
    window.addEventListener("storage", syncProjects);
    window.addEventListener("mins-projects-updated", syncProjects);

    return () => {
      window.removeEventListener("storage", syncProjects);
      window.removeEventListener("mins-projects-updated", syncProjects);
    };
  }, []);

  return (
    <section className="bg-[#FFF8EA] py-16 sm:py-24">
      <div className="container-wide">
        <MotionReveal>
          <SectionHeading
            align="center"
            eyebrow="Featured Work"
            title="Work that tells a practical business story."
            text="These showcase cards focus on coordination, outcomes, and service discipline instead of generic portfolio language."
          />
        </MotionReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {projects.slice(0, 2).map((project, index) => (
            <MotionReveal key={project.id} delay={index * 0.06}>
              <article className="group h-full overflow-hidden rounded-[1.75rem] bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-premium">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/72 via-navy/8 to-transparent" />
                  <p className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur">
                    {project.category}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal/68">{project.summary}</p>
                  {project.outcome ? (
                    <p className="mt-4 rounded-2xl bg-ivory p-4 text-sm font-semibold leading-7 text-charcoal/72">
                      Outcome: {project.outcome}
                    </p>
                  ) : null}
                  <Link href="/work" className="mt-5 inline-flex items-center text-sm font-bold text-navy hover:text-gold">
                    Read more <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
