import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export type ClientProfile = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  photoUrl: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ClientProfileInput = Omit<ClientProfile, "id" | "createdAt" | "updatedAt">;

export async function fetchClients() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      headers: API_TUNNEL_HEADERS
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ClientProfile[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveClient(
  client: ClientProfileInput,
  token: string,
  id?: number
) {
  const response = await fetch(`${API_BASE_URL}/api/clients${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(client)
  });

  if (!response.ok) {
    throw new Error("Unable to save client.");
  }

  return (await response.json()) as ClientProfile;
}

export async function deleteClient(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
    method: "DELETE",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Unable to delete client.");
  }
}

export async function uploadClientPhoto(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/clients/photos`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Unable to upload client photo.");
  }

  return (await response.json()) as { url: string };
}
