import "./SavedPage.css";
import { CalendarDays, MapPin, Star } from "lucide-react";

function SavedPage() {
  const savedEvents = [
    {
      title: "Концерт гурту Без обмежень",
      category: "Музика",
      date: "17 липня, 19:00",
      place: "Палац спорту, Київ",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600",
    },
    {
      title: "Ранкова йога у парку",
      category: "Спорт",
      date: "19 липня, 10:00",
      place: "Парк Шевченка, Львів",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    },
    {
      title: "Tech Talk: Майбутнє ШІ",
      category: "Технології",
      date: "23 липня, 18:30",
      place: "Простір, Дніпро",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    },
  ];

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1>Збережене</h1>
        <p>Події, які ви зберегли для перегляду пізніше</p>
      </div>

      <div className="saved-tabs">
        <button className="active">Усі</button>
        <button>Події</button>
        <button>Люди</button>
        <button>Репетитори</button>
      </div>

      <div className="saved-grid">
        {savedEvents.map((event) => (
          <article className="saved-card" key={event.title}>
            <div className="saved-image">
              <img src={event.image} alt={event.title} />

              <button className="saved-bookmark">
                <Star size={18} />
              </button>
            </div>

            <div className="saved-info">
              <span className="saved-category">{event.category}</span>

              <h3>{event.title}</h3>

              <div className="saved-meta">
                <p className="icon-text">
                  <CalendarDays size={16} />
                  {event.date}
                </p>

                <p className="icon-text">
                  <MapPin size={16} />
                  {event.place}
                </p>
              </div>

              <div className="saved-actions">
                <button>Детальніше</button>
                <button className="remove-btn">Прибрати</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default SavedPage;