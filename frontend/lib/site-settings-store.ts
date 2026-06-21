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
  whyChooseUsJson: string;
  coreValuesJson: string;
  servicesJson: string;
  futureGoalsJson: string;
  strengthText: string;
  commitmentText: string;
  productsJson: string;
  technicalSpecsJson: string;
  safetyGuidelinesJson: string;
  supplyTermsJson: string;
  assetAllocationsJson: string;
  registeredOfficeJson: string;
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
  gstin: "",
  proprietor: "",
  mineSiteAddress: "Khasra No. 160, 151, 123, 115, Village Gosalpur, Tehsil Sihora, Jabalpur, Madhya Pradesh 483222",
  whyChooseUsJson: JSON.stringify([
    { "title": "15+ Years of Experience", "text": "Continuous mineral operations, regional trust, and logistics experience since 2007." },
    { "title": "Trusted & Professional Team", "text": "Led by experienced industry specialists, geologists, and managers." },
    { "title": "Quality Service Assurance", "text": "Carefully mined manganese, laterite, iron ore, and ochre prepared to specifications." },
    { "title": "Customer Satisfaction", "text": "Dedicated customer relationships and commitment to delivering excellence." },
    { "title": "Timely Project Delivery", "text": "Structured transport and loading coordination with full dispatch documentation." },
    { "title": "Transparent Business Ethics", "text": "Strict adherence to compliance, licensing, and professional business practices." }
  ]),
  servicesJson: JSON.stringify([
    { "title": "Trading Services", "text": "Reliable mining, sorting, and supply of manganese and iron ore from Gosalpur Lease." },
    { "title": "Industrial Solutions", "text": "Consistent delivery of quality industrial laterite and ochre for regional manufacturers." },
    { "title": "Business Consultancy", "text": "Consultancy for safety, environmental compliance, and resources stewardship." },
    { "title": "Product Supply", "text": "High-grade mineral supply directly from extraction sites under certified quality protocols." },
    { "title": "Marketing Services", "text": "Professional distribution, client relations, and market advisory for mineral products." },
    { "title": "Customer Support", "text": "Dedicated dispatch, logistics coordination, and NABL-accredited reporting support." }
  ]),
  coreValuesJson: JSON.stringify(["Integrity", "Quality", "Commitment", "Innovation", "Customer First", "Teamwork"]),
  futureGoalsJson: JSON.stringify(["Expand business nationwide", "Introduce innovative solutions", "Build stronger customer relationships", "Achieve sustainable growth"]),
  strengthText: "Our strength lies in our experienced team, strong customer relationships, and commitment to delivering excellence in every project.",
  commitmentText: "We are committed to maintaining the highest standards of professionalism, reliability, and service excellence for every client.",
  productsJson: JSON.stringify([
    {
      "id": "hematite-lumps-fines",
      "name": "High-Grade Hematite (Lumps & Fines)",
      "description": "Sized lumps and fines featuring excellent metallurgical properties, structural density, and high mechanical strength.",
      "variantName": "Hematite Lumps & Fines",
      "coaUrl": ""
    },
    {
      "id": "blue-dust",
      "name": "Blue Dust (Ultra-Fine Hematite)",
      "description": "A premium, naturally occurring friable form of hematite. It is chemically characterized by its exceptionally high iron (Fe) content, ultra-fine particle profile, and negligible chemical impurities.",
      "variantName": "Ultra-Fine Blue Dust",
      "coaUrl": ""
    },
    {
      "id": "manganese-ore",
      "name": "Manganese Ore",
      "description": "Vital alloying element critical for the production of ferroalloys, specialized stainless steel, and industrial chemical applications.",
      "variantName": "Industrial Manganese Ore",
      "coaUrl": ""
    },
    {
      "id": "laterite",
      "name": "Laterite",
      "description": "Extensively utilized as an essential chemical corrective component in cement clinker manufacturing and heavy infrastructure applications.",
      "variantName": "Cement Corrective Laterite",
      "coaUrl": ""
    },
    {
      "id": "ochre",
      "name": "Ochre",
      "description": "High-purity natural pigmenting agents processed for structural stability in the paint, coatings, plastics, and ceramics industries.",
      "variantName": "Natural Mineral Ochre",
      "coaUrl": ""
    }
  ]),
  technicalSpecsJson: JSON.stringify({
    "description": "The physical and chemical configurations detailed below represent typical parameters for our core asset extractions. No fixed timelines apply. Exact contractual parameters are verified via independent lot certification at the point of loading.",
    "specificationsTable": [
      {"parameter": "Hematite Iron Ore Fe content", "value": "64% - 67% typical"},
      {"parameter": "Manganese Ore Mn content", "value": "28% - 46% typical"},
      {"parameter": "Laterite Fe2O3 content", "value": "Suitable for cement corrective"},
      {"parameter": "Ochre Fe2O3 content", "value": "High-purity natural pigment"}
    ],
    "secureLogistics": "Every bulk haulage unit carrying Blue Dust is securely sheeted with heavy-duty polymer tarpaulins, passing through high-impact wheel-and-chassis washing bays before exiting the lease perimeter to prevent off-site track-out."
  }),
  safetyGuidelinesJson: JSON.stringify({
    "overview": "SSE enforces a risk assessment, and operational control structure aimed at achieving an absolute zero-harm workplace.",
    "items": [
      {"title": "Continuous Airborne Monitoring", "text": "Regular, quantified air quality and crystalline silica exposure testing across all work zones to safeguard personnel respiratory health."},
      {"title": "Proactive Hazard Elimination", "text": "Mechanized equipment interfaces and automated handling lines drastically reduce manual worker exposure to open extraction vectors."},
      {"title": "HSE Training & Leadership", "text": "Mandatory, continuous safety competency training, operational risk profiling, and immediate incident reporting systems for all field teams and logistics contractors."}
    ]
  }),
  supplyTermsJson: JSON.stringify({
    "terms": [
      {"title": "Contractual Formation", "text": "All supply provisions, offtake allocations, and pricing metrics are governed strictly by executed written contracts. SSE expressly rejects any standard purchase terms or unilateral buyer mandates unless explicitly integrated via a signed Order Acceptance."},
      {"title": "Title & Risk Allocation", "text": "Risk of loss passes to the purchaser immediately upon delivery to the agreed Free-on-Board (FOB), rail-head, or ex-mine destination. Legal title to all bulk minerals remains vested in SSE until full, unencumbered payment is received in our accounts."},
      {"title": "Quality Inspection Protocols", "text": "Final chemical and physical grading configurations are established at the loading point by authorized independent surveyors. These findings constitute the definitive metrics for commercial invoicing."},
      {"title": "Force Majeure Allocation", "text": "SSE shall not be held liable for supply gaps, transit stoppages, or production deficits arising from acts of God, labour disruptions, government intervention, or revisions to statutory mining laws."}
    ],
    "legalDisclaimer": "The data hosted on this platform is for informational purposes only and is delivered on an \"as-is\" and \"as-available\" basis without any express or implied warranties. SSE does not guarantee the absolute real-time accuracy or market completeness of the geological estimates shown. No details contained herein constitute an institutional offer to sell, a prospectus, or financial advice regarding mineral forward pricing. Users leverage this domain's digital assets entirely at their own commercial risk."
  }),
  assetAllocationsJson: JSON.stringify([
    {"mineral": "Iron Ore: High-Grade Hematite Lumps", "status": "ALLOCATED / MULTI-YEAR CONTRACTS ONLY", "color": "blue"},
    {"mineral": "Iron Ore: Sized Hematite Fines", "status": "SPOT VOLUME AVAILABLE", "color": "green"},
    {"mineral": "Iron Ore: Ultra-Fine Blue Dust", "status": "SPOT VOLUME AVAILABLE", "color": "green"},
    {"mineral": "Manganese Ore (High/Medium Grade)", "status": "LIMITED CAPACITY", "color": "yellow"},
    {"mineral": "Laterite (Cement Corrective Grade)", "status": "HIGH AVAILABILITY", "color": "green"},
    {"mineral": "Ochre (Natural Red / Yellow)", "status": "SPOT VOLUME AVAILABLE", "color": "green"}
  ]),
  registeredOfficeJson: JSON.stringify({
    "officeName": "S S Enterprises",
    "address": "40, APR Society, Katanga Colony, Jabalpur, Madhya Pradesh 482001",
    "miningOperations": "Village Gosalpur, Tehsil Sihora, District Jabalpur, Madhya Pradesh",
    "isoCertifications": "ISO 9001:2015 QUALITY MANAGEMENT SYSTEM | ISO 14001:2015 ENVIRONMENT MANAGEMENT SYSTEM | ISO 45001:2018 OCCUPATIONAL HEALTH & SAFETY MANAGEMENT SYSTEM"
  })
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
