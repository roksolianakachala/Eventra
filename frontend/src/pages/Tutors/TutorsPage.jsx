import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, MapPin, Star, X } from "lucide-react";
import "./TutorsPage.css";

const tutors = [
  {
    id: "math-oleksandr",
    name: "Олександр Іваненко",
    subject: "Математика",
    rating: 4.9,
    reviews: 128,
    location: "Львів, Україна",
    experience: "8 років викладання математики",
    about:
      "Маю 8 років досвіду викладання математики для учнів 5-11 класів та підготовки до ЗНО/НМТ.",
  },
  {
    id: "english-anastasiia",
    name: "Анастасія Лисенко",
    subject: "Англійська мова",
    rating: 4.9,
    reviews: 128,
    location: "Київ, Україна",
    experience: "5 років досвіду викладання англійської мови",
    about:
      "Допомагаю учням впевнено говорити англійською, підтягнути граматику та підготуватися до іспитів.",
  },
  {
    id: "physics-dmytro",
    name: "Дмитро Коваль",
    subject: "Фізика",
    rating: 4.9,
    reviews: 128,
    location: "Одеса, Україна",
    experience: "6 років роботи з учнями та студентами",
    about:
      "Пояснюю фізику через практичні приклади, задачі та зрозумілу логіку розв'язання.",
  },
  {
    id: "chemistry-ihor",
    name: "Ігор Петренко",
    subject: "Хімія",
    rating: 4.9,
    reviews: 128,
    location: "Харків, Україна",
    experience: "7 років підготовки до контрольних, НМТ та олімпіад",
    about:
      "Працюю з базовими темами та складними задачами, допомагаю систематизувати знання з хімії.",
  },
];

function TutorsPage() {
  const navigate = useNavigate();
  const [selectedTutor, setSelectedTutor] = useState(null);

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
                <GraduationCap size={42} />
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
                <GraduationCap size={28} />
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
