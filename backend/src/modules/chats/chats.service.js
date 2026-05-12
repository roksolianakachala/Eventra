const { supabaseAdmin } = require("../../config/db.config");

function assertSupabaseResult(result) {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

function getFullName(profile = {}, fallback = "Користувач Eventra") {
  return (
    profile.full_name ||
    profile.name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    profile.email ||
    fallback
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatTime(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeMessage(message, currentUserId) {
  return {
    id: message.id,
    chatId: message.chat_id,
    senderId: message.sender_id,
    content: message.content,
    text: message.content,
    createdAt: message.created_at,
    time: formatTime(message.created_at),
    own: message.sender_id === currentUserId,
  };
}

async function getProfilesByIds(userIds) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];

  if (!uniqueIds.length) return new Map();

  const profiles = assertSupabaseResult(
    await supabaseAdmin.from("profiles").select("*").in("id", uniqueIds)
  );

  return new Map(profiles.map((profile) => [profile.id, profile]));
}

async function ensureParticipant(chatId, userId) {
  const participant = assertSupabaseResult(
    await supabaseAdmin
      .from("chat_participants")
      .select("*")
      .eq("chat_id", chatId)
      .eq("user_id", userId)
      .maybeSingle()
  );

  if (!participant) {
    const error = new Error("Ви не маєте доступу до цього чату");
    error.status = 403;
    throw error;
  }

  return participant;
}

async function getChats(userId) {
  const ownParticipants = assertSupabaseResult(
    await supabaseAdmin.from("chat_participants").select("*").eq("user_id", userId)
  );

  const chatIds = ownParticipants.map((participant) => participant.chat_id);

  if (!chatIds.length) return [];

  const [chats, allParticipants, latestMessages] = await Promise.all([
    supabaseAdmin.from("chats").select("*").in("id", chatIds),
    supabaseAdmin.from("chat_participants").select("*").in("chat_id", chatIds),
    supabaseAdmin
      .from("messages")
      .select("*")
      .in("chat_id", chatIds)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const chatRows = assertSupabaseResult(chats);
  const participantRows = assertSupabaseResult(allParticipants);
  const messageRows = assertSupabaseResult(latestMessages);
  const profiles = await getProfilesByIds(participantRows.map((participant) => participant.user_id));
  const ownParticipantByChat = new Map(
    ownParticipants.map((participant) => [participant.chat_id, participant])
  );
  const latestMessageByChat = new Map();

  messageRows.forEach((message) => {
    if (!latestMessageByChat.has(message.chat_id)) {
      latestMessageByChat.set(message.chat_id, message);
    }
  });

  const unreadByChat = new Map();

  messageRows.forEach((message) => {
    const participant = ownParticipantByChat.get(message.chat_id);
    const lastReadAt = participant?.last_read_at ? new Date(participant.last_read_at) : null;
    const isUnread =
      message.sender_id !== userId &&
      (!lastReadAt || new Date(message.created_at) > lastReadAt);

    if (isUnread) {
      unreadByChat.set(message.chat_id, (unreadByChat.get(message.chat_id) || 0) + 1);
    }
  });

  return chatRows
    .map((chat) => {
      const participants = participantRows.filter((participant) => participant.chat_id === chat.id);
      const otherParticipant =
        participants.find((participant) => participant.user_id !== userId) || participants[0];
      const profile = profiles.get(otherParticipant?.user_id) || {};
      const name = getFullName(profile);
      const latestMessage = latestMessageByChat.get(chat.id);
      const ownParticipant = ownParticipantByChat.get(chat.id) || {};

      return {
        id: chat.id,
        name,
        avatar: getInitials(name) || "E",
        avatarUrl: profile.avatar_url || profile.avatarUrl || "",
        lastMessage: latestMessage?.content || "Поки немає повідомлень",
        time: latestMessage ? formatTime(latestMessage.created_at) : formatTime(chat.created_at),
        latestMessageAt: latestMessage?.created_at || chat.updated_at || chat.created_at,
        unread: unreadByChat.get(chat.id) || 0,
        important: Boolean(ownParticipant.important || ownParticipant.is_important),
        saved: Boolean(ownParticipant.saved || ownParticipant.is_saved),
        muted: Boolean(ownParticipant.muted || ownParticipant.is_muted),
        online: false,
        participantId: otherParticipant?.user_id,
        subject: profile.subject || profile.specialization || "Співрозмовник Eventra",
        location: profile.location || [profile.city, profile.country].filter(Boolean).join(", ") || "Онлайн",
        rating: profile.rating ? `${profile.rating}` : "",
      };
    })
    .sort((first, second) => new Date(second.latestMessageAt || 0) - new Date(first.latestMessageAt || 0));
}

async function getMessages(userId, chatId, options = {}) {
  await ensureParticipant(chatId, userId);

  const limit = Math.min(Number(options.limit) || 50, 100);
  let query = supabaseAdmin
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options.before) {
    query = query.lt("created_at", options.before);
  }

  const messages = assertSupabaseResult(await query);

  return messages.reverse().map((message) => normalizeMessage(message, userId));
}

async function sendMessage(userId, chatId, content) {
  await ensureParticipant(chatId, userId);

  const text = String(content || "").trim();

  if (!text) {
    const error = new Error("Повідомлення не може бути порожнім");
    error.status = 400;
    throw error;
  }

  const message = assertSupabaseResult(
    await supabaseAdmin
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: userId,
        content: text,
      })
      .select("*")
      .single()
  );

  await supabaseAdmin.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);

  return normalizeMessage(message, userId);
}

async function markAsRead(userId, chatId) {
  await ensureParticipant(chatId, userId);

  const { error } = await supabaseAdmin
    .from("chat_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("chat_id", chatId)
    .eq("user_id", userId);

  if (error && !error.message.includes("last_read_at")) {
    throw new Error(error.message);
  }

  return { success: true };
}

async function findOrCreateChat(userId, participantId) {
  if (!participantId || participantId === userId) {
    const error = new Error("Оберіть іншого користувача для чату");
    error.status = 400;
    throw error;
  }

  const [currentUserParticipants, otherUserParticipants] = await Promise.all([
    supabaseAdmin.from("chat_participants").select("chat_id").eq("user_id", userId),
    supabaseAdmin.from("chat_participants").select("chat_id").eq("user_id", participantId),
  ]);

  const currentRows = assertSupabaseResult(currentUserParticipants);
  const otherChatIds = new Set(assertSupabaseResult(otherUserParticipants).map((row) => row.chat_id));
  const existingChat = currentRows.find((row) => otherChatIds.has(row.chat_id));

  if (existingChat) {
    return { id: existingChat.chat_id, created: false };
  }

  let chatResult = await supabaseAdmin.from("chats").insert({ type: "direct" }).select("*").single();

  if (chatResult.error && chatResult.error.message.includes("type")) {
    chatResult = await supabaseAdmin.from("chats").insert({}).select("*").single();
  }

  const chat = assertSupabaseResult(chatResult);

  assertSupabaseResult(
    await supabaseAdmin
      .from("chat_participants")
      .upsert(
        [
          { chat_id: chat.id, user_id: userId },
          { chat_id: chat.id, user_id: participantId },
        ],
        { onConflict: "chat_id,user_id", ignoreDuplicates: true }
      )
  );

  return { id: chat.id, created: true };
}

module.exports = {
  findOrCreateChat,
  getChats,
  getMessages,
  markAsRead,
  normalizeMessage,
  sendMessage,
};
