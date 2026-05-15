import { apiRequest } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Lock,
  Globe,
  Moon,
  Shield,
  User,
  Mail,
  Smartphone,
  Trash2,
} from "lucide-react";

import "./SettingsPage.css";


function SettingsPage() {
  const navigate = useNavigate();
  const handleSettingsPlaceholder = () => {
    // TODO: Connect account settings actions to backend account/security APIs.
    alert("Ця дія налаштувань буде доступна після підключення backend.");
  };

  const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    "Ви точно хочете видалити акаунт? Цю дію неможливо скасувати."
  );

  if (!confirmed) return;

  const auth = JSON.parse(localStorage.getItem("eventra_auth") || "{}");
  const token = auth?.token;

  if (!token) {
    alert("Немає токена");
    return;
  }

  await apiRequest("/profile/me", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  localStorage.removeItem("eventra_auth");
    navigate("/register");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Налаштування</h1>
        <p>Керуйте параметрами акаунта, безпекою та сповіщеннями</p>
      </div>

      <div className="settings-layout">
        <section className="settings-card">
          <div className="settings-card-title">
            <User size={22} />
            <div>
              <h2>Обліковий запис</h2>
              <p>Основні налаштування вашого профілю</p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <h3>Видимість профілю</h3>
              <p>Дозволити іншим користувачам знаходити ваш профіль</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

          <div className="settings-row">
            <div>
              <h3>Показувати мої інтереси</h3>
              <p>Ваші інтереси будуть видимі у профілі</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title">
            <Bell size={22} />
            <div>
              <h2>Сповіщення</h2>
              <p>Налаштуйте, які повідомлення ви хочете отримувати</p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <h3>Нові повідомлення</h3>
              <p>Сповіщати про нові повідомлення в чатах</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

          <div className="settings-row">
            <div>
              <h3>Рекомендовані події</h3>
              <p>Отримувати сповіщення про події за інтересами</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>
          </div>

          <div className="settings-row">
            <div>
              <h3>Email-сповіщення</h3>
              <p>Надсилати важливі оновлення на email</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span></span>
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title">
            <Lock size={22} />
            <div>
              <h2>Безпека</h2>
              <p>Пароль, вхід та захист акаунта</p>
            </div>
          </div>

          <div className="settings-action-row">
            <div>
              <h3>Змінити пароль</h3>
              <p>Оновіть пароль для захисту облікового запису</p>
            </div>
            <button type="button" onClick={handleSettingsPlaceholder}>Змінити</button>
          </div>

          <div className="settings-row">
            <div>
              <h3>Двофакторна автентифікація</h3>
              <p>Додатковий рівень захисту при вході</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span></span>
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title">
            <Globe size={22} />
            <div>
              <h2>Мова та вигляд</h2>
              <p>Персоналізуйте інтерфейс Eventra</p>
            </div>
          </div>

          <div className="settings-field">
            <label>Мова інтерфейсу</label>
            <select defaultValue="uk">
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="settings-row">
            <div>
              <h3>Темна тема</h3>
              <p>Увімкнути темний режим інтерфейсу</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span></span>
            </label>
          </div>
        </section>

        <section className="settings-card danger-card">
          <div className="settings-card-title">
            <Trash2 size={22} />
            <div>
              <h2>Небезпечна зона</h2>
              <p>Дії, які неможливо легко скасувати</p>
            </div>
          </div>

          <div className="settings-action-row">
            <div>
              <h3>Видалити акаунт</h3>
              <p>Після видалення акаунта дані буде втрачено</p>
            </div>
            <button type="button" onClick={handleDeleteAccount}> Видалити </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
