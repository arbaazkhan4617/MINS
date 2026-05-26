import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/ui/motion-reveal";

export function WowSection() {
  return (
    <section className="relative isolate min-h-[72vh] overflow-hidden bg-navy py-20 text-white">
      <img
        src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1800&q=85"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/86 via-navy/64 to-navy/28" />
      <div className="container-wide flex min-h-[56vh] items-center">
        <MotionReveal className="max-w-3xl">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-sand">Dependable relationships</p>
          <h2 className="font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            15+ years of dependable business relationships.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            The real measure of a business is not how polished it looks, but whether customers feel comfortable trusting it again. MINS is built around that comfort.
          </p>
          <Button href="/contact" variant="secondary" className="mt-8">
            Start a Conversation
          </Button>
        </MotionReveal>
      </div>
    </section>
  );
}

