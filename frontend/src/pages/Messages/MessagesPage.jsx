import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ban,
  Bell,
  BellOff,
  Bookmark,
  CalendarDays,
  GraduationCap,
  MapPin,
  MoreHorizontal,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  User,
} from "lucide-react";

import { useAuth } from "../../app/providers";
import {
  fetchChats,
  fetchMessages,
  markChatAsRead,
  sendChatMessage,
  subscribeToChatMessages,
  unsubscribeFromChatMessages,
} from "../../services/chatService";
import "./MessagesPage.css";

const FILTERS = ["Усі", "Непрочитані", "Важливі"];

function formatMessageFromRealtime(message, currentUserId) {
  const createdAt = message.created_at || new Date().toISOString();

  return {
    id: message.id,
    chatId: message.chat_id,
    senderId: message.sender_id,
    content: message.content,
    text: message.content,
    createdAt,
    time: new Intl.DateTimeFormat("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(createdAt)),
    own: message.sender_id === currentUserId,
  };
}

function addMessageOnce(messages, nextMessage) {
  if (messages.some((message) => message.id === nextMessage.id)) {
    return messages;
  }

  return [...messages, nextMessage];
}

function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Усі");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [mobileView, setMobileView] = useState("list");
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedChat = conversations.find((chat) => chat.id === selectedConversation);

  const loadChats = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setConversations([]);
      setErrorMessage("Увійдіть в акаунт, щоб переглянути повідомлення.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const chats = await fetchChats();
      setConversations(
        chats.map((chat) => ({
          ...chat,
          messages: [],
        }))
      );
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося завантажити чати.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (!selectedConversation || !token) return undefined;

    const channel = subscribeToChatMessages(selectedConversation, token, (message) => {
      const nextMessage = formatMessageFromRealtime(message, user.id);

      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== nextMessage.chatId) return conversation;

          return {
            ...conversation,
            lastMessage: nextMessage.text,
            time: nextMessage.time,
            unread: selectedConversation === conversation.id ? 0 : conversation.unread + 1,
            messages: addMessageOnce(conversation.messages || [], nextMessage),
          };
        })
      );
    });

    return () => unsubscribeFromChatMessages(channel);
  }, [selectedConversation, token, user.id]);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        !normalizedQuery ||
        conversation.name.toLowerCase().includes(normalizedQuery) ||
        conversation.lastMessage.toLowerCase().includes(normalizedQuery);

      const matchesFilter =
        activeFilter === "Усі" ||
        (activeFilter === "Непрочитані" && conversation.unread > 0) ||
        (activeFilter === "Важливі" && conversation.important);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, conversations, searchQuery]);

  const visibleConversations = filteredConversations.slice(0, visibleCount);

  const selectConversation = useCallback(async (conversation) => {
    setSelectedConversation(conversation.id);
    setShowActions(false);
    setMobileView("chat");
    setErrorMessage("");
    setConversations((current) =>
      current.map((item) => (item.id === conversation.id ? { ...item, unread: 0 } : item))
    );

    try {
      setIsMessagesLoading(true);
      const messages = await fetchMessages(conversation.id);

      setConversations((current) =>
        current.map((item) =>
          item.id === conversation.id
            ? {
                ...item,
                messages,
                unread: 0,
                lastMessage: messages[messages.length - 1]?.text || item.lastMessage,
                time: messages[messages.length - 1]?.time || item.time,
              }
            : item
        )
      );

      await markChatAsRead(conversation.id);
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося завантажити повідомлення.");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    const chatId = location.state?.chatId;

    if (!chatId || conversations.length === 0 || selectedConversation === chatId) return;

    const chat = conversations.find((conversation) => conversation.id === chatId);

    if (chat) {
      selectConversation(chat);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [conversations, location.pathname, location.state, navigate, selectConversation, selectedConversation]);

  const toggleSaved = () => {
    if (!selectedChat) return;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedChat.id
          ? { ...conversation, saved: !conversation.saved }
          : conversation
      )
    );
  };

  const toggleMuted = () => {
    if (!selectedChat) return;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedChat.id
          ? { ...conversation, muted: !conversation.muted }
          : conversation
      )
    );
  };

  const sendMessage = async () => {
    const text = messageText.trim();

    if (!text || !selectedChat) return;

    try {
      setMessageText("");
      const nextMessage = await sendChatMessage(selectedChat.id, text);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selectedChat.id
            ? {
                ...conversation,
                lastMessage: nextMessage.text,
                time: nextMessage.time,
                messages: addMessageOnce(conversation.messages || [], nextMessage),
              }
            : conversation
        )
      );
    } catch (error) {
      setMessageText(text);
      setErrorMessage(error.message || "Не вдалося надіслати повідомлення.");
    }
  };

  const handleMessageKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((current) => Math.min(current + 3, filteredConversations.length));
  };

  const handleFilterClick = () => {
    setShowFilters((current) => !current);
  };

  return (
    <div className="messages-page">
      <div className="messages-title-row">
        <h1>Повідомлення</h1>
        <button type="button" onClick={loadChats} disabled={isLoading} aria-label="Оновити чати">
          <RefreshCw size={18} />
        </button>
      </div>

      {errorMessage && <p className="messages-error">{errorMessage}</p>}

      <div
        className={`messages-layout ${selectedChat ? "chat-selected" : "no-chat-selected"} mobile-view-${mobileView}`}
      >
        <aside className="chat-list-panel">
          <div className="chat-search">
            <Search size={18} />
            <input
              placeholder="Пошук повідомлень"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button className="filter-toggle" type="button" onClick={handleFilterClick} aria-label="Фільтри">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {showFilters && (
            <div className="filter-dropdown">
              {FILTERS.map((filter) => (
                <button
                  className={activeFilter === filter ? "active" : ""}
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter);
                    setShowFilters(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="chat-tabs">
            {FILTERS.map((tab) => (
              <button
                className={activeFilter === tab ? "active" : ""}
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="chat-list">
            {isLoading && <p className="chat-list-empty">Завантаження чатів...</p>}

            {!isLoading &&
              visibleConversations.map((chat) => (
                <div
                  className={`chat-item ${selectedConversation === chat.id ? "active" : ""}`}
                  key={chat.id}
                  onClick={() => selectConversation(chat)}
                >
                  {chat.avatarUrl ? (
                    <img className="chat-avatar" src={chat.avatarUrl} alt={chat.name} />
                  ) : (
                    <div className={`chat-avatar ${chat.support ? "support" : ""}`}>{chat.avatar}</div>
                  )}

                  <div className="chat-info">
                    <div className="chat-top">
                      <h3>{chat.name}</h3>
                      <span>{chat.time}</span>
                    </div>

                    <p>{chat.lastMessage}</p>
                  </div>

                  {chat.unread > 0 && <b className="unread-count">{chat.unread}</b>}
                </div>
              ))}

            {!isLoading && visibleConversations.length === 0 && (
              <p className="chat-list-empty">Чати не знайдено</p>
            )}
          </div>

          {visibleCount < filteredConversations.length && (
            <button className="show-more-btn" type="button" onClick={handleLoadMore}>
              Показати більше
            </button>
          )}
        </aside>

        {selectedChat ? (
          <>
            <section className="chat-window">
              <div className="chat-window-header">
                <button
                  className="chat-back-btn"
                  type="button"
                  onClick={() => {
                    setSelectedConversation(null);
                    setShowActions(false);
                    setMobileView("list");
                  }}
                >
                  <ArrowLeft size={18} />
                  Назад
                </button>

                <button className="chat-person chat-person-trigger" type="button" onClick={() => setMobileView("profile")}>
                  {selectedChat.avatarUrl ? (
                    <img className="chat-avatar" src={selectedChat.avatarUrl} alt={selectedChat.name} />
                  ) : (
                    <div className={`chat-avatar ${selectedChat.support ? "support" : ""}`}>
                      {selectedChat.avatar}
                    </div>
                  )}
                  <div>
                    <h3>{selectedChat.name}</h3>
                    <p>
                      <span></span> {selectedChat.online ? "Онлайн" : "Був(ла) нещодавно"}
                    </p>
                  </div>
                </button>

                <div className="chat-menu-wrap">
                  <button
                    className="chat-menu-btn"
                    type="button"
                    onClick={() => setShowActions((current) => !current)}
                    aria-label="Дії чату"
                  >
                    <MoreHorizontal />
                  </button>

                  {showActions && (
                    <div className="chat-actions-dropdown">
                      <button type="button" onClick={toggleSaved}>
                        {selectedChat.saved ? "Прибрати зі збережених" : "Зберегти чат"}
                      </button>
                      <button type="button" onClick={toggleMuted}>
                        {selectedChat.muted ? "Увімкнути сповіщення" : "Вимкнути сповіщення"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-date">
                <span></span>
                Сьогодні
                <span></span>
              </div>

              <div className="messages-list">
                {isMessagesLoading && <p className="chat-list-empty">Завантаження повідомлень...</p>}

                {!isMessagesLoading &&
                  selectedChat.messages.map((message) => (
                    <div key={message.id} className={`message-bubble ${message.own ? "own" : ""}`}>
                      <p>{message.text}</p>
                      <small>{message.time}</small>
                    </div>
                  ))}

                {!isMessagesLoading && selectedChat.messages.length === 0 && (
                  <p className="chat-list-empty">Напишіть перше повідомлення</p>
                )}
              </div>

              <div className="message-input">
                <button className="attachment-btn" type="button" onClick={() => alert("Додавання файлів буде доступне пізніше.")}>
                  <Paperclip size={20} />
                </button>
                <input
                  placeholder="Напишіть повідомлення..."
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={handleMessageKeyDown}
                />
                <button type="button" onClick={sendMessage} disabled={!messageText.trim()}>
                  <Send size={20} />
                </button>
              </div>
            </section>

            <aside className="chat-profile-panel">
              <button className="profile-back-btn" type="button" onClick={() => setMobileView("chat")}>
                <ArrowLeft size={18} />
                Назад
              </button>

              {selectedChat.avatarUrl ? (
                <img className="profile-avatar-large" src={selectedChat.avatarUrl} alt={selectedChat.name} />
              ) : (
                <div className={`profile-avatar-large ${selectedChat.support ? "support" : ""}`}>
                  {selectedChat.avatar}
                </div>
              )}
              <h2>{selectedChat.name}</h2>
              <p className="online-dot">{selectedChat.online ? "Онлайн" : "Не в мережі"}</p>

              <div className="profile-actions-chat">
                <button type="button" onClick={() => navigate("/profile")}>
                  <User size={20} />
                  Профіль
                </button>
                <button
                  type="button"
                  onClick={() => (selectedChat.eventPath ? navigate(selectedChat.eventPath) : navigate("/events"))}
                >
                  <CalendarDays size={20} />
                  Подія
                </button>
                <button type="button" onClick={toggleSaved}>
                  <Bookmark size={20} />
                  {selectedChat.saved ? "Збережено" : "Зберегти"}
                </button>
              </div>

              <div className="about-tutor">
                <h3>Про співрозмовника</h3>
                <p>
                  <GraduationCap size={18} /> {selectedChat.subject || "Співрозмовник Eventra"}
                </p>
                <p>
                  <MapPin size={18} /> {selectedChat.location || "Онлайн"}
                </p>
                {selectedChat.rating && (
                  <p>
                    <Star size={18} /> {selectedChat.rating}
                  </p>
                )}
              </div>

              <div className="media-block">
                <h3>Медіа, файли та посилання</h3>

                <div className="media-grid">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>+12</div>
                </div>
              </div>

              <div className="chat-settings">
                <button type="button" onClick={toggleMuted}>
                  {selectedChat.muted ? <Bell size={18} /> : <BellOff size={18} />}
                  {selectedChat.muted ? "Увімкнути сповіщення" : "Вимкнути сповіщення"}
                </button>

                <button
                  className="danger"
                  type="button"
                  onClick={() => alert("Блокування користувача буде доступне після підключення модерації.")}
                >
                  <Ban size={18} />
                  Заблокувати користувача
                </button>
              </div>
            </aside>
          </>
        ) : (
          <section className="chat-window empty-chat-state">
            <div>
              <User size={38} />
              <p>Оберіть чат, щоб почати спілкування</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
