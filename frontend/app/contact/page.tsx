"use client";

import { useEffect, useState } from "react";
import { Clock, FileCheck2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  defaultSiteSettings,
  fetchSiteSettings,
  telUrl,
  whatsappUrl,
  type SiteSettings
} from "@/lib/site-settings-store";

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  const contactCards = [
    { title: "Principal Office", text: settings.location, icon: MapPin },
    { title: "Gosalpur Mine Site", text: settings.mineSiteAddress, icon: MapPin },
    { title: "Phone", text: settings.mobile, icon: Phone, href: telUrl(settings.mobile) },
    { title: "Email", text: settings.email, icon: Mail, href: `mailto:${settings.email}` },
    ...(settings.gstin || settings.proprietor
      ? [{ title: "GSTIN", text: `${settings.gstin} (Proprietorship: ${settings.proprietor})`, icon: FileCheck2 }]
      : []),
    { title: "Business Hours", text: "Monday to Saturday, 10:00 AM - 6:00 PM", icon: Clock }
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={`Start a professional conversation with ${settings.companyName}.`}
        text="Send an enquiry, call our team, or connect through WhatsApp for quick assistance."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <MotionReveal>
            <SectionHeading
              eyebrow="Enquiry Form"
              title="Tell us what you need."
              text="Usually responds within 24 hours during business days."
            />
            <ContactForm />
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <div className="grid gap-5">
              {contactCards.map((card) => {
                const content = (
                  <>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory text-gold">
                      <card.icon size={22} />
                    </div>
                    <div>
                      <h2 className="font-bold text-navy">{card.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-charcoal/68">{card.text}</p>
                    </div>
                  </>
                );

                return card.href ? (
                  <a key={card.title} href={card.href} className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
                    {content}
                  </a>
                ) : (
                  <div key={card.title} className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-card">
                    {content}
                  </div>
                );
              })}
              <a
                href={whatsappUrl(settings.whatsappNumber)}
                className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 transition hover:-translate-y-0.5"
              >
                <MessageCircle size={20} />
                Connect on WhatsApp
              </a>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="container-wide">
          <MotionReveal>
            <div className="overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-premium">
              <iframe
                title={`${settings.companyName} office location map`}
                src={settings.mapEmbedUrl}
                className="h-[420px] w-full"
                loading="lazy"
              />
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
