import "./AuthPages.css";
import { CalendarDays, User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";
import { getGoogleAuthUrl } from "../../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }

    try {
      await registerUser(formData);

      alert("Реєстрація успішна");
      navigate("/profile");
    } catch (error) {
      alert(error.message || "Помилка реєстрації");
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-info">
        <h1>
          Створіть свій акаунт<br />
          <h2 className="auth-title">
            Ласкаво просимо до <span>Eventra</span>
          </h2>
        </h1>

        <p>
          Приєднуйтесь до спільноти людей, які розвиваються,
          <br />
          знаходять однодумців і відкривають нові можливості щодня.
        </p>

        <img src="/images/arkam-team.png" alt="Eventra community" />
      </section>

      <section className="auth-card">
        <h2>Реєстрація</h2>
        <p className="auth-subtitle">
          Створіть акаунт, щоб користуватися всіма можливостями Eventra
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-two-columns">
            <label>
              Ім’я
              <div className="auth-input">
                <User size={18} />
                <input type="text" name="firstName" placeholder="Введіть ваше ім’я" onChange={handleChange} required />
              </div>
            </label>

            <label>
              Прізвище
              <div className="auth-input">
                <User size={18} />
                <input type="text" name="lastName" placeholder="Введіть ваше прізвище" onChange={handleChange} required />
              </div>
            </label>
          </div>

          <label>
            Email або номер телефону
            <div className="auth-input">
              <Mail size={18} />
              <input type="email" name="email" placeholder="Введіть email" onChange={handleChange} required />
            </div>
          </label>

          <div className="auth-two-columns">
            <label>
              Пароль
              <div className="auth-input">
                <div className="input-with-icon">
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Введіть пароль"
                    onChange={handleChange}
                    required
                  />

                  <button
                    className="eye-icon"
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </label>

            <label>
              Підтвердіть пароль
              <div className="auth-input">
                <div className="input-with-icon">
                  <Lock size={18} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Підтвердіть пароль"
                    onChange={handleChange}
                    required
                  />

                  <button
                    className="eye-icon"
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? "Сховати підтвердження пароля" : "Показати підтвердження пароля"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </label>
          </div>

          <div className="auth-two-columns">
            <label>
              Дата народження
              <div className="auth-input">
                <input
                  type="date"
                  name="birthDate"
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              Стать
              <div className="auth-input">
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Оберіть стать</option>
                  <option value="male">Чоловіча</option>
                  <option value="female">Жіноча</option>
                  <option value="other">Інше</option>
                  <option value="prefer_not_to_say">Не хочу вказувати</option>
                </select>
              </div>
            </label>
          </div>

          <label className="checkbox-label">
            <input type="checkbox" />
            Я погоджуюсь з <a href="/">Умовами використання</a> та{" "}
            <a href="/privacy">Політикою конфіденційності</a>
          </label>

          <button type="submit" className="primary-auth-btn">
            Зареєструватися
          </button>
        </form>

        <div className="auth-divider">
          <span></span>
          <p>або зареєструватися через</p>
          <span></span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" type="button" onClick={() => {
            window.location.href = getGoogleAuthUrl();
          }}>
            <Mail size={18} />
            Google
          </button>


        </div>

        <p className="auth-bottom-text">
          Вже маєте акаунт? <a href="/login">Увійти</a>
        </p>
      </section>
    </div>
  );
}

export default RegisterPage;
