import { API_BASE_URL, API_TUNNEL_HEADERS } from "@/lib/api";

export async function updateAdminPassword(
  input: { currentPassword: string; newPassword: string },
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/api/auth/password`, {
    method: "PUT",
    headers: {
      ...API_TUNNEL_HEADERS,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Unable to update password. Check the current password and try again.");
  }
}
