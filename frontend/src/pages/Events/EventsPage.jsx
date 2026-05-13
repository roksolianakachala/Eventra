import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { MapPin, Bell, MessageSquare, Music, Dumbbell, GraduationCap, Laptop, Palette, Gamepad2, ChevronDown, ChevronLeft, ChevronRight, Users, User, Heart, } from "lucide-react"; 

import "./EventsPage.css"; 
import { eventService } from "../../services/eventService"; 

function EventsPage() { 
  const navigate = useNavigate(); 

  const [activeCategory, setActiveCategory] = useState(null); 
  const [events, setEvents] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);  
  const [date, setDate] = useState(''); 

  const topEventsRef = useRef(null);
  const smallEventsRef = useRef(null);

  const categories = [ 
      { name: "Музика", Icon: Music },
      { name: "Спорт", Icon: Dumbbell },
      { name: "Освіта", Icon: GraduationCap },
      { name: "Технології", Icon: Laptop },
      { name: "Мистецтво", Icon: Palette },
      { name: "Ігри", Icon: Gamepad2 },
      { name: "Більше", Icon: ChevronDown },
    ]; 

  useEffect(() => {
    const fetchEvents = async () => {
      try { 
        setIsLoading(true);
      
        const currentCategory = activeCategory !== null ? categories[activeCategory]?.name : null; 
        const params = { limit: 10, date: date };
      
        if (currentCategory && currentCategory !== "Усе") {
          params.category = currentCategory;
        }
        const response = await eventService.getEvents({ category: categories[activeCategory]?.name, date: date, limit: 10 }); 
        const eventsData = response.data; 
        setEvents(eventsData); 
      } catch (err) { 
        console.error("Помилка при завантаженні подій:", err);
      } finally {
        setIsLoading(false); 
      } 
    };

    fetchEvents();
  }, [activeCategory, date]); 

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

  const handleCategoryClick = (index) => {
    if (activeCategory === index) setActiveCategory(null); 
    else setActiveCategory(index); 
    
  }

  if (isLoading) {
    return <div className="events-page"><h2 style={{padding: "40px", textAlign: "center"}}>Завантаження подій...</h2></div>; 
  }  

  const topEvents = events.slice(0, 5); 
  const smallEvents = events.slice(5); 

  const formatDate = (isoString) => {
    if (!isoString) return { date: "", month: "", time: "", fullText: "" };
    const dateObj = new Date(isoString);
    return {
      date: dateObj.getDate(),
      month: dateObj.toLocaleString("uk-UA", { month: "short" }),
      time: dateObj.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
      fullText: dateObj.toLocaleString("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
    };
  }; 

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
            onClick={ () => handleCategoryClick(index) } 
          >
            {category.Icon && <category.Icon size={18} />} 
            {category.name}
          </button>
        ))}
      </div> 

      <div className="events-date"> 
        <input 
          type="date" 
          name="date" 
          placeholder="День події" 
          value={date} 
          onChange={ (e) => { setDate(e.target.value) } } 
        /> 
        {date && (
          <button className="reset-date" onClick={() => setDate('')}>
            Очистити
          </button>
        )}
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
          {topEvents.map((event) => { 
            const { date, month, time } = formatDate(event.start_time);

            return (
            <article className="top-event-card" key={event.id}>
              <div className="top-event-image">
                <img src={event.banner_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600"} alt={event.title} />

                <div className="top-event-date">
                  <strong>{date}</strong>
                  <span>{month}</span>
                  <small>{time}</small>
                </div>

                <button className="bookmark" type="button" onClick={handlePlaceholderAction}>
                  <Heart size={24} />
                </button>
                <span className="image-time">{time}</span>
              </div>

              <div className="top-event-body">
                <h3>{event.title}</h3>
                <span className="tag">{event.category}</span>
                <p className="icon-text">
                  <MapPin size={16} />
                  {event.location}
                </p>

                <div className="event-members">
                  <div className="mini-avatars">
                    <span></span><span></span><span></span>
                  </div> 
                  <b>{event.capacity ? `До ${event.capacity}` : "Безліміт"}</b>
                </div>

                <button className="details-btn" type="button" onClick={() => navigate(`/events/${event.id}`)}>Детальніше</button>
              </div>
            </article>
            );
          })}
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
              <img src={event.banner_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600"} alt={event.title} />

              <div className="small-event-info">
                <div className="small-date">{event.date}</div>
                <h3>{event.title}</h3>
                <span className="tag">{event.category}</span>
                <p className="icon-text">
                  <MapPin size={16} />
                  {event.location}
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
