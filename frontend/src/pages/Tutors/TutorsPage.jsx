import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, MapPin, Star, X } from "lucide-react";
import { apiRequest } from "../../services/api";
import "./TutorsPage.css";



function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedTutor, setSelectedTutor] = useState(null);


  useEffect(() => {
  const fetchTutors = async () => { 
    try {
      const data = await apiRequest("/tutor");

      const normalized = data.map((item) => ({
        id: item.id,
        name: `${item.profiles?.first_name || ""} ${item.profiles?.last_name || ""}`.trim() || "Репетитор Eventra",
        subject: item.subject,
        rating: item.rating || 0,
        reviews: 0,
        location: item.city || item.profiles?.location || "Місто не вказано",
        experience: item.experience_years
          ? `${item.experience_years} років досвіду`
          : "Досвід не вказано",
        about: item.bio || "Опис ще не додано.",
        price: item.price_per_hour,
        avatarUrl: item.profiles?.avatar_url,
      }));

      setTutors(normalized);
    } catch (error) {
      console.error(error);
      alert("Помилка при завантаженні репетиторів");
    } finally {
      setLoading(false);
    }
  };

  fetchTutors();
  }, []);

  const handleContactTutor = () => {
    // TODO: Connect tutor contact requests to backend messaging/booking flow.
    navigate("/messages");
  };

  const handleSelectTutor = (tutor) => {
    setSelectedTutor((current) => (current?.id === tutor.id ? null : tutor));
  };

  return (
    <div className="tutors-page">
      {selectedTutor && (
        <section className="tutors-right" aria-label="Tutor details">
          <button
            className="tutor-close-btn"
            type="button"
            onClick={() => setSelectedTutor(null)}
            aria-label="Close tutor details"
          >
            <X size={20} />
          </button>

          <div className="tutor-details">
            <div className="tutor-header">
              <div className="avatar big">
                {selectedTutor.avatarUrl ? (
                  <img src={selectedTutor.avatarUrl} alt={selectedTutor.name} />
                ) : (
                  <GraduationCap size={42} />
                )}
              </div>

              <span className="subject">{selectedTutor.subject}</span>

              <h2>{selectedTutor.name}</h2>

              <p>
                <Star size={18} /> {selectedTutor.rating} ({selectedTutor.reviews} відгуків)
              </p>

              <p>
                <MapPin size={18} /> {selectedTutor.location}
              </p>
            </div>

            <div className="tutor-section">
              <h3>Про себе</h3>
              <p>{selectedTutor.about}</p>
            </div>

            <div className="tutor-section">
              <h3>Досвід роботи</h3>
              <p>{selectedTutor.experience}</p>
            </div>

            <button className="contact-btn" type="button" onClick={handleContactTutor}>
              Зв'язатися
            </button>
          </div>
        </section>
      )}

      <section className="tutors-left">
        <div className="tutors-heading">
          <h1>Репетитори</h1>
          <p>Знайдіть досвідченого репетитора для досягнення ваших цілей</p>

          <button className="add-tutor-btn" type="button" onClick={() => navigate("/become-tutor")}>
            + Додати себе як репетитора
          </button>
        </div>

        <div className="tutor-list" aria-label="Recommended tutors">
          {tutors.map((tutor) => (
            <button
              key={tutor.id}
              className={`tutor-card ${selectedTutor?.id === tutor.id ? "active" : ""}`}
              type="button"
              onClick={() => handleSelectTutor(tutor)}
            >
              <div className="avatar">
                {tutor.avatarUrl ? (
                  <img src={tutor.avatarUrl} alt={tutor.name} />
                ) : (
                  <GraduationCap size={28} />
                )}
              </div>

              <div>
                <h3>{tutor.name}</h3>
                <p>{tutor.subject}</p>
                <span>
                  <Star size={16} /> {tutor.rating} ({tutor.reviews} відгуків)
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TutorsPage;
