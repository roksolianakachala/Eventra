import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Ticket, ImagePlus, Key} from "lucide-react";

import { eventService } from "../../services/eventService";
import "./CreateEventPage.css";

function CreateEventPage() {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    category: "Музика",
    date: "",
    start_time: "",
    end_time: "", 
    access_type: "Публічна", 
    city: "",
    place: "",
    format: "Офлайн",
    maxMembers: "",
    price: "",
    description: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(""); 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setEvent({ ...event, image: URL.createObjectURL(file) }); 
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try { 
        let finalBannerUrl = ''; 

        if (imageFile) {
          const uploadResult = await eventService.uploadBanner(imageFile);
          finalBannerUrl = uploadResult.url; 
        } 

        const payload = {
          title: event.title,
          category: event.category, 
          location: `${event.city}, ${event.place}`,
          description: event.description,
          price: event.price ? parseFloat(event.price) : 0,
          capacity: event.maxMembers ? parseInt(event.maxMembers) : null,
          format: event.format,
          banner_url: finalBannerUrl || null, 

          access_type: "public", 
          start_time: `${event.date}T${event.start_time}:00Z`, 
          end_time: event.end_time ? `${event.date}T${event.end_time}:00Z` : null, 
      }; 

      const result = await eventService.createEvent(payload); 
      alert("Подія створена!"); 
      navigate("/events"); 
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Помилка створення події");
    }

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
                required 
                name="title"
                value={event.title}
                onChange={handleChange}
                placeholder="Наприклад: Вечір настільних ігор"    
                onInvalid={(e) => e.target.setCustomValidity('Будь ласка, введіть назву події')} 
                onInput={(e) => e.target.setCustomValidity('')}
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
                required  
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange} 
                onInvalid={(e) => e.target.setCustomValidity('Будь ласка, виберіть дату події')} 
                onInput={(e) => e.target.setCustomValidity('')} 
              />
            </label>

            <label>
              Час початку 
              <input
                required
                type="time"
                name="start_time"
                value={event.start_time} 
                onChange={handleChange}
                onInvalid={(e) => e.target.setCustomValidity('Будь ласка, виберіть час початку')} 
                onInput={(e) => e.target.setCustomValidity('')} 
              />
            </label>

            <label>
              Місто
              <input 
                required 
                name="city"
                value={event.city}
                onChange={handleChange}
                placeholder="Наприклад: Львів" 
                onInvalid={(e) => e.target.setCustomValidity('Будь ласка, введіть місто проведення')} 
                onInput={(e) => e.target.setCustomValidity('')} 
              />
            </label>

            <label>
              Місце проведення
              <input 
                required
                name="place"
                value={event.place}
                onChange={handleChange}
                placeholder="Наприклад: Innovation Hub" 
                onInvalid={(e) => e.target.setCustomValidity('Будь ласка, введіть місце проведення')} 
                onInput={(e) => e.target.setCustomValidity('')}
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

            <label>
              Час завершення події 
              <input
                type="time"
                name="end_time"
                value={event.end_time}
                onChange={handleChange}
              />
            </label> 

            <label>
              Тип доступу 
              <select
                name="access_type"
                value={event.access_type}
                onChange={handleChange}
              >
                <option>Публічна</option> 
                <option>Приватна</option>
                <option>За запрошенням</option> 
              </select>
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
                <Key size={16} /> 
                {event.access_type || "Тип доступу"} 
              </p>


              <p className="icon-text">
                <Calendar size={16} />
                {event.date || "Дата"}
              </p>

              <p className="icon-text">
                <Clock size={16} />
                {event.start_time || "Час початку"} - {event.end_time || "Час завершення"} 
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
