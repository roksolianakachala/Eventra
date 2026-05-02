import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Search,
  Send,
  SlidersHorizontal,
  Star,
  User,
} from "lucide-react";

import { useAuth } from "../../app/providers";
import "./MessagesPage.css";

const FILTERS = ["Усі", "Непрочитані", "Важливі"];

function createMockConversations(firstName) {
  return [
    {
      id: "oleksandr",
      name: "Олександр Іваненко",
      lastMessage: "Дякую за інтерес! Буду радий допомогти вам підготуватися до іспиту.",
      time: "10:30",
      unread: 2,
      avatar: "О",
      online: true,
      important: true,
      saved: false,
      muted: false,
      eventPath: "/events",
      subject: "Математика",
      location: "Львів, Україна",
      rating: "4.9 (128 відгуків)",
      messages: [
        {
          text: `Доброго дня, ${firstName}! Бачу ваш інтерес до мого курсу математики.`,
          time: "10:28",
          own: false,
        },
        {
          text: "Доброго дня! Мене цікавить підготовка до ЗНО з математики. Чи можемо обговорити деталі?",
          time: "10:29",
          own: true,
        },
        {
          text: "Звісно! Розкажіть, будь ласка, який у вас рівень знань та коли ви плануєте складати іспит?",
          time: "10:29",
          own: false,
        },
      ],
    },
    {
      id: "anastasiia",
      name: "Анастасія Лисенко",
      lastMessage: "Чи доступні ви наступного тижня для проведення заняття?",
      time: "Вчора",
      unread: 0,
      avatar: "А",
      online: false,
      important: false,
      saved: false,
      muted: false,
      eventPath: "/events",
      subject: "Англійська мова",
      location: "Київ, Україна",
      rating: "4.8 (94 відгуки)",
      messages: [
        { text: "Вітаю! Чи доступні ви наступного тижня для проведення заняття?", time: "Вчора", own: false },
      ],
    },
    {
      id: "dmytro",
      name: "Дмитро Коваль",
      lastMessage: "Надсилаю вам матеріали для підготовки до нашого заняття.",
      time: "2 дні тому",
      unread: 0,
      avatar: "Д",
      online: false,
      important: true,
      saved: true,
      muted: false,
      eventPath: "/events",
      subject: "Фізика",
      location: "Одеса, Україна",
      rating: "4.7 (76 відгуків)",
      messages: [
        { text: "Надсилаю вам матеріали для підготовки до нашого заняття.", time: "2 дні тому", own: false },
      ],
    },
    {
      id: "ihor",
      name: "Ігор Петренко",
      lastMessage: "Дякую за заняття! Було дуже корисно.",
      time: "3 дні тому",
      unread: 0,
      avatar: "І",
      online: false,
      important: false,
      saved: false,
      muted: true,
      subject: "Хімія",
      location: "Харків, Україна",
      rating: "4.6 (51 відгук)",
      messages: [
        { text: "Дякую за заняття! Було дуже корисно.", time: "3 дні тому", own: true },
      ],
    },
    {
      id: "support",
      name: "Служба підтримки Eventra",
      lastMessage: "Ваше повідомлення було успішно відправлено.",
      time: "5 днів тому",
      unread: 0,
      avatar: "E",
      online: true,
      important: false,
      saved: false,
      muted: false,
      support: true,
      messages: [
        { text: "Ваше повідомлення було успішно відправлено.", time: "5 днів тому", own: false },
      ],
    },
    {
      id: "sofiia",
      name: "Софія Мельник",
      lastMessage: "Можу поділитися планом підготовки після зустрічі.",
      time: "1 тиждень тому",
      unread: 1,
      avatar: "С",
      online: false,
      important: false,
      saved: false,
      muted: false,
      eventPath: "/events",
      subject: "Мистецтво",
      location: "Львів, Україна",
      rating: "4.9 (43 відгуки)",
      messages: [
        { text: "Можу поділитися планом підготовки після зустрічі.", time: "1 тиждень тому", own: false },
      ],
    },
  ];
}

function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState(() => createMockConversations(user.firstName));
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Усі");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const selectedChat = conversations.find((chat) => chat.id === selectedConversation);

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

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation.id);
    setShowActions(false);
    setConversations((current) =>
      current.map((item) => (item.id === conversation.id ? { ...item, unread: 0 } : item))
    );
  };

  const toggleSaved = () => {
    if (!selectedChat) return;
    // TODO: Persist saved chat state through the backend messaging API.
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
    // TODO: Persist muted chat state through the backend notification API.
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedChat.id
          ? { ...conversation, muted: !conversation.muted }
          : conversation
      )
    );
  };

  const sendMessage = () => {
    const text = messageText.trim();

    if (!text || !selectedChat) return;

    const nextMessage = {
      text,
      time: new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      own: true,
    };

    // TODO: Send message to the backend messaging API when it is connected.
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedChat.id
          ? {
              ...conversation,
              lastMessage: text,
              time: nextMessage.time,
              messages: [...conversation.messages, nextMessage],
            }
          : conversation
      )
    );
    setMessageText("");
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
      <h1>Повідомлення</h1>

      <div className={`messages-layout ${selectedChat ? "chat-selected" : "no-chat-selected"}`}>
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
            {visibleConversations.map((chat) => (
              <div
                className={`chat-item ${selectedConversation === chat.id ? "active" : ""}`}
                key={chat.id}
                onClick={() => selectConversation(chat)}
              >
                <div className={`chat-avatar ${chat.support ? "support" : ""}`}>{chat.avatar}</div>

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

            {visibleConversations.length === 0 && (
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
                  }}
                >
                  <ArrowLeft size={18} />
                  Назад
                </button>

                <div className="chat-person">
                  <div className={`chat-avatar ${selectedChat.support ? "support" : ""}`}>
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h3>{selectedChat.name}</h3>
                    <p>
                      <span></span> {selectedChat.online ? "Онлайн" : "Був(ла) нещодавно"}
                    </p>
                  </div>
                </div>

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
                {selectedChat.messages.map((message, index) => (
                  <div key={`${selectedChat.id}-${index}`} className={`message-bubble ${message.own ? "own" : ""}`}>
                    <p>{message.text}</p>
                    <small>{message.time}</small>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <button className="attachment-btn" type="button" onClick={() => alert("Додавання файлів буде доступне після підключення backend.")}>
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
              <div className={`profile-avatar-large ${selectedChat.support ? "support" : ""}`}>
                {selectedChat.avatar}
              </div>
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
                  <GraduationCap size={18} /> {selectedChat.subject || "Підтримка Eventra"}
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
                  onClick={() => {
                    // TODO: Connect block user action to the backend moderation API.
                    alert("Блокування користувача буде доступне після підключення backend.");
                  }}
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
