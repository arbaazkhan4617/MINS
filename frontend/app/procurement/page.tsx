"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Info, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings-store";
import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

type AllocationItem = {
  mineral: string;
  status: string;
  color: string;
};

export default function ProcurementPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [formData, setFormData] = useState({
    mineral: "Iron Ore (Hematite Lumps)",
    volume: "",
    specs: "",
    destination: "",
    name: "",
    company: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchSiteSettings().then(setSettings);
  }, []);

  let allocations: AllocationItem[] = [];
  try {
    if (settings.assetAllocationsJson) {
      allocations = JSON.parse(settings.assetAllocationsJson);
    }
  } catch (e) {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const messageContent = `Target Mineral: ${formData.mineral}\n` +
      `Requested Allocation Volume: ${formData.volume}\n` +
      `Target Chemical Specifications: ${formData.specs}\n` +
      `Destination Port / Delivery Location: ${formData.destination}\n` +
      `Company: ${formData.company}`;

    const contactPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: messageContent
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          ...API_TUNNEL_HEADERS,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactPayload)
      });

      if (!response.ok) {
        throw new Error("Unable to submit procurement request. Please verify fields and try again.");
      }

      setSuccess(true);
      setFormData({
        mineral: "Iron Ore (Hematite Lumps)",
        volume: "",
        specs: "",
        destination: "",
        name: "",
        company: "",
        email: "",
        phone: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "green":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "yellow":
        return "bg-amber-50 border-amber-200 text-amber-800";
      default:
        return "bg-slate-50 border-slate-200 text-slate-800";
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Global Procurement"
        title="Asset Allocation & Inquiry."
        text="Manage your bulk mineral allocations directly. Review spot availability status and submit offtake capacity requests below."
      />

      <section className="bg-white py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* Left: Stock Widget */}
            <div className="grid gap-6">
              <MotionReveal>
                <div className="rounded-3xl border border-navy/10 bg-ivory/20 p-8 shadow-card">
                  <div className="flex items-center gap-2.5 text-navy">
                    <ShieldCheck className="text-gold" size={24} />
                    <h3 className="font-display text-xl font-bold">Asset Allocation Tracking</h3>
                  </div>
                  <p className="mt-4 text-xs text-charcoal/60 leading-5">
                    This live operational widget displays current allocation levels across our active mining reserves. Stock levels represent current spot availability and are updated programmatically.
                  </p>

                  <div className="mt-8 space-y-4">
                    {allocations.map((item, index) => (
                      <div key={index} className="flex flex-col gap-2 rounded-2xl border border-navy/5 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm font-bold text-navy">{item.mineral}</span>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(item.color)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.12}>
                <div className="rounded-3xl border border-navy/10 bg-mist p-8">
                  <div className="flex gap-3">
                    <Info className="text-gold shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-display text-base font-bold text-navy">Locking Allocation Grades</h4>
                      <p className="mt-2 text-xs leading-5 text-charcoal/70">
                        To secure a specific chemical grade, size configuration, or lock in multi-year contract quantities, please submit an official inquiry using the terminal on the right.
                      </p>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>

            {/* Right: Form */}
            <MotionReveal delay={0.06}>
              <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-premium sm:p-12">
                <h3 className="font-display text-2xl font-bold text-navy">Procurement Terminal</h3>
                <p className="mt-2 text-sm text-charcoal/60">
                  Please specify your raw material criteria. Our supply dispatch team will verify capacities and contact you.
                </p>

                {success && (
                  <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
                    <CheckCircle2 size={24} className="shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Request Submitted Successfully</p>
                      <p className="mt-1 text-xs text-emerald-700/90">
                        Your bulk allocation request has been registered. Our logistics and engineering division will review the specifications and reply to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-navy">Target Mineral Selection</label>
                    <select
                      value={formData.mineral}
                      onChange={(e) => setFormData({ ...formData, mineral: e.target.value })}
                      className="rounded-xl border border-navy/10 bg-ivory/50 px-4 py-3.5 text-sm outline-none transition focus:border-gold"
                    >
                      <option value="Iron Ore (Hematite Lumps)">Iron Ore (Hematite Lumps)</option>
                      <option value="Iron Ore (Hematite Fines)">Iron Ore (Hematite Fines)</option>
                      <option value="Iron Ore (Blue Dust Powder)">Iron Ore (Blue Dust Powder)</option>
                      <option value="Manganese Ore">Manganese Ore</option>
                      <option value="Laterite">Laterite</option>
                      <option value="Ochre">Ochre</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-navy">Requested Allocation Volume (Metric Tons)</label>
                    <input
                      required
                      placeholder="e.g. 5,000 Tons per Month / Annum"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="rounded-xl border border-navy/10 bg-ivory/50 px-4 py-3.5 text-sm outline-none transition focus:border-gold"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-navy">Target Chemical Specifications / Grade Requirements</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Fe content min 65%, Silica max 2%, Sizing 10-30mm"
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      className="resize-none rounded-xl border border-navy/10 bg-ivory/50 px-4 py-3.5 text-sm outline-none transition focus:border-gold"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-navy">Destination Port / Delivery Location</label>
                    <input
                      required
                      placeholder="e.g. FOB Mundra Port, Rail-head Gosalpur, or Ex-Mine"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="rounded-xl border border-navy/10 bg-ivory/50 px-4 py-3.5 text-sm outline-none transition focus:border-gold"
                    />
                  </div>

                  <div className="border-t border-navy/5 pt-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gold">Corporate Contact Info</h4>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">Contact Name</label>
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-xl border border-navy/10 bg-ivory/50 px-3 py-2.5 text-sm outline-none transition focus:border-gold"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">Company Name</label>
                        <input
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="rounded-xl border border-navy/10 bg-ivory/50 px-3 py-2.5 text-sm outline-none transition focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">Email Address</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-xl border border-navy/10 bg-ivory/50 px-3 py-2.5 text-sm outline-none transition focus:border-gold"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">Mobile Number</label>
                        <input
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-xl border border-navy/10 bg-ivory/50 px-3 py-2.5 text-sm outline-none transition focus:border-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-4 text-xs font-bold uppercase tracking-widest text-navy transition hover:bg-navy hover:text-white disabled:bg-navy/30"
                  >
                    <Send size={14} />
                    {isSubmitting ? "Submitting Terminal request..." : "Submit Allocation Request"}
                  </button>
                </form>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
