"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { cn } from "@/lib/utils";
import {
  loadProjectsFromStorage,
  type ProjectItem
} from "@/lib/project-store";

export function PortfolioGrid() {
  const [active, setActive] = useState("All");
  const [items, setItems] = useState<ProjectItem[]>([]);

  useEffect(() => {
    function syncProjects() {
      setItems(loadProjectsFromStorage());
    }

    syncProjects();
    window.addEventListener("storage", syncProjects);
    window.addEventListener("mins-projects-updated", syncProjects);

    return () => {
      window.removeEventListener("storage", syncProjects);
      window.removeEventListener("mins-projects-updated", syncProjects);
    };
  }, []);

  const publishedProjects = useMemo(
    () => items.filter((project) => project.status === "Published"),
    [items]
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(publishedProjects.map((item) => item.category)))],
    [publishedProjects]
  );

  const filteredProjects = useMemo(() => {
    if (active === "All") {
      return publishedProjects;
    }

    return publishedProjects.filter((project) => project.category === active);
  }, [active, publishedProjects]);

  useEffect(() => {
    if (active !== "All" && !categories.includes(active)) {
      setActive("All");
    }
  }, [active, categories]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-semibold transition",
              active === category
                ? "border-navy bg-navy text-white shadow-card"
                : "border-navy/10 bg-white text-charcoal/70 hover:border-gold/60 hover:bg-ivory hover:text-navy"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <MotionReveal key={project.id} delay={index * 0.05}>
            <article className="group h-full overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-premium">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/76 via-transparent to-transparent opacity-90" />
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gold backdrop-blur">
                  {project.category}
                </span>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h2 className="font-display text-2xl font-semibold">{project.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm leading-7 text-charcoal/68">{project.summary}</p>
                  <ArrowUpRight className="shrink-0 text-gold transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={20} />
                </div>
                {project.outcome ? (
                  <div className="mt-5 rounded-2xl bg-ivory p-4 text-sm font-semibold leading-7 text-charcoal/72">
                    Client outcome: {project.outcome}
                  </div>
                ) : null}
              </div>
            </article>
          </MotionReveal>
        ))}
      </div>
    </div>
  );
}
