"use client";

import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { resolveApiUrl } from "@/lib/api";
import { fetchClients, type ClientProfile } from "@/lib/client-store";
import { testimonials } from "@/lib/data";

export function TestimonialsSection() {
  const [clients, setClients] = useState<ClientProfile[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadClients() {
      const data = await fetchClients();
      if (mounted) {
        setClients(data);
      }
    }

    void loadClients();

    return () => {
      mounted = false;
    };
  }, []);

  const items =
    clients.length > 0
      ? clients
      : testimonials.map((testimonial, index) => ({
          id: index,
          name: testimonial.name,
          role: testimonial.role,
          company: testimonial.company,
          quote: testimonial.quote,
          photoUrl: testimonial.avatar,
          displayOrder: index + 1
        }));

  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="container-wide">
        <MotionReveal>
          <SectionHeading
            align="center"
            eyebrow="Client Voices"
            title="Short, believable feedback from business relationships."
            text="The language is intentionally practical, because real customers value clarity, follow-up, and reliability more than grand claims."
          />
        </MotionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((client, index) => (
            <MotionReveal key={client.id} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-navy/10 bg-white p-8 shadow-card">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={resolveApiUrl(client.photoUrl)}
                      alt={client.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-navy">{client.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                        {client.role}
                      </p>
                    </div>
                  </div>
                  <Quote className="shrink-0 text-gold" size={30} />
                </div>
                <p className="mt-6 text-base leading-8 text-charcoal/72">
                  "{client.quote}"
                </p>
                <div className="mt-8 rounded-xl bg-ivory px-4 py-3 text-xs font-bold text-navy">
                  {client.company}
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
