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
  gstin: string;
  proprietor: string;
  mineSiteAddress: string;
  updatedAt?: string;
};

export const defaultSiteSettings: SiteSettings = {
  companyName: "S S Enterprises (MINS)",
  tagline: "Building Trust Since 2007",
  logoUrl: "",
  email: "info@ssenterprises.in",
  mobile: "+91 82260 23925",
  whatsappNumber: "918226023925",
  location: "APR Society, H No 40, Katanga Colony, Jabalpur, Madhya Pradesh 482001",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.0267784013444!2d79.9298585!3d23.169223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae17671fe25b%3A0x6bde3084346bbdbf!2sKatanga%2C%20Jabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  websiteUrl: "#",
  facebookUrl: "#",
  instagramUrl: "#",
  linkedinUrl: "#",
  xUrl: "#",
  copyrightText: "Copyright (c) 2026 S S Enterprises (MINS). All rights reserved.",
  aboutEyebrow: "About S S Enterprises",
  aboutTitle: "A certified partner in safety, environmental stewardship, and sustainable resource extraction.",
  aboutContent:
    "Established in 2007, S S Enterprises operates the Gosalpur Mine (39.44 Hectares) for manganese, iron ore, laterite, and ochre extraction. Certified for ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018, we deliver high-quality minerals under strict CPCB environmental guidelines.",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
  directorMessage:
    "At S S Enterprises, our goal is to build trust through quality work, dedicated service, and environmental compliance. We believe success comes from customer satisfaction, safety stewardship, and continuous improvement.",
  gstin: "23AWWPS5673F2ZU",
  proprietor: "Neeraj Shrivastava",
  mineSiteAddress: "Khasra No. 160, 151, 123, 115, Village Gosalpur, Tehsil Sihora, Jabalpur, Madhya Pradesh 483222"
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
