import { apiRequest } from "./api";
import { getStoredAuth } from "./authService";
import { applySupabaseRealtimeAuth, isSupabaseRealtimeConfigured, supabase } from "./supabaseClient";

function getAuthHeaders() {
  const token = getStoredAuth()?.token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrap(response) {
  return response?.data || response;
}

export async function fetchChats() {
  return unwrap(
    await apiRequest("/chats", {
      headers: getAuthHeaders(),
    })
  );
}

export async function fetchMessages(chatId, options = {}) {
  const params = new URLSearchParams();

  if (options.limit) params.set("limit", options.limit);
  if (options.before) params.set("before", options.before);

  const query = params.toString();

  return unwrap(
    await apiRequest(`/chats/${chatId}/messages${query ? `?${query}` : ""}`, {
      headers: getAuthHeaders(),
    })
  );
}

export async function sendChatMessage(chatId, content) {
  return unwrap(
    await apiRequest(`/chats/${chatId}/messages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    })
  );
}

export async function markChatAsRead(chatId) {
  return unwrap(
    await apiRequest(`/chats/${chatId}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    })
  );
}

export async function findOrCreateChat(participantId) {
  return unwrap(
    await apiRequest("/chats/find-or-create", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ participantId }),
    })
  );
}

export function subscribeToChatMessages(chatId, token, onMessage) {
  if (!isSupabaseRealtimeConfigured || !supabase || !chatId || !token) {
    return null;
  }

  applySupabaseRealtimeAuth(token);

  const channel = supabase
    .channel(`eventra-chat:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => onMessage(payload.new)
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromChatMessages(channel) {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}
