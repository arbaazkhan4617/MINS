import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export type ContactQuery = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
};

export async function fetchContactQueries(token: string | null) {
  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as ContactQuery[];
  return Array.isArray(data) ? data : [];
}

export async function updateContactQueryStatus(id: number, status: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/contact/${id}/status`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error("Unable to update enquiry status.");
  }

  return (await response.json()) as ContactQuery;
}
