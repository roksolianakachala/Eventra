import "./ProfilePage.css";
import { useState, useEffect } from "react";
import {
  Apple,
  Bell,
  CalendarDays,
  CreditCard,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Shield,
  Star,
  User,
  Users,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";
import { apiRequest } from "../../services/api";

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);


  useEffect(() => {
  const fetchProfile = async () => {
    const auth = JSON.parse(localStorage.getItem("eventra_auth") || "{}");
    const token = auth?.token;

    if (!token) return;

    const res = await fetch("https://eventra-j1tj.onrender.com/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });

      const data = await res.json();
      setProfile(data);
   };

    fetchProfile();
  }, []);

  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      alert("Немає токена. Перелогінься");
      return;
    }

    await apiRequest("/profile/me", {
      method: "PUT",
      headers: {
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
    { label: "Особисті дані", icon: User },
    { label: "Безпека", icon: Lock },
    { label: "Сповіщення", icon: Bell },
    { label: "Конфіденційність", icon: Shield },
    { label: "Підписка", icon: Star },
    { label: "Платіжні дані", icon: CreditCard },
    { label: "Підключені акаунти", icon: Link2 },
    { label: "Мої відгуки", icon: MessageSquareText },
  ];

  const connectedAccounts = [
    { name: "Google", detail: user.email || "Не підключено", connected: true, icon: Mail },
    { name: "Facebook", detail: "Не підключено", connected: false, icon: Users },
    { name: "Apple", detail: "Не підключено", connected: false, icon: Apple },
  ];

  const reviews = [
    {
      title: "Майстер-клас з продуктового дизайну",
      date: "12 квітня 2026",
      rating: 5,
      text: "Корисна подія з практичними завданнями та дуже зрозумілими поясненнями.",
    },
    {
      title: "English Speaking Club",
      date: "28 березня 2026",
      rating: 4,
      text: "Затишна атмосфера, хороші теми для розмови й активна група учасників.",
    },
  ];

  const renderPasswordInput = (name, placeholder, isVisible, onToggle) => (
    <div className="profile-password-input">
      <KeyRound size={18} />
      <input name={name} type={isVisible ? "text" : "password"} placeholder={placeholder} />
      <button type="button" onClick={onToggle} aria-label={isVisible ? "Сховати пароль" : "Показати пароль"}>
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  const renderToggleRow = (title, description, defaultChecked = false) => (
    <div className="profile-setting-row">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <label className="profile-switch">
        <input type="checkbox" defaultChecked={defaultChecked} />
        <span></span>
      </label>
    </div>
  );

  const renderPersonalData = () => (
    <>
      <h2>Особисті дані</h2>

      <div className="profile-user">
        {profile?.avatar_url ? (
          <img className="profile-avatar" src={profile.avatar_url} /> 
        ) : (
        <div className="profile-avatar">
          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
        </div>
        )}

        <div>
          <h3>{profile?.first_name} {profile?.last_name}</h3>
          <p>{user.email}</p>
          <p>{profile?.email}</p>
          {profile?.location && (
            <p>
              <MapPin size={16} className="icon" /> {profile.location}
            </p>
          )}

          <button className="change-photo-btn" type="button" onClick={handlePlaceholderAction}>
            Змінити фото
          </button>
        </div>
      </div>

      <div className="profile-divider"></div>

      <form className="profile-form" onSubmit={handleProfileSave}>
        <div className="form-row">
          <label>
            Ім'я
            <input name="firstName" type="text" defaultValue={profile?.first_name || ""} />
          </label>

          <label>
            Прізвище
            <input name="lastName" type="text" defaultValue={profile?.last_name || ""} />
          </label>
        </div>

        <div className="form-row">
          <label>
            Email
            <input name="email" type="email" defaultValue={user.email} />
          </label>

          <label>
            Номер телефону
            <input name="phone" type="text" defaultValue={profile?.phone || ""} />
          </label>
        </div>

        <label>
          Про себе
          <textarea name="bio" defaultValue={profile?.bio || ""} />
        </label>

        <div className="interests-block">
          <p>Інтереси</p>

          <div className="interests-list">
            {interests.length > 0 ? (
              interests.map((interest) => <span key={interest}>{interest} x</span>)
            ) : (
            <button className="add-interest-btn" type="button"
            onClick={() => navigate("/profile/interests")}>
              Додайте інтереси
            </button>
          )}
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit">Зберегти зміни</button>
          <button className="cancel-btn" type="button" onClick={() => navigate("/")}>
            Скасувати
          </button>
        </div>
      </form>
    </>
  );

  const renderSecurity = () => (
    <>
      <h2>Безпека</h2>

      <div className="profile-section-intro">
        <Lock size={22} />
        <div>
          <h3>Пароль і захист акаунта</h3>
          <p>Оновлюйте пароль та контролюйте додаткові способи входу.</p>
        </div>
      </div>

      <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Поточний пароль
          {renderPasswordInput("currentPassword", "Введіть поточний пароль", showCurrentPassword, () =>
            setShowCurrentPassword((current) => !current)
          )}
        </label>

        <label>
          Новий пароль
          {renderPasswordInput("newPassword", "Введіть новий пароль", showNewPassword, () =>
            setShowNewPassword((current) => !current)
          )}
        </label>

        <div className="profile-actions">
          <button type="button" onClick={handlePlaceholderAction}>
            Оновити пароль
          </button>
        </div>
      </form>

      <div className="profile-divider"></div>
      {renderToggleRow("Двофакторна автентифікація", "Додатковий код підтвердження під час входу.", false)}
      {renderToggleRow("Сповіщення про новий вхід", "Надсилати лист, якщо акаунт відкрили з нового пристрою.", true)}
    </>
  );

  const renderNotifications = () => (
    <>
      <h2>Сповіщення</h2>
      {renderToggleRow("Нові повідомлення", "Отримувати сповіщення про нові повідомлення в чатах.", true)}
      {renderToggleRow("Рекомендовані події", "Показувати події, що відповідають вашим інтересам.", true)}
      {renderToggleRow("Нагадування про події", "Надсилати нагадування перед початком збережених подій.", true)}
      {renderToggleRow("Email-оновлення", "Отримувати важливі новини Eventra на пошту.", false)}
      {renderToggleRow("Push-сповіщення", "Дозволити короткі сповіщення у браузері.", false)}
    </>
  );

  const renderPrivacy = () => (
    <>
      <h2>Конфіденційність</h2>
      {renderToggleRow("Видимість профілю", "Дозволити іншим користувачам знаходити ваш профіль.", true)}
      {renderToggleRow("Показувати мої інтереси", "Інтереси будуть видимі у вашому профілі.", true)}
      {renderToggleRow("Показувати відвідані події", "Інші користувачі зможуть бачити вашу активність.", false)}
      {renderToggleRow("Персоналізовані рекомендації", "Використовувати вашу активність для кращих рекомендацій.", true)}

      <div className="profile-action-panel">
        <div>
          <h3>Експорт даних</h3>
          <p>Отримайте копію даних, які зберігаються у вашому акаунті.</p>
        </div>
        <button type="button" onClick={handlePlaceholderAction}>
          Запросити файл
        </button>
      </div>
    </>
  );

  const renderSubscription = () => (
    <>
      <h2>Підписка</h2>

      <div className="subscription-card">
        <div>
          <p className="profile-eyebrow">Поточний план</p>
          <h3>Eventra Free</h3>
          <p>Базовий доступ до подій, профілю, повідомлень та збережених матеріалів.</p>
        </div>
        <span>Активна</span>
      </div>

      <div className="profile-plan-grid">
        <div className="profile-plan">
          <h3>Plus</h3>
          <p>Розширені рекомендації, пріоритетні місця на подіях і більше збережень.</p>
          <strong>149 грн / міс</strong>
          <button type="button" onClick={handlePlaceholderAction}>
            Обрати
          </button>
        </div>

        <div className="profile-plan">
          <h3>Pro</h3>
          <p>Для організаторів: аналітика подій, промо-інструменти та підтримка.</p>
          <strong>399 грн / міс</strong>
          <button type="button" onClick={handlePlaceholderAction}>
            Обрати
          </button>
        </div>
      </div>
    </>
  );

  const renderPayment = () => (
    <>
      <h2>Платіжні дані</h2>

      <div className="profile-section-intro">
        <WalletCards size={22} />
        <div>
          <h3>Способи оплати</h3>
          <p>Керуйте картками для підписок, квитків і платних подій.</p>
        </div>
      </div>

      <div className="payment-method">
        <CreditCard size={24} />
        <div>
          <h3>Картку ще не додано</h3>
          <p>Додайте платіжний метод, щоб швидше оплачувати події.</p>
        </div>
        <button type="button" onClick={handlePlaceholderAction}>
          Додати
        </button>
      </div>

      <div className="profile-action-panel">
        <div>
          <h3>Історія платежів</h3>
          <p>Тут з'являться квитанції та платежі після першої покупки.</p>
        </div>
        <button type="button" onClick={handlePlaceholderAction}>
          Переглянути
        </button>
      </div>
    </>
  );

  const renderConnectedAccounts = () => (
    <>
      <h2>Підключені акаунти</h2>
      <div className="connected-list">
        {connectedAccounts.map(({ name, detail, connected, icon: Icon }) => (
          <div className="connected-item" key={name}>
            <div className="connected-icon">
              <Icon size={20} />
            </div>
            <div>
              <h3>{name}</h3>
              <p>{detail}</p>
            </div>
            <button type="button" onClick={handlePlaceholderAction}>
              {connected ? "Відключити" : "Підключити"}
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const renderReviews = () => (
    <>
      <h2>Мої відгуки</h2>

      <div className="reviews-list">
        {reviews.map((review) => (
          <article className="review-card" key={review.title}>
            <div className="review-card-header">
              <div>
                <h3>{review.title}</h3>
                <p>{review.date}</p>
              </div>
              <div className="review-rating" aria-label={`${review.rating} з 5`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill={index < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            <p>{review.text}</p>
            <button type="button" onClick={handlePlaceholderAction}>
              Редагувати
            </button>
          </article>
        ))}
      </div>
    </>
  );

  const renderActiveContent = () => {
    switch (activeMenuIndex) {
      case 1:
        return renderSecurity();
      case 2:
        return renderNotifications();
      case 3:
        return renderPrivacy();
      case 4:
        return renderSubscription();
      case 5:
        return renderPayment();
      case 6:
        return renderConnectedAccounts();
      case 7:
        return renderReviews();
      default:
        return renderPersonalData();
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-title">
        <h1>Обліковий запис</h1>
        <p>Керуйте своїм профілем, безпекою, сповіщеннями та налаштуваннями акаунта</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-menu">
          {menuItems.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              className={activeMenuIndex === index ? "active" : ""}
              onClick={() => setActiveMenuIndex(index)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        <section className="profile-main">{renderActiveContent()}</section>

        <aside className="profile-summary">
          <h2>Підсумок профілю</h2>

          <div className="summary-list">
            <p>
              <Mail size={16} /> {profile?.email}
            </p>
            {profile?.phone && (
              <p>
                <Phone size={16} /> {profile.phone}
              </p>
            )}
            {profile?.location && (
              <p>
                <MapPin size={16} /> {profile.location}
              </p>
            )}
            {profile?.joinedAt && (
              <p>
                <CalendarDays size={16} /> Приєдналася {profile.joinedAt}
              </p>
            )}
          </div>

          <div className="profile-tip">
            <h3>
              <Shield size={16} /> Порада
            </h3>
            <p>Заповніть профіль, щоб отримувати кращі рекомендації подій.</p>
          </div>

          <div className="quick-actions">
            <h3>Швидкі дії</h3>
            <button type="button" onClick={() => setActiveMenuIndex(1)}>
              Оновити пароль
            </button>
            <button type="button" onClick={() => setActiveMenuIndex(5)}>
              Додати платіжні дані
            </button>
            <button type="button" onClick={() => setActiveMenuIndex(7)}>
              Переглянути відгуки
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;
