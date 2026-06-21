const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://3.109.216.5:8080/mins/api/";
export const API_BASE_URL = base.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const API_TUNNEL_HEADERS = {
  "bypass-tunnel-reminder": "true"
};

export function resolveApiUrl(url: string) {
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}
