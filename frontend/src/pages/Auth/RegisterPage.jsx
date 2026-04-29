import "./AuthPages.css";
import { CalendarDays, User, Lock, Eye, Mail, UserRound, Apple } from "lucide-react";
import { useState } from "react";
import axios from "axios";

function RegisterPage() {

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
    await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );

    alert("Реєстрація успішна");
  } catch (error) {
    alert("Помилка реєстрації");
  }
};


  return (
    <div className="auth-page">
      <section className="auth-info">
        <h1>
          Створіть свій акаунт <br />
          у <h2 className="auth-title">
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
                <input type="text" name="firstName" placeholder="Введіть ваше ім’я" onChange={handleChange}/>
              </div>
            </label>

            <label>
              Прізвище
              <div className="auth-input">
                <User size={18} />
                <input type="text" name="lastName" placeholder="Введіть ваше прізвище" onChange={handleChange}/>
              </div>
            </label>
          </div>

          <label>
            Email або номер телефону
            <div className="auth-input">
              <Mail size={18} />
              <input type="email" name="email" placeholder="Введіть email" onChange={handleChange}/>
            </div>
          </label>

          <div className="auth-two-columns">
            <label>
              Пароль
              <div className="auth-input">
                <div className="input-with-icon">
                  <Lock size={18} />

                  <input type="password" name="password" placeholder="Введіть пароль" onChange={handleChange}/>

                  <Eye size={18} className="eye-icon" />
                </div>
              </div>
            </label>

            <label>
              Підтвердіть пароль
              <div className="auth-input">
                <div className="input-with-icon">
                  <Lock size={18} />

                  <input type="password" name="confirmPassword" placeholder="Підтвердіть пароль" onChange={handleChange}/>

                  <Eye size={18} className="eye-icon" />
                </div>
              </div>
            </label>
          </div>

          <div className="auth-two-columns">
            <label>
              Дата народження
              <div className="auth-input">
                <CalendarDays size={18} />
                <input type="date" name="birthDate" placeholder="ДД . ММ . РРРР" onChange={handleChange}/>
              </div>
            </label>

            <label>
              Стать (необов’язково)
              <div className="auth-input">
                <input type="text" name="gender" placeholder="Оберіть стать" onChange={handleChange}/>
                <span>⌄</span>
              </div>
            </label>
          </div>

          <label className="checkbox-label">
            <input type="checkbox" />
            Я погоджуюсь з <a href="/">Умовами використання</a> та{" "}
            <a href="/">Політикою конфіденційності</a>
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
          <button className="social-btn" onClick={() => {
            window.location.href = "http://localhost:5000/api/auth/google";}}>
            <Mail size={18} />
            Google
          </button>

          <button className="social-btn">
            <UserRound size={18} />
            Facebook
          </button>

          <button className="social-btn">
            <Apple size={18} />
            Apple
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