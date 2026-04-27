import { GraduationCap, Search, SlidersHorizontal, Send, Paperclip, MoreHorizontal, User, CalendarDays, Bookmark, Star, MapPin, BellOff, Ban,} from "lucide-react";

import "./MessagesPage.css";
import { MessageSquare } from "lucide-react";

function MessagesPage() {
  const chats = [
    {
      name: "Олександр Іваненко",
      message: "Дякую за інтерес! Буду радий допомогти вам підготуватися до іспиту.",
      time: "10:30",
      active: true,
      unread: 2,
      avatar: "О",
    },
    {
      name: "Анастасія Лисенко",
      message: "Чи доступні ви наступного тижня для проведення заняття?",
      time: "Вчора",
      avatar: "А",
    },
    {
      name: "Дмитро Коваль",
      message: "Надсилаю вам матеріали для підготовки до нашого заняття.",
      time: "2 дні тому",
      avatar: "Д",
    },
    {
      name: "Ігор Петренко",
      message: "Дякую за заняття! Було дуже корисно.",
      time: "3 дні тому",
      avatar: "І",
    },
    {
      name: "Служба підтримки Eventra",
      message: "Ваше повідомлення було успішно відправлено.",
      time: "5 днів тому",
      avatar: "E",
      support: true,
    },
  ];

  const messages = [
    {
      text: "Доброго дня, Маріє! Бачу ваш інтерес до мого курсу математики.",
      time: "10:28",
      own: false,
    },
    {
      text: "Доброго дня! Мене цікавить підготовка до ЗНО з математики. Чи можемо обговорити деталі?",
      time: "10:29",
      own: true,
    },
    {
      text: "Звісно! Я можу допомогти вам підготуватися до ЗНО. Розкажіть, будь ласка, який у вас рівень знань та коли ви плануєте складати іспит?",
      time: "10:29",
      own: false,
    },
    {
      text: "Мій рівень — середній. Планую складати наступного року. Хочу покращити знання з алгебри та геометрії.",
      time: "10:30",
      own: true,
    },
    {
      text: "Чудово! Я підготую індивідуальну програму для вас. Можу запропонувати заняття двічі на тиждень.",
      time: "10:30",
      own: false,
    },
  ];

  return (
    <div className="messages-page">
      <h1>Повідомлення</h1>

      <div className="messages-layout">
        <aside className="chat-list-panel">
          <div className="chat-search">
            <Search size={18} />
            <input placeholder="Пошук повідомлень" />
            <SlidersHorizontal size={18} />
          </div>

          <div className="chat-tabs">
            <button className="active">Усі</button>
            <button>Непрочитані</button>
            <button>Важливі</button>
          </div>

          <div className="chat-list">
            {chats.map((chat) => (
              <div
                className={`chat-item ${chat.active ? "active" : ""}`}
                key={chat.name}
              >
                <div className={`chat-avatar ${chat.support ? "support" : ""}`}>
                  {chat.avatar}
                </div>

                <div className="chat-info">
                  <div className="chat-top">
                    <h3>{chat.name}</h3>
                    <span>{chat.time}</span>
                  </div>

                  <p>{chat.message}</p>
                </div>

                {chat.unread && <b className="unread-count">{chat.unread}</b>}
              </div>
            ))}
          </div>

          <button className="show-more-btn">Показати більше</button>
        </aside>

        <section className="chat-window">
          <div className="chat-window-header">
            <div className="chat-person">
              <div className="chat-avatar">О</div>
              <div>
                <h3>Олександр Іваненко</h3>
                <p>
                  <span></span> Онлайн
                </p>
              </div>
            </div>

            <MoreHorizontal />
          </div>

          <div className="chat-date">
            <span></span>
            Сьогодні
            <span></span>
          </div>

          <div className="messages-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${message.own ? "own" : ""}`}
              >
                <p>{message.text}</p>
                <small>{message.time}</small>
              </div>
            ))}
          </div>

          <div className="unread-divider">
            <span></span>
            Непрочитані повідомлення
            <span></span>
          </div>

          <div className="message-input">
            <Paperclip size={20} />
            <input placeholder="Напишіть повідомлення..." />
            <button>
              <Send size={20} />
            </button>
          </div>
        </section>

        <aside className="chat-profile-panel">
          <div className="profile-avatar-large">О</div>
          <h2>Олександр Іваненко</h2>
          <p className="online-dot">Онлайн</p>

          <div className="profile-actions-chat">
            <button>
              <User size={20} />
              Профіль
            </button>
            <button>
              <CalendarDays size={20} />
              Подія
            </button>
            <button>
              <Bookmark size={20} />
              Зберегти
            </button>
          </div>

          <div className="about-tutor">
            <h3>Про репетитора</h3>
            <p>
              <GraduationIcon /> Математика
            </p>
            <p>
              <MapPin size={18} /> Львів, Україна
            </p>
            <p>
              <Star size={18} /> 4.9 (128 відгуків)
            </p>
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
            <button>
              <BellOff size={18} />
              Вимкнути сповіщення
            </button>

            <button className="danger">
              <Ban size={18} />
              Заблокувати користувача
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function GraduationIcon() {
  return <GraduationCap size={16} className="icon" />;
}
export default MessagesPage;