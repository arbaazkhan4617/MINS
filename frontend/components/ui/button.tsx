import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  disabled = false
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" &&
      "bg-navy text-white shadow-card hover:-translate-y-0.5 hover:bg-charcoal",
    variant === "secondary" &&
      "border border-white/60 bg-white/90 text-navy hover:-translate-y-0.5 hover:bg-white",
    variant === "ghost" &&
      "border border-navy/10 bg-white text-navy hover:-translate-y-0.5 hover:border-gold/50 hover:bg-ivory",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
