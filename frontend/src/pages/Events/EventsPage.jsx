import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./EventsPage.css";
import { MapPin, Bell, MessageSquare, Music, Dumbbell, GraduationCap, Laptop, Palette, Gamepad2, ChevronDown, ChevronLeft, ChevronRight, Users, User, Heart, } from "lucide-react";

function EventsPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const topEventsRef = useRef(null);
  const smallEventsRef = useRef(null);

  const scrollSection = (ref, direction) => {
    ref.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  };

  const handlePlaceholderAction = () => {
    // TODO: Connect this event action to backend event details/save API.
    alert("Ця дія буде доступна після підключення подій до backend.");
  };

  const categories = [
    { name: "Музика", Icon: Music },
    { name: "Спорт", Icon: Dumbbell },
    { name: "Освіта", Icon: GraduationCap },
    { name: "Технології", Icon: Laptop },
    { name: "Мистецтво", Icon: Palette },
    { name: "Ігри", Icon: Gamepad2 },
    { name: "Більше", Icon: ChevronDown },
  ];
  const topEvents = [
    {
      date: "17",
      month: "лип",
      time: "19:00",
      title: "Концерт гурту Без обмежень",
      category: "Музика",
      place: "Палац спорту, Київ",
      members: "+24",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600",
    },
    {
      date: "19",
      month: "лип",
      time: "10:00",
      title: "Ранкова йога у парку",
      category: "Спорт",
      place: "Парк Шевченка, Львів",
      members: "+18",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    },
    {
      date: "21",
      month: "лип",
      time: "14:00",
      title: "Майстер-клас з живопису",
      category: "Мистецтво",
      place: "Арт-студія, Одеса",
      members: "+12",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    },
    {
      date: "23",
      month: "лип",
      time: "18:30",
      title: "Tech Talk: Майбутнє штучного інтелекту",
      category: "Технології",
      place: "Простір, Дніпро",
      members: "+36",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    },
    {
      date: "25",
      month: "лип",
      time: "21:00",
      title: "Кіновечір просто неба",
      category: "Кіно",
      place: "Парк «Наталка», Київ",
      members: "+45",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
    },
  ];

  const smallEvents = [
    {
      date: "26 липня, 16:00",
      title: "Обговорення книги «Сила звички»",
      category: "Освіта",
      place: "Книгарня Сенс, Київ",
      members: "+15",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    },
    {
      date: "27 липня, 08:00",
      title: "Забіг 5 км у вашому місті",
      category: "Спорт",
      place: "Труханів острів, Київ",
      members: "+33",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400",
    },
    {
      date: "28 липня, 15:00",
      title: "Основи фотографії для початківців",
      category: "Освіта",
      place: "Креативний простір, Львів",
      members: "+9",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400",
    },
    {
      date: "30 липня, 19:00",
      title: "Вечір настільних ігор",
      category: "Ігри",
      place: "GameHub, Харків",
      members: "+22",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
  ];

  return (
    <div className="events-page">
      <div className="events-title">
        <h1>Рекомендовані події</h1>
        <p>Дібрано спеціально для вас на основі ваших інтересів та активності</p>
      </div>

      <div className="events-categories">
        {categories.map((category, index) => (
          <button
            className={activeCategory === index ? "active" : ""}
            key={category.name}
            onClick={() => setActiveCategory(index)}
          >
            {category.Icon && <category.Icon size={18} />}
            {category.name}
          </button>
        ))}
      </div>

      <section className="events-section">
        <div className="events-section-header">
          <h2>Топ події для вас</h2>
          <Link to="/events">Переглянути всі ›</Link>
        </div>

        <div className="scroll-shell">
          <button className="scroll-btn left" type="button" onClick={() => scrollSection(topEventsRef, -1)} aria-label="Scroll top events left">
            <ChevronLeft size={22} />
          </button>

        <div className="top-events-grid scroll-row" ref={topEventsRef}>
          {topEvents.map((event) => (
            <article className="top-event-card" key={event.title}>
              <div className="top-event-image">
                <img src={event.image} alt={event.title} />

                <div className="top-event-date">
                  <strong>{event.date}</strong>
                  <span>{event.month}</span>
                  <small>{event.time}</small>
                </div>

                <button className="bookmark" type="button" onClick={handlePlaceholderAction}>
                  <Heart size={24} />
                </button>
                <span className="image-time">{event.time}</span>
              </div>

              <div className="top-event-body">
                <h3>{event.title}</h3>
                <span className="tag">{event.category}</span>
                <p className="icon-text">
                  <MapPin size={16} />
                  {event.place}
                </p>

                <div className="event-members">
                  <div className="mini-avatars">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <b>{event.members}</b>
                </div>

                <button className="details-btn" type="button" onClick={handlePlaceholderAction}>Детальніше</button>
              </div>
            </article>
          ))}
        </div>

          <button className="scroll-btn right" type="button" onClick={() => scrollSection(topEventsRef, 1)} aria-label="Scroll top events right">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="events-section">
        <div className="events-section-header">
          <h2>Події, що можуть вас зацікавити</h2>
          <Link to="/events">Переглянути всі ›</Link>
        </div>

        <div className="scroll-shell">
          <button className="scroll-btn left" type="button" onClick={() => scrollSection(smallEventsRef, -1)} aria-label="Scroll interesting events left">
            <ChevronLeft size={22} />
          </button>

        <div className="small-events-grid scroll-row" ref={smallEventsRef}>
          {smallEvents.map((event) => (
            <article className="small-event-card" key={event.title}>
              <img src={event.image} alt={event.title} />

              <div className="small-event-info">
                <div className="small-date">{event.date}</div>
                <h3>{event.title}</h3>
                <span className="tag">{event.category}</span>
                <p className="icon-text">
                  <MapPin size={16} />
                  {event.place}
                </p>

                <div className="event-members">
                  <div className="mini-avatars">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <b>{event.members}</b>
                </div>
              </div>

              <button className="small-bookmark" type="button" onClick={handlePlaceholderAction}>
                <Heart size={22} />
              </button>
            </article>
          ))}
        </div>

          <button className="scroll-btn right" type="button" onClick={() => scrollSection(smallEventsRef, 1)} aria-label="Scroll interesting events right">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="events-benefits">
        <div>
          <span className="icon-btn">
            <User size={18} />
          </span>
          <div>
            <h3>Персональні рекомендації</h3>
            <p>Ми підбираємо події, які вам сподобаються</p>
          </div>
        </div>

        <div>
          <span className="icon-btn">
            <Users size={18} />
          </span>
          <div>
            <h3>Легко знайти друзів</h3>
            <p>Знаходьте людей зі схожими інтересами</p>
          </div>
        </div>

        <div>
          <span className="icon-btn">
            <Bell size={18} />
          </span>
          <div>
            <h3>Будьте в курсі</h3>
            <p>Отримуйте сповіщення про нові події та зміни</p>
          </div>
        </div>

        <div>
          <span className="icon-btn">
            <MessageSquare size={18} />
          </span>
          <div>
            <h3>Створюйте свої події</h3>
            <p>Діліться своїми ідеями та збирайте однодумців</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsPage;
