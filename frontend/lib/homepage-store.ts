import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export type HomepageContent = {
  heroHeadline: string;
  heroSubheading: string;
  heroMediaSrc: string;
  heroMediaType: "image" | "video";
  ctaTitle: string;
  stats: [string, string, string, string];
  heroSlidesJson: string;
};

type HomepageMediaUploadResponse = {
  url: string;
  type: HomepageContent["heroMediaType"];
};

export const HOMEPAGE_STORAGE_KEY = "mins-homepage-content";

export const defaultHeroMediaSrc =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85";

export const defaultHomepageContent: HomepageContent = {
  heroHeadline: "Building Trust Since 2007",
  heroSubheading:
    "ISO 9001, 14001, and 45001 certified manganese, laterite, iron ore, and ochre mining operations at Gosalpur.",
  heroMediaSrc: defaultHeroMediaSrc,
  heroMediaType: "image",
  ctaTitle: "Ready to discuss your next business requirement?",
  stats: ["2007", "39.44 HA", "3 ISOs", "100% CPCB"],
  heroSlidesJson: JSON.stringify([
    {
      mediaSrc: defaultHeroMediaSrc,
      mediaType: "image",
      headline: "Building Trust Since 2007",
      subheading: "ISO 9001, 14001, and 45001 certified manganese, laterite, iron ore, and ochre mining operations at Gosalpur.",
      badge: "PROFESSIONAL. TRUSTED. ESTABLISHED.",
      exploreBtnText: "Explore Work",
      exploreBtnLink: "/work",
      contactBtnText: "Contact Us",
      contactBtnLink: "/contact"
    }
  ])
};

export function loadHomepageContent(): HomepageContent {
  if (typeof window === "undefined") {
    return defaultHomepageContent;
  }

  const saved = window.localStorage.getItem(HOMEPAGE_STORAGE_KEY);
  if (!saved) {
    return defaultHomepageContent;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<HomepageContent>;
    const heroMediaType: HomepageContent["heroMediaType"] =
      parsed.heroMediaType === "video" ? "video" : "image";

    return {
      ...defaultHomepageContent,
      ...parsed,
      heroMediaType,
      heroMediaSrc: parsed.heroMediaSrc || defaultHomepageContent.heroMediaSrc,
      heroSlidesJson: parsed.heroSlidesJson || defaultHomepageContent.heroSlidesJson,
      stats:
        Array.isArray(parsed.stats) && parsed.stats.length === 4
          ? (parsed.stats as HomepageContent["stats"])
          : defaultHomepageContent.stats
    };
  } catch {
    window.localStorage.removeItem(HOMEPAGE_STORAGE_KEY);
    return defaultHomepageContent;
  }
}

export function saveHomepageContent(content: HomepageContent) {
  window.localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event("mins-homepage-content-updated"));
}

export async function fetchHomepageContent(): Promise<HomepageContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/homepage-content`, {
      headers: API_TUNNEL_HEADERS
    });

    if (!response.ok) {
      return loadHomepageContent();
    }

    return normalizeHomepageContent((await response.json()) as Partial<HomepageContent>);
  } catch {
    return loadHomepageContent();
  }
}

export async function persistHomepageContent(content: HomepageContent, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/homepage-content`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(content)
  });

  if (!response.ok) {
    throw new Error("Unable to save homepage content to database.");
  }

  const savedContent = normalizeHomepageContent((await response.json()) as Partial<HomepageContent>);
  saveHomepageContent(savedContent);
  return savedContent;
}

export async function uploadHomepageMedia(file: File, token: string): Promise<HomepageMediaUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/homepage-content/media`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Unable to upload hero media.");
  }

  return (await response.json()) as HomepageMediaUploadResponse;
}

function normalizeHomepageContent(content: Partial<HomepageContent>): HomepageContent {
  const heroMediaType: HomepageContent["heroMediaType"] =
    content.heroMediaType === "video" ? "video" : "image";

  return {
    ...defaultHomepageContent,
    ...content,
    heroMediaType,
    heroMediaSrc: content.heroMediaSrc || defaultHomepageContent.heroMediaSrc,
    heroSlidesJson: content.heroSlidesJson || defaultHomepageContent.heroSlidesJson,
    stats:
      Array.isArray(content.stats) && content.stats.length === 4
        ? (content.stats as HomepageContent["stats"])
        : defaultHomepageContent.stats
  };
}
