import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ImagePlus, MapPin, Star } from "lucide-react";
import "./BecomeTutorPage.css";

function BecomeTutorPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "Математика",
    experience: "",
    format: "Онлайн",
    city: "",
    price: "",
    phone: "",
    about: "",
    education: "",
    photo: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setForm({ ...form, photo: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/tutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      subject: form.subject,
      experience_years: form.experience,
      work_format: form.format,
      city: form.city,
      price_per_hour: form.price,
      bio: form.about,
      education: form.education,
    }),
  });

  if (!response.ok) {
    alert("Помилка при збереженні анкети");
    return;
  }

  alert("Анкету збережено!");
  navigate("/tutors");
};

  return (
    <div className="become-tutor-page">
      <div className="become-tutor-header">
        <h1>Стати репетитором</h1>
        <p>Заповніть анкету, щоб інші користувачі могли знайти вас як викладача</p>
      </div>

      <div className="become-tutor-layout">
        <form className="become-tutor-form" onSubmit={handleSubmit}>
          <label className="photo-upload">
            Фото профілю
            <div className="photo-upload-box">
              {form.photo ? (
                <img src={form.photo} alt="Фото репетитора" />
              ) : (
                <span>
                  <ImagePlus size={18} />
                  Додати фото
                </span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          <div className="form-grid">
            <label>
              Ім’я
              <input name="firstName" value={form.firstName} disabled placeholder="Ім’я" />
            </label>

            <label>
              Прізвище
              <input name="lastName" value={form.lastName} disabled placeholder="Прізвище" />
            </label>

            <label>
              Предмет
              <select name="subject" value={form.subject} onChange={handleChange}>
                <option>Математика</option>
                <option>Англійська мова</option>
                <option>Фізика</option>
                <option>Хімія</option>
                <option>Програмування</option>
              </select>
            </label>

            <label>
              Досвід роботи
              <input name="experience" value={form.experience} onChange={handleChange} placeholder="Наприклад: 3 роки" />
            </label>

            <label>
              Формат занять
              <select name="format" value={form.format} onChange={handleChange}>
                <option>Онлайн</option>
                <option>Офлайн</option>
                <option>Онлайн і офлайн</option>
              </select>
            </label>

            <label>
              Місто
              <input name="city" value={form.city} onChange={handleChange} placeholder="Наприклад: Львів" />
            </label>

            <label>
              Вартість заняття
              <input name="price" value={form.price} onChange={handleChange} placeholder="Наприклад: 300 грн / година" />
            </label>

            <label>
              Телефон
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+380..." />
            </label>
          </div>

          <label className="full-width">
            Про себе
            <textarea name="about" value={form.about} onChange={handleChange} placeholder="Розкажіть про свій досвід, підхід до навчання та для кого ваші заняття" />
          </label>

          <label className="full-width">
            Освіта
            <textarea name="education" value={form.education} onChange={handleChange} placeholder="Наприклад: ЛНУ ім. Івана Франка" />
          </label>

          <div className="form-actions">
            <button type="submit">Надіслати анкету</button>
            <button type="button" className="secondary-btn" onClick={() => navigate("/tutors")}>Скасувати</button>
          </div>
        </form>

        <aside className="tutor-preview">
          <h2>Попередній перегляд</h2>

          <div className="preview-card">
            <div className="preview-photo">
              {form.photo ? <img src={form.photo} alt="Preview" /> : <GraduationCap size={42} />}
            </div>

            <span className="preview-subject">{form.subject}</span>

            <h3>
              {form.firstName || "Ім’я"} {form.lastName || "Прізвище"}
            </h3>

            <p><Star size={16} /> 0.0 (0 відгуків)</p>
            <p><MapPin size={16} /> {form.city || "Ваше місто"}</p>

            <div className="preview-section">
              <h4>Про себе</h4>
              <p>{form.about || "Тут буде короткий опис вашого досвіду та підходу до навчання."}</p>
            </div>

            <div className="preview-section">
              <h4>Досвід роботи</h4>
              <p>{form.experience || "Наприклад: 3 роки"}</p>
            </div>

            <div className="preview-section">
              <h4>Формат занять</h4>
              <p>{form.format}</p>
            </div>

            <div className="preview-price">
              {form.price || "Вартість не вказана"}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BecomeTutorPage;
