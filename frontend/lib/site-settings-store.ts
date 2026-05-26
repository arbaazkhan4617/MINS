import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export type SiteSettings = {
  companyName: string;
  tagline: string;
  logoUrl: string;
  email: string;
  mobile: string;
  whatsappNumber: string;
  location: string;
  mapEmbedUrl: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  xUrl: string;
  copyrightText: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImageUrl: string;
  directorMessage: string;
  updatedAt?: string;
};

export const defaultSiteSettings: SiteSettings = {
  companyName: "MINS",
  tagline: "Since 2007",
  logoUrl: "",
  email: "info@mins.example",
  mobile: "+91 98765 43210",
  whatsappNumber: "919876543210",
  location: "MP Nagar, Bhopal, Madhya Pradesh",
  mapEmbedUrl: "https://www.google.com/maps?q=MP%20Nagar%2C%20Bhopal&output=embed",
  websiteUrl: "#",
  facebookUrl: "#",
  instagramUrl: "#",
  linkedinUrl: "#",
  xUrl: "#",
  copyrightText: "Copyright (c) 2026 MINS. All rights reserved.",
  aboutEyebrow: "About MINS",
  aboutTitle: "A dependable corporate partner focused on long-term value.",
  aboutContent:
    "MINS combines practical business experience, careful execution, and customer-first thinking to deliver services with consistency and trust.",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
  directorMessage:
    "Our focus is simple: understand the client, communicate clearly, deliver responsibly, and keep improving. MINS is committed to growing with professionalism, humility, and dependable service."
};

export async function fetchSiteSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/site-settings`, {
      headers: API_TUNNEL_HEADERS
    });

    if (!response.ok) {
      return defaultSiteSettings;
    }

    return { ...defaultSiteSettings, ...((await response.json()) as Partial<SiteSettings>) };
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/site-settings`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(settings)
  });

  if (!response.ok) {
    throw new Error("Unable to save site settings.");
  }

  return { ...defaultSiteSettings, ...((await response.json()) as Partial<SiteSettings>) };
}

export async function uploadSiteAsset(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/site-settings/uploads`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Unable to upload file.");
  }

  return (await response.json()) as { url: string };
}

export function whatsappUrl(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

export function telUrl(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
