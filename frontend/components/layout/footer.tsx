"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { navLinks } from "@/lib/data";
import { defaultSiteSettings, fetchSiteSettings, telUrl, whatsappUrl, type SiteSettings } from "@/lib/site-settings-store";

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  const socials = [
    { href: settings.websiteUrl, label: "Website", icon: Globe2 },
    { href: whatsappUrl(settings.whatsappNumber), label: "WhatsApp", icon: MessageCircle },
    { href: settings.linkedinUrl, label: "LinkedIn", icon: BriefcaseBusiness }
  ];

  return (
    <footer className="border-t border-navy/10 bg-ivory">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-3xl font-bold text-navy">{settings.companyName}</div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-charcoal/70">
            {settings.aboutContent}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-navy">
            Quick Links
          </h3>
          <div className="mt-5 grid gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal/70 transition-colors hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="text-sm text-charcoal/70 transition-colors hover:text-navy"
            >
              Admin
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-navy">
            Contact
          </h3>
          <div className="mt-5 grid gap-4 text-sm text-charcoal/70">
            <p className="flex gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-gold" />
              {settings.location}
            </p>
            <a href={telUrl(settings.mobile)} className="flex gap-3">
              <Phone size={18} className="shrink-0 text-gold" />
              {settings.mobile}
            </a>
            <a href={`mailto:${settings.email}`} className="flex gap-3">
              <Mail size={18} className="shrink-0 text-gold" />
              {settings.email}
            </a>
            <div className="text-xs text-charcoal/50 pt-2 border-t border-navy/5 leading-5">
              GSTIN: {settings.gstin}<br />
              Proprietor: {settings.proprietor}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-navy">
            Social
          </h3>
          <div className="mt-5 flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href || "#"}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition hover:-translate-y-0.5 hover:border-gold/50"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-navy/10 py-5">
        <p className="container-wide text-center text-xs text-charcoal/60">
          {settings.copyrightText}
        </p>
      </div>
    </footer>
  );
}
