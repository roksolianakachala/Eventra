const PRODUCTION_API_BASE_URL = "https://eventra-j1tj.onrender.com/api";
const LOCAL_API_BASE_URL = "http://localhost:5000/api";

function getDefaultApiBaseUrl() {
  if (typeof window !== "undefined") {
    const localHosts = ["localhost", "127.0.0.1"];

    if (localHosts.includes(window.location.hostname)) {
      return LOCAL_API_BASE_URL;
    }
  }

  return PRODUCTION_API_BASE_URL;
}

export const API_BASE_URL = (process.env.REACT_APP_API_URL || getDefaultApiBaseUrl()).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const { headers, ...requestOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
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
