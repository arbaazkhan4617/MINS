import { MotionReveal } from "@/components/ui/motion-reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
};

export function PageHero({ eyebrow, title, text }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-ivory via-white to-[#FFF8EA] py-16 sm:py-22 lg:py-24">
      <div className="container-wide">
        <MotionReveal className="max-w-4xl">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.26em] text-gold">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-navy sm:text-5xl lg:text-[3.65rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-charcoal/70 sm:text-lg">
            {text}
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}

