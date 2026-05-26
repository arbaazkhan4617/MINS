import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyChooseUs } from "@/lib/data";

export function WhyChooseUs() {
  return (
    <section className="bg-mist py-16 sm:py-24">
      <div className="container-wide">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <MotionReveal>
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Reliability that feels personal, not procedural."
              text="We pair professional standards with human responsiveness, because customers trust teams that stay present through the full journey."
            />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-gold/20 bg-white p-6 shadow-card">
              <p className="font-display text-3xl font-semibold text-navy">Clear, steady, accountable.</p>
              <p className="mt-3 text-sm leading-7 text-charcoal/68">
                Our work style is simple: understand the requirement, keep every stakeholder informed, and close the loop with care.
              </p>
            </div>
          </MotionReveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {whyChooseUs.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-navy/10 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-ivory">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-gold">
                  <item.icon size={21} />
                </div>
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/68">
                  {item.text}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

