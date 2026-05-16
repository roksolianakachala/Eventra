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
  const metadata = source.user_metadata || source.raw_user_meta_data || {};
  const hasRealIdentity = Boolean(source.id || source.user_id || source.email);
  const isDemoUser = !hasRealIdentity || source.id === demoUser.id;
  const avatarUrl =
    source.avatarUrl ||
    source.avatar_url ||
    source.picture ||
    metadata.avatarUrl ||
    metadata.avatar_url ||
    metadata.picture ||
    "";
  const firstName =
    source.firstName ||
    source.first_name ||
    metadata.firstName ||
    metadata.first_name ||
    metadata.given_name ||
    "";
  const lastName =
    source.lastName ||
    source.last_name ||
    metadata.lastName ||
    metadata.last_name ||
    metadata.family_name ||
    "";
  const fullName =
    source.fullName ||
    source.name ||
    metadata.full_name ||
    metadata.name ||
    `${firstName} ${lastName}`.trim() ||
    source.email?.split("@")[0] ||
    "";
  const isOldDemoValue = (value, demoValue) => !isDemoUser && value === demoValue;
  const nameParts = fullName.split(" ").filter(Boolean);
  const normalizedFirstName = isOldDemoValue(firstName, demoUser.firstName)
    ? nameParts[0] || ""
    : firstName;
  const normalizedLastName = isOldDemoValue(lastName, demoUser.lastName)
    ? nameParts.slice(1).join(" ")
    : lastName;
  const city = isOldDemoValue(source.city, demoUser.city) ? "" : source.city || "";
  const country = isOldDemoValue(source.country, demoUser.country) ? "" : source.country || "";
  const location = isOldDemoValue(source.location, demoUser.location)
    ? ""
    : source.location || [city, country].filter(Boolean).join(", ");
  const sourceInterests = Array.isArray(source.interests) ? source.interests : [];
  const interests = isOldDemoValue(sourceInterests.join("|"), demoUser.interests.join("|"))
    ? []
    : sourceInterests.length
      ? sourceInterests
      : [];

  return {
    ...source,
    ...(isDemoUser ? demoUser : {}),
    id: source.id || source.user_id || demoUser.id,
    firstName: normalizedFirstName,
    lastName: normalizedLastName,
    fullName,
    email: source.email || "",
    avatarUrl,
    phone: isOldDemoValue(source.phone || source.phoneNumber, demoUser.phone) ? "" : source.phone || source.phoneNumber || "",
    city,
    country,
    location,
    initials: source.initials || fullName.charAt(0).toUpperCase() || "",
    bio: isOldDemoValue(source.bio, demoUser.bio) ? "" : source.bio || "",
    interests,
    joinedAt: isOldDemoValue(source.joinedAt, demoUser.joinedAt) ? "" : source.joinedAt || source.created_at || "",
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

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
}

export function getUserFromJwtToken(token) {
  try {
    const payload = getJwtPayload(token);
    return normalizeUser({
      id: payload.sub,
      email: payload.email,
      avatar_url: payload.avatar_url || payload.picture,
      user_metadata: payload.user_metadata,
    });
  } catch {
    return null;
  }
}

export function getJwtPayload(token) {
  return JSON.parse(decodeBase64Url(token.split(".")[1] || ""));
}

export function getTokenExpiresAt(token) {
  const payload = getJwtPayload(token);
  return Number(payload.exp || 0) * 1000;
}

export function isTokenExpired(token, skewSeconds = 30) {
  if (!token) return true;

  try {
    const expiresAt = getTokenExpiresAt(token);
    return !expiresAt || expiresAt <= Date.now() + skewSeconds * 1000;
  } catch {
    return true;
  }
}

export function getValidStoredAuth() {
  const storedAuth = getStoredAuth();

  if (storedAuth?.token && isTokenExpired(storedAuth.token)) {
    clearStoredAuth();
    return null;
  }

  return storedAuth;
}

export function isExpiredJwtError(message = "") {
  return /token is expired|jwt.*expired|invalid jwt/i.test(String(message));
}

function normalizeAuthResponse(response) {
  const session = response?.session || response?.data?.session || null;
  const user =
    response?.user ||
    response?.data?.user ||
    session?.user ||
    response?.data?.session?.user ||
    response;
  const token =
    response?.token ||
    response?.accessToken ||
    response?.access_token ||
    response?.data?.token ||
    session?.access_token ||
    null;
  const normalizedUser = normalizeUser(user);

  return {
    token,
    refreshToken: response?.refreshToken || response?.refresh_token || session?.refresh_token || null,
    expiresAt: session?.expires_at || null,
    user: normalizedUser,
    isAuthenticated: Boolean(token || normalizedUser.id !== demoUser.id),
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

export async function getUserFromToken(token) {
  const response = await apiRequest("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizeUser(response?.user || response);
}

export function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    frontend_url: window.location.origin,
  });

  return `${API_BASE_URL}/auth/google?${params.toString()}`;
}


export function logout() {
  clearStoredAuth();
}
