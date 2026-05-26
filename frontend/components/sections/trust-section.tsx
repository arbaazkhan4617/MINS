import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { trustBadges } from "@/lib/data";

export function TrustSection() {
  return (
    <section className="bg-[#FFF8EA] py-16 sm:py-24">
      <div className="container-wide">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <MotionReveal>
            <SectionHeading
              eyebrow="Trust Indicators"
              title="Credibility that comes from steady business habits."
              text="MINS presents itself with the discipline expected from an established Indian business: documentation, timely communication, and transparent operations."
            />
          </MotionReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustBadges.map((badge, index) => (
              <MotionReveal key={badge.title} delay={index * 0.04}>
                <article className="group h-full rounded-2xl border border-gold/15 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-ivory">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-gold group-hover:bg-white">
                    <badge.icon size={20} />
                  </div>
                  <h3 className="font-bold text-navy">{badge.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-charcoal/66">{badge.text}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

