import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorsPage.css";
import { Star, MapPin } from "lucide-react";
import "./TutorsPage.css";

function TutorsPage() {
  const navigate = useNavigate();
  const tutors = [
    {
      name: "Олександр Іваненко",
      subject: "Математика",
      rating: 4.9,
      reviews: 128,
      location: "Львів, Україна",
      experience: "8 років викладання математики",
      about:
        "Маю 8 років досвіду викладання математики для учнів 5–11 класів та підготовки до ЗНО/НМТ.",
    },
    {
      name: "Олександр Іваненко",
      subject: "Англійська мова",
      rating: 4.9,
      reviews: 128,
      location: "Львів, Україна",
      experience: "5 років досвіду викладання англійської мови",
      about:
        "Маю 5 років досвіду викладання англійської мови для учнів 5–11 класів та підготовки до ЗНО/НМT.",
    },
    {
      name: "Олександр Іваненко",
      subject: "Фізика",
      rating: 4.9,
      reviews: 128,
    },
    {
      name: "Олександр Іваненко",
      subject: "Хімія",
      rating: 4.9,
      reviews: 128,
    },
  ];

  const [selectedTutor, setSelectedTutor] = useState(tutors[0]);

  return (
    <div className="tutors-page">
      {/* LEFT */}
      <div className="tutors-left">
        <div className="tutors-heading">
          <h1>Репетитори</h1>
          <p>
            Знайдіть досвідченого репетитора для досягнення ваших цілей
          </p>

          <button className="add-tutor-btn" onClick={() => navigate("/become-tutor")}>
            + Додати себе як репетитора
          </button>
        </div>

        <div className="tutor-list">
          {tutors.map((tutor, index) => (
            <div
              key={index}
              className={`tutor-card ${selectedTutor === tutor ? "active" : ""
                }`}
              onClick={() => setSelectedTutor(tutor)}
            >
              <div className="avatar">👨‍🏫</div>

              <div>
                <h3>{tutor.name}</h3>
                <p>{tutor.subject}</p>
                <span>
                 <Star /> {tutor.rating} ({tutor.reviews} відгуків)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="tutors-right">
        <div className="tutor-details">
          <div className="tutor-header">
            <div className="avatar big">👨‍🏫</div>

            <span className="subject">{selectedTutor.subject}</span>

            <h2>{selectedTutor.name}</h2>

            <p>
              <Star /> {selectedTutor.rating} ({selectedTutor.reviews} відгуків)
            </p>

            <p><MapPin /> {selectedTutor.location}</p>
          </div>

          <div className="tutor-section">
            <h3>Про себе</h3>
            <p>{selectedTutor.about}</p>
          </div>

          <div className="tutor-section">
            <h3>Досвід роботи</h3>
            <p>{selectedTutor.experience}</p>
          </div>

          <button className="contact-btn">Зв’язатися</button>
        </div>
      </div>
    </div>
  );
}

export default TutorsPage;