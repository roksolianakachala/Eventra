import "./ProfilePage.css";
import { Shield, MapPin, Mail, Phone, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";
function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const interests = Array.isArray(user.interests) ? user.interests : [];
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);


  const handleProfileSave = async (event) => {
    event.preventDefault();

    const form = event.target;

    const payload = {
      firstName: form[0].value,
      lastName: form[1].value,
      email: form[2].value,
      phone: form[3].value,
      bio: form[4].value,
      interests,
   };

    const token = localStorage.getItem("token");

    await fetch("/api/profile/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    alert("Профіль оновлено");
  };

  const handlePlaceholderAction = () => {
    // TODO: Connect this profile action to the backend user profile API.
    alert("Ця дія буде доступна після підключення backend.");
  };

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
            <button
              key={item}
              className={activeMenuIndex === index ? "active" : ""}
              onClick={() => setActiveMenuIndex(index)}
              type="button"
            >
              {item}
            </button>
          ))}
        </aside>

        <section className="profile-main">
          <h2>Особисті дані</h2>

          <div className="profile-user">
            {user.avatarUrl ? (
              <img className="profile-avatar" src={user.avatarUrl} alt={user.fullName} />
            ) : (
              <div className="profile-avatar">{user.initials}</div>
            )}

            <div>
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
              {user.location && <p><MapPin size={16} className="icon" /> {user.location}</p>}

              <button className="change-photo-btn" type="button" onClick={handlePlaceholderAction}>Змінити фото</button>
            </div>
          </div>

          <div className="profile-divider"></div>

          <form className="profile-form" onSubmit={handleProfileSave}>
            <div className="form-row">
              <label>
                Ім’я
                <input type="text" defaultValue={user.firstName} />
              </label>

              <label>
                Прізвище
                <input type="text" defaultValue={user.lastName} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input type="email" defaultValue={user.email} />
              </label>

              <label>
                Номер телефону
                <input type="text" defaultValue={user.phone} />
              </label>
            </div>

            <label>
              Про себе
              <textarea defaultValue={user.bio} />
            </label>

            <div className="interests-block">
              <p>Інтереси</p>

              <div className="interests-list">
                {interests.map((interest) => (
                  <span key={interest}>{interest} ×</span>
                ))}
              </div>

              <button type="button" className="add-interest-btn" onClick={handlePlaceholderAction}>
                + Додати інтерес
              </button>
            </div>

            <div className="profile-actions">
              <button type="submit">Зберегти зміни</button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
                Скасувати
              </button>
            </div>
          </form>
        </section>

        <aside className="profile-summary">
          <h2>Підсумок профілю</h2>

          <div className="summary-list">
            <p><Mail size={16} className="icon" /> {user.email}</p>
            {user.phone && <p><Phone size={16} className="icon" /> {user.phone}</p>}
            {user.location && <p><MapPin size={16} className="icon" /> {user.location}</p>}
            {user.joinedAt && <p><CalendarDays size={16} className="icon" /> Приєдналася {user.joinedAt}</p>}
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
            <button type="button" onClick={() => navigate("/profile")}>Переглянути мій профіль →</button>
            <button type="button" onClick={() => navigate("/saved")}>Мої збережені події →</button>
            <button type="button" onClick={() => navigate("/messages")}>Мої повідомлення →</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;
