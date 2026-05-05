import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../app/providers";
import "./HomePage.css";
import {
  CalendarDays, MapPin, Music, Dumbbell, GraduationCap, Laptop, Palette, Gamepad2, ChevronDown, ChevronLeft, ChevronRight, Heart,
} from "lucide-react";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const recommendedRef = useRef(null);

  const scrollRecommended = (direction) => {
    recommendedRef.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  };

  const handleSaveEvent = () => {
    // TODO: Connect saving recommended events to the backend saved-events API.
    alert("Збереження подій буде доступне після підключення backend.");
  };

  const categories = [
    { name: "Музика", icon: <Music size={18} /> },
    { name: "Спорт", icon: <Dumbbell size={18} /> },
    { name: "Освіта", icon: <GraduationCap size={18} /> },
    { name: "Технології", icon: <Laptop size={18} /> },
    { name: "Мистецтво", icon: <Palette size={18} /> },
    { name: "Ігри", icon: <Gamepad2 size={18} /> },
    { name: "Більше", icon: <ChevronDown size={18} /> },
  ];

  const events = [
    {
      date: "17\nлип",
      time: "19:00",
      title: "Концерт гурту Без обмежень",
      category: "Музика",
      place: "Палац спорту, Київ",
      members: "+24",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600",
    },
    {
      date: "19\nлип",
      time: "10:00",
      title: "Ранкова йога у парку",
      category: "Спорт",
      place: "Парк Шевченка, Львів",
      members: "+18",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    },
    {
      date: "21\nлип",
      time: "14:00",
      title: "Майстер-клас з живопису",
      category: "Мистецтво",
      place: "Арт-студія, Одеса",
      members: "+12",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    },
    {
      date: "23\nлип",
      time: "18:30",
      title: "Tech Talk: Майбутнє ШІ",
      category: "Технології",
      place: "Простір, Дніпро",
      members: "+36",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    },
    {
      date: "25\nлип",
      time: "21:00",
      title: "Кіновечір просто неба",
      category: "Кіно",
      place: "Парк «Наталка», Київ",
      members: "+45",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-text">
          <h1>
            Знайди людей <br /> і події за інтересами
          </h1>

          <p>
            Зустрічайся, спілкуйся, <br />
            відвідуй івенти разом
          </p>

          {!isAuthenticated && (
            <button onClick={() => navigate("/register")}>
              ПРИЄДНАТИСЯ ДО EVENTRA
            </button>
          )}
        </div>

        <div className="hero-image">
          <img src="/images/arkam-team.png" alt="Eventra community" />
        </div>
      </section>

      <section className="categories">
        {categories.map((cat) => (
          <button key={cat.name} className="category-btn" onClick={() => navigate("/events")}>
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </section>

      <section className="recommended">
        <div className="section-header">
          <h2>Рекомендовані події</h2>
          <Link to="/events">Переглянути всі ›</Link>
        </div>

        <div className="scroll-shell">
          <button className="scroll-btn left" type="button" onClick={() => scrollRecommended(-1)} aria-label="Scroll recommended events left">
            <ChevronLeft size={22} />
          </button>

        <div className="events-grid scroll-row" ref={recommendedRef}>
          {events.map((event) => (
            <div className="event-card" key={event.title}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />

                <div className="event-date">
                  <strong>{event.date.split("\n")[0]}</strong>
                  <span>{event.date.split("\n")[1]}</span>
                  <small>{event.time}</small>
                </div>

                <button className="save-icon" type="button" onClick={handleSaveEvent}>
                  <Heart size={24} />
                </button>
                <div className="event-time">{event.time}</div>
              </div>

              <div className="event-info">
                <h3>{event.title}</h3>
                <span className="event-category">{event.category}</span>
                <p className="icon-text">
                  <MapPin size={16} />
                  {event.place}
                </p>

                <div className="event-footer">
                  <div className="avatars">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <strong>{event.members}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

          <button className="scroll-btn right" type="button" onClick={() => scrollRecommended(1)} aria-label="Scroll recommended events right">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
