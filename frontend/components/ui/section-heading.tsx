import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold leading-[1.12] text-navy sm:text-[2.45rem] lg:text-[2.9rem]">
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-base leading-8 text-charcoal/70 sm:text-[1.05rem]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

