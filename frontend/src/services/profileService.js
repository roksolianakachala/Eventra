import { apiRequest } from "./api";
import { getStoredAuth } from "./authService";

function getAuthHeaders() {
  const token = getStoredAuth()?.token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPublicProfiles() {
  const response = await apiRequest("/profile", {
    headers: getAuthHeaders(),
  });

  return response?.data || response;
}
