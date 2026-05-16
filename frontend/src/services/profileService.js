import { apiRequest } from "./api";
import { getValidStoredAuth } from "./authService";

function getAuthHeaders() {
  const token = getValidStoredAuth()?.token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPublicProfiles() {
  const response = await apiRequest("/profile", {
    headers: getAuthHeaders(),
  });

  return response?.data || response;
}
