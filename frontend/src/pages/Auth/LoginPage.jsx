import "./AuthPages.css";
import { Smile, Lock, Eye, Mail, UserRound, Apple } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";
import { getGoogleAuthUrl } from "../../services/authService";
function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await loginUser(formData);
      navigate("/profile");
    } catch (error) {
      alert(error.message || "Не вдалося увійти");
    }
  };

  const handleSocialPlaceholder = () => {
    
    alert("Цей спосіб входу буде доступний після підключення backend.");
  };

  return (
    <div className="auth-page">
      <section className="auth-info">
        <h1>
          Ласкаво просимо <br />
          до <span>Eventra!</span>
        </h1>

        <p>
          Єдиний простір для людей і подій, що надихають.
          <br />
          Знайомся, навчайся, відкривай нове разом з Eventra.
        </p>

        <img src="/images/arkam-team.png" alt="Eventra community" />
      </section>

      <section className="auth-card">
        <h1>Вхід</h1>
        <p className="auth-title">
          Раді бачити вас знову
          <Smile size={25} />
          
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email або номер телефону
            <div className="auth-input">
              <Mail size={18} />
              <input type="email" name="email" placeholder="Введіть email" onChange={handleChange} />
            </div>
          </label>

          <label>
            Пароль
            <div className="auth-input">
              <div className="input-with-icon">
                <Lock size={18} />

                <input type="password" name="password" placeholder="Введіть пароль" onChange={handleChange} />

                <Eye size={18} className="eye-icon" />
              </div>
            </div>
          </label>

          <div className="auth-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              Запам'ятати мене
            </label>

            <a href="/">Забули пароль?</a>
          </div>

          <button type="submit" className="primary-auth-btn">
            Увійти
          </button>
        </form>

        <div className="auth-divider">
          <span></span>
          <p>або увійти через</p>
          <span></span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" type="button" onClick={() => {
            window.location.href = getGoogleAuthUrl();}}>
            <Mail size={18} />
            Google
          </button>

          <button className="social-btn" type="button" onClick={handleSocialPlaceholder}>
            <UserRound size={18} />
            Facebook
          </button>

          <button className="social-btn" type="button" onClick={handleSocialPlaceholder}>
            <Apple size={18} />
            Apple
          </button>
        </div>

        <p className="auth-bottom-text">
          Ще не маєте акаунту? <a href="/register">Зареєструватися</a>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
