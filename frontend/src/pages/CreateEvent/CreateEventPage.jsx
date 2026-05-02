import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Ticket, ImagePlus,} from "lucide-react";
import "./CreateEventPage.css";

function CreateEventPage() {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    category: "Музика",
    date: "",
    time: "",
    city: "",
    place: "",
    format: "Офлайн",
    maxMembers: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setEvent({ ...event, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send new event data to the backend events API.
    alert("Публікація події буде доступна після підключення backend.");
  };

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <h1>Створити подію</h1>
        <p>
          Заповніть інформацію про подію, щоб запросити людей зі схожими
          інтересами
        </p>
      </div>

      <div className="create-event-layout">
        <form className="create-event-form" onSubmit={handleSubmit}>
          <label className="event-image-upload">
            Обкладинка події
            <div className="event-image-box">
              {event.image ? (
                <img src={event.image} alt="Обкладинка події" />
              ) : (
                <span className="upload-placeholder">
                  <ImagePlus size={22} />
                  Додати фото
                </span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          <div className="event-form-grid">
            <label>
              Назва події
              <input
                name="title"
                value={event.title}
                onChange={handleChange}
                placeholder="Наприклад: Вечір настільних ігор"
              />
            </label>

            <label>
              Категорія
              <select
                name="category"
                value={event.category}
                onChange={handleChange}
              >
                <option>Музика</option>
                <option>Спорт</option>
                <option>Освіта</option>
                <option>Технології</option>
                <option>Мистецтво</option>
                <option>Ігри</option>
                <option>Кіно</option>
              </select>
            </label>

            <label>
              Дата
              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
              />
            </label>

            <label>
              Час
              <input
                type="time"
                name="time"
                value={event.time}
                onChange={handleChange}
              />
            </label>

            <label>
              Місто
              <input
                name="city"
                value={event.city}
                onChange={handleChange}
                placeholder="Наприклад: Львів"
              />
            </label>

            <label>
              Місце проведення
              <input
                name="place"
                value={event.place}
                onChange={handleChange}
                placeholder="Наприклад: Innovation Hub"
              />
            </label>

            <label>
              Формат
              <select
                name="format"
                value={event.format}
                onChange={handleChange}
              >
                <option>Офлайн</option>
                <option>Онлайн</option>
                <option>Гібридний</option>
              </select>
            </label>

            <label>
              Кількість учасників
              <input
                name="maxMembers"
                value={event.maxMembers}
                onChange={handleChange}
                placeholder="Наприклад: 30"
              />
            </label>

            <label>
              Вартість
              <input
                name="price"
                value={event.price}
                onChange={handleChange}
                placeholder="Безкоштовно або 200 грн"
              />
            </label>
          </div>

          <label className="event-full-width">
            Опис події
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Розкажіть, що буде на події, для кого вона і чому варто прийти"
            />
          </label>

          <div className="event-form-actions">
            <button type="submit">Опублікувати подію</button>
            <button type="button" className="event-secondary-btn" onClick={() => navigate("/events")}>
              Скасувати
            </button>
          </div>
        </form>

        <aside className="event-preview">
          <h2>Попередній перегляд</h2>

          <div className="event-preview-card">
            <div className="event-preview-image">
              {event.image ? (
                <img src={event.image} alt="Preview" />
              ) : (
                <span className="upload-placeholder">
                  <ImagePlus size={22} />
                  Фото події
                </span>
              )}
            </div>

            <div className="event-preview-body">
              <span className="event-preview-category">{event.category}</span>

              <h3>{event.title || "Назва вашої події"}</h3>

              <p className="icon-text">
                <Calendar size={16} />
                {event.date || "Дата"}
              </p>

              <p className="icon-text">
                <Clock size={16} />
                {event.time || "Час"}
              </p>

              <p className="icon-text">
                <MapPin size={16} />
                {event.place || "Місце"}, {event.city || "Місто"}
              </p>

              <p className="icon-text">
                <Users size={16} />
                До {event.maxMembers || "0"} учасників
              </p>

              <p className="icon-text">
                <Ticket size={16} />
                {event.price || "Вартість не вказана"}
              </p>

              <div className="event-preview-description">
                <h4>Опис</h4>
                <p>
                  {event.description ||
                    "Тут буде короткий опис вашої події, щоб учасники зрозуміли, чого очікувати."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CreateEventPage;
