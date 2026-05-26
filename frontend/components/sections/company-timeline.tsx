import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { timeline } from "@/lib/data";

export function CompanyTimeline() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-wide">
        <MotionReveal>
          <SectionHeading
            align="center"
            eyebrow="Our Journey"
            title="A company story shaped by years of service."
            text="The timeline gives the website a sense of history, growth, and continuity beyond a generic service brochure."
          />
        </MotionReveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          {timeline.map((item, index) => (
            <MotionReveal key={item.year} delay={index * 0.05}>
              <article className="relative h-full rounded-2xl border border-navy/10 bg-ivory p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-display text-2xl font-semibold text-gold">{item.year}</span>
                </div>
                <h3 className="font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/66">{item.text}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

