import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export type MediaItem = {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  type: "Image" | "Video" | string;
  url: string;
  uploadedAt: string;
};

export type MediaInput = {
  title: string;
  category: string;
  subCategory: string;
  type: "Image" | "Video";
  url: string;
};

export type MediaCategory = {
  id: number;
  name: string;
  active: boolean;
};

export type MediaSubCategory = {
  id: number;
  category: string;
  name: string;
  active: boolean;
};

export async function fetchMediaItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media`, {
      headers: API_TUNNEL_HEADERS
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as MediaItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createMediaUrl(input: MediaInput, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/media/url`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to save media URL.");
  }

  return (await response.json()) as MediaItem;
}

export async function updateMediaItem(
  id: number,
  input: Pick<MediaInput, "title" | "category" | "subCategory">,
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to update media.");
  }

  return (await response.json()) as MediaItem;
}

export async function deleteMediaItem(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, {
    method: "DELETE",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Unable to delete media.");
  }
}

export async function fetchMediaCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media/categories`, {
      headers: API_TUNNEL_HEADERS
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as MediaCategory[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createMediaCategory(
  input: Pick<MediaCategory, "name" | "active">,
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/media/categories`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to create category.");
  }

  return (await response.json()) as MediaCategory;
}

export async function updateMediaCategory(
  id: number,
  input: Pick<MediaCategory, "name" | "active">,
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/media/categories/${id}`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to update category.");
  }

  return (await response.json()) as MediaCategory;
}

export async function fetchMediaSubCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media/subcategories`, {
      headers: API_TUNNEL_HEADERS
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as MediaSubCategory[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createMediaSubCategory(
  input: Pick<MediaSubCategory, "category" | "name" | "active">,
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/media/subcategories`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to create subcategory.");
  }

  return (await response.json()) as MediaSubCategory;
}

export async function updateMediaSubCategory(
  id: number,
  input: Pick<MediaSubCategory, "category" | "name" | "active">,
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/media/subcategories/${id}`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to update subcategory.");
  }

  return (await response.json()) as MediaSubCategory;
}
