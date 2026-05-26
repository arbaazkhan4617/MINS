"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { resolveApiUrl } from "@/lib/api";
import { navLinks } from "@/lib/data";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/90 backdrop-blur-xl">
      <nav className="container-wide flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="MINS home">
          {settings.logoUrl ? (
            <img
              src={resolveApiUrl(settings.logoUrl)}
              alt={settings.companyName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
              {settings.companyName.charAt(0)}
            </span>
          )}
          <span>
            <span className="block font-display text-2xl font-bold tracking-wide text-navy">
              {settings.companyName}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              {settings.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold text-charcoal/70 transition-colors hover:text-navy",
                pathname === link.href && "text-navy"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button href="/contact">Contact Us</Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-navy/10 p-3 text-navy lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-navy/10 bg-white lg:hidden">
          <div className="container-wide grid gap-3 py-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-charcoal/80 hover:bg-ivory hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contact" className="mt-2">
              Contact Us
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
