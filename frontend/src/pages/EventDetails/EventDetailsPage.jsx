import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Users } from "lucide-react"; 

import { eventService } from "../../services/eventService"; 
import "./EventDetailsPage.css"; 

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await eventService.getEventById(id);
        setEvent(response.data || response); 
      } catch (err) {
        console.error("Помилка завантаження деталей:", err);
        setError("Не вдалося знайти подію");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (isLoading) return <div className="event-details-page loading"><h2 style={{textAlign: "center", padding: "40px"}}>Завантаження деталей...</h2></div>;
  if (error) return <div className="event-details-page error"><h2 style={{textAlign: "center", padding: "40px"}}>{error}</h2></div>;
  if (!event) return <div className="event-details-page error"><h2 style={{textAlign: "center", padding: "40px"}}>Подію не знайдено</h2></div>;

  const startDate = event.start_time ? new Date(event.start_time).toLocaleDateString("uk-UA", { day: 'numeric', month: 'long', year: 'numeric' }) : "";
  const startTime = event.start_time ? new Date(event.start_time).toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' }) : "";

  return (
    <div className="event-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>Назад до подій</span>
      </button>
      
      <div className="event-details-card">
        <div className="event-details-cover">
          <img 
            src={event.banner_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200"} 
            alt={event.title} 
          />
        </div>
        
        <div className="event-details-content">
          <div className="event-header">
            <span className="event-tag">{event.category}</span>
            <h1>{event.title}</h1>
          </div>
          
          <div className="event-meta-grid">
            <div className="meta-item">
              <div className="meta-icon"><MapPin size={20} /></div>
              <div className="meta-text">
                <strong>Локація</strong>
                <span>{event.location || "Не вказано"}</span>
              </div>
            </div>

            {startDate && (
              <div className="meta-item">
                <div className="meta-icon"><Calendar size={20} /></div>
                <div className="meta-text">
                  <strong>Дата</strong>
                  <span>{startDate}</span>
                </div>
              </div>
            )}

            {startTime && (
              <div className="meta-item">
                <div className="meta-icon"><Clock size={20} /></div>
                <div className="meta-text">
                  <strong>Час</strong>
                  <span>{startTime}</span>
                </div>
              </div>
            )}

            <div className="meta-item">
              <div className="meta-icon"><Users size={20} /></div>
              <div className="meta-text">
                <strong>Учасники</strong>
                <span>{event.capacity ? `До ${event.capacity} осіб` : "Безліміт"}</span>
              </div>
            </div>
          </div>

          <div className="event-description-box">
            <h2>Про подію</h2>
            <p>{event.description || "Організатор ще не додав опис до цієї події."}</p>
          </div>
          
          <div className="event-actions">
            <button className="join-btn">Приєднатися до події</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;