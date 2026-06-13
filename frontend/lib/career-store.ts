import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export type CareerApplication = {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resumeUrl: string;
  status: string;
  createdAt: string;
};

export async function submitCareerApplication(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/careers`, {
    method: "POST",
    headers: {
      ...API_TUNNEL_HEADERS
      // Note: We do NOT set Content-Type header so the browser sets the boundary automatically for multipart/form-data.
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Unable to submit application. Please try again.");
  }

  return (await response.json()) as CareerApplication;
}

export async function fetchCareerApplications(token: string | null) {
  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/api/careers`, {
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as CareerApplication[];
  return Array.isArray(data) ? data : [];
}

export async function updateCareerApplicationStatus(id: number, status: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/careers/${id}/status`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error("Unable to update application status.");
  }

  return (await response.json()) as CareerApplication;
}
