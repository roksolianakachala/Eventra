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

    const form = event.currentTarget;

    const payload = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      bio: form.bio.value,
      // interests,
    };

    console.log("PAYLOAD:", payload);

    const auth = JSON.parse(localStorage.getItem("eventra_auth") || "{}");
    const token = auth?.token;

    if (!token) {
      alert("Нема токена. Перелогінься");
      return;
    }

    await fetch("https://eventra-j1tj.onrender.com/api/profile/me", {
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
              {user.location && (
                <p>
                  <MapPin size={16} className="icon" /> {user.location}
                </p>
              )}

              <button type="button" onClick={handlePlaceholderAction}>
                Змінити фото
              </button>
            </div>
          </div>

          <div className="profile-divider"></div>

          <form className="profile-form" onSubmit={handleProfileSave}>
            <div className="form-row">
              <label>
                Ім’я
                <input name="firstName" type="text" defaultValue={user.firstName} />
              </label>

              <label>
                Прізвище
                <input name="lastName" type="text" defaultValue={user.lastName} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input name="email" type="email" defaultValue={user.email} />
              </label>

              <label>
                Номер телефону
                <input name="phone" type="text" defaultValue={user.phone} />
              </label>
            </div>

            <label>
              Про себе
              <textarea name="bio" defaultValue={user.bio} />
            </label>

            <div className="interests-block">
              <p>Інтереси</p>

              <div className="interests-list">
                {interests.map((interest) => (
                  <span key={interest}>{interest} ×</span>
                ))}
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit">Зберегти зміни</button>
              <button type="button" onClick={() => navigate("/")}>
                Скасувати
              </button>
            </div>
          </form>
        </section>

        <aside className="profile-summary">
          <h2>Підсумок профілю</h2>

          <div>
            <p>
              <Mail size={16} /> {user.email}
            </p>
            {user.phone && (
              <p>
                <Phone size={16} /> {user.phone}
              </p>
            )}
            {user.location && (
              <p>
                <MapPin size={16} /> {user.location}
              </p>
            )}
            {user.joinedAt && (
              <p>
                <CalendarDays size={16} /> Приєдналася {user.joinedAt}
              </p>
            )}
          </div>

          <div>
            <h3>
              <Shield size={16} /> Порада
            </h3>
            <p>
              Заповніть профіль, щоб отримувати кращі рекомендації подій.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;