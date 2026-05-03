const DEFAULT_API_BASE_URL = "https://eventra-j1tj.onrender.com/api";

// https://eventra-j1tj.onrender.com/api
// = "http://localhost:5000/api"

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}
