import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyClientsTrust } from "@/lib/data";

export function ClientsTrustSection() {
  return (
    <section className="bg-mist py-16 sm:py-24">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <MotionReveal>
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-premium">
            <Image
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
              alt="Business discussion with client"
              width={900}
              height={700}
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-5 backdrop-blur">
              <p className="font-display text-3xl font-semibold text-navy">Relationships first</p>
              <p className="mt-2 text-sm leading-6 text-charcoal/68">A reliable team becomes part of how a business owner plans with confidence.</p>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.12}>
          <SectionHeading
            eyebrow="Why Clients Trust Us"
            title="We make business coordination feel less uncertain."
            text="Clients do not only need a service provider. They need people who listen carefully, respond on time, and keep the work moving without confusion."
          />
          <div className="mt-7 grid gap-4">
            {whyClientsTrust.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-white p-4 shadow-card">
                <CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={20} />
                <p className="text-sm font-semibold leading-7 text-charcoal/72">{item}</p>
              </div>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

