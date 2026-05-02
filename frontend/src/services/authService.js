import { API_BASE_URL, apiRequest } from "./api";

const AUTH_STORAGE_KEY = "eventra_auth";

export const demoUser = {
  id: "demo-user",
  firstName: "Марія",
  lastName: "Іваненко",
  fullName: "Марія Іваненко",
  email: "maria.ivanenko@example.com",
  phone: "+380 50 123 45 67",
  city: "Львів",
  country: "Україна",
  location: "Львів, Україна",
  initials: "М",
  bio: "Люблю музику, подорожі та нові знайомства. Завжди відкрита до цікавих подій та спільнот!",
  interests: ["Музика", "Технології", "Психологія", "Подорожі", "Книги"],
  joinedAt: "12 червня 2024",
};

export function normalizeUser(user = {}) {
  const source = user && typeof user === "object" ? user : {};
  const firstName = source.firstName || source.first_name || demoUser.firstName;
  const lastName = source.lastName || source.last_name || demoUser.lastName;
  const fullName =
    source.fullName || source.name || `${firstName} ${lastName}`.trim();

  return {
    ...demoUser,
    ...source,
    firstName,
    lastName,
    fullName,
    email: source.email || demoUser.email,
    phone: source.phone || source.phoneNumber || demoUser.phone,
    city: source.city || demoUser.city,
    country: source.country || demoUser.country,
    location: source.location || `${source.city || demoUser.city}, ${source.country || demoUser.country}`,
    initials: source.initials || fullName.charAt(0).toUpperCase() || demoUser.initials,
    interests: source.interests?.length ? source.interests : demoUser.interests,
  };
}

export function getStoredAuth() {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedAuth ? JSON.parse(storedAuth) : null;
  } catch {
    return null;
  }
}

export function storeAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function normalizeAuthResponse(response) {
  const user = response?.user || response?.data?.user || response;
  const token = response?.token || response?.accessToken || response?.data?.token || null;

  return {
    token,
    user: normalizeUser(user),
  };
}

export async function login(credentials) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  return normalizeAuthResponse(response);
}

export async function register(formData) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });

  return normalizeAuthResponse(response);
}

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`;
}
