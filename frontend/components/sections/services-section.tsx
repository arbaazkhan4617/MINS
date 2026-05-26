import { ArrowUpRight } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/lib/data";

export function ServicesSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <MotionReveal>
            <SectionHeading
              eyebrow="Services"
              title="Business support rooted in practical execution."
              text="From trading and product supply to consultancy and customer support, each service is shaped around real operating needs."
            />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <p className="max-w-sm rounded-2xl bg-ivory p-5 text-sm leading-7 text-charcoal/68 shadow-card">
              Every service card is ready to connect with backend-managed content as the company adds real case studies and media.
            </p>
          </MotionReveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <MotionReveal key={service.title} delay={index * 0.04}>
              <article className="group h-full rounded-2xl border border-navy/10 bg-gradient-to-br from-ivory to-white p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-premium">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold shadow-card">
                    <service.icon size={23} />
                  </div>
                  <ArrowUpRight
                    size={21}
                    className="text-charcoal/35 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                  />
                </div>
                <h3 className="text-lg font-bold text-navy">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/68">
                  {service.text}
                </p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

