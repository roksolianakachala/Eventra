import "./ProfilePage.css";
import { Shield, MapPin, Mail, Phone, CalendarDays } from "lucide-react";
function ProfilePage() {
  const interests = ["Музика", "Технології", "Психологія", "Подорожі", "Книги"];

  const menuItems = [
    "Особисті дані",
    "Безпека",
    "Сповіщення",
    "Конфіденційність",
    "Підписка",
    "Платіжні дані",
    "Підключені акаунти",
    "Мої відгуки",
  ];

  return (
    <div className="profile-page">
      <div className="profile-title">
        <h1>Обліковий запис</h1>
        <p>Керуйте своїм профілем та налаштуваннями облікового запису</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-menu">
          {menuItems.map((item, index) => (
            <button key={item} className={index === 0 ? "active" : ""}>
              {item}
            </button>
          ))}
        </aside>

        <section className="profile-main">
          <h2>Особисті дані</h2>

          <div className="profile-user">
            <div className="profile-avatar">М</div>

            <div>
              <h3>Марія Іваненко</h3>
              <p>maria.ivanenko@example.com</p>
              <p><MapPin size={16} className="icon" /> Львів, Україна</p>

              <button className="change-photo-btn">Змінити фото</button>
            </div>
          </div>

          <div className="profile-divider"></div>

          <form className="profile-form">
            <div className="form-row">
              <label>
                Ім’я
                <input type="text" defaultValue="Марія" />
              </label>

              <label>
                Прізвище
                <input type="text" defaultValue="Іваненко" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input type="email" defaultValue="maria.ivanenko@example.com" />
              </label>

              <label>
                Номер телефону
                <input type="text" defaultValue="+380 50 123 45 67" />
              </label>
            </div>

            <label>
              Про себе
              <textarea defaultValue="Люблю музику, подорожі та нові знайомства. Завжди відкрита до цікавих подій та спільнот!" />
            </label>

            <div className="interests-block">
              <p>Інтереси</p>

              <div className="interests-list">
                {interests.map((interest) => (
                  <span key={interest}>{interest} ×</span>
                ))}
              </div>

              <button type="button" className="add-interest-btn">
                + Додати інтерес
              </button>
            </div>

            <div className="profile-actions">
              <button type="submit">Зберегти зміни</button>
              <button type="button" className="cancel-btn">
                Скасувати
              </button>
            </div>
          </form>
        </section>

        <aside className="profile-summary">
          <h2>Підсумок профілю</h2>

          <div className="summary-list">
            <p><Mail size={16} className="icon" /> maria.ivanenko@example.com</p>
            <p><Phone size={16} className="icon" /> +380 50 123 45 67</p>
            <p><MapPin size={16} className="icon" /> Львів, Україна</p>
            <p><CalendarDays size={16} className="icon" /> Приєдналася 12 червня 2024</p>
          </div>

          <div className="profile-tip">
            <h3><Shield size={16} className="icon" /> Порада</h3>
            <p>
              Заповніть свій профіль, щоб інші користувачі могли краще вас
              знайти та рекомендувати події за вашими інтересами.
            </p>
          </div>

          <div className="quick-actions">
            <h3>Швидкі дії</h3>
            <button>Переглянути мій профіль →</button>
            <button>Мої збережені події →</button>
            <button>Мої повідомлення →</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;