import {
  MapPin,
  UserPlus,
  MessageSquare,
  Music,
  Dumbbell,
  Laptop,
  GraduationCap,
  Palette,
  Users,
} from "lucide-react";

import "./PeoplePage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";

function PeoplePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState(0);

  const handleAddPerson = () => {
    // TODO: Connect add-person/follow action to the backend connections API.
    alert("Додавання людей буде доступне після підключення backend.");
  };

  const filters = [
    { name: "Усі", Icon: Users },
    { name: "Музика", Icon: Music },
    { name: "Спорт", Icon: Dumbbell },
    { name: "Технології", Icon: Laptop },
    { name: "Освіта", Icon: GraduationCap },
    { name: "Мистецтво", Icon: Palette },
  ];

  const people = [
    {
      name: user.fullName,
      city: user.location,
      interests: user.interests,
      bio: user.bio,
      avatar: user.initials,
    },
    {
      name: "Андрій Коваль",
      city: "Київ, Україна",
      interests: ["Технології", "Ігри", "AI"],
      bio: "Цікавлюсь стартапами, ІТ та технологічними подіями.",
      avatar: "А",
    },
    {
      name: "Софія Мельник",
      city: "Одеса, Україна",
      interests: ["Мистецтво", "Психологія", "Освіта"],
      bio: "Шукаю людей для спільних майстер-класів і лекцій.",
      avatar: "С",
    },
    {
      name: "Дмитро Шевченко",
      city: "Харків, Україна",
      interests: ["Спорт", "Біг", "Здоров’я"],
      bio: "Люблю активні події, забіги та командні тренування.",
      avatar: "Д",
    },
  ];

  return (
    <div className="people-page">
      <div className="people-header">
        <h1>Люди</h1>
        <p>
          Знаходьте людей зі схожими інтересами та створюйте нові знайомства
        </p>
      </div>

      <div className="people-filters">
        {filters.map(({ name, Icon }, index) => (
          <button
            key={name}
            className={activeFilter === index ? "active category-btn" : "category-btn"}
            type="button"
            onClick={() => setActiveFilter(index)}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}
      </div>

      <div className="people-grid">
        {people.map((person) => (
          <article className="person-card" key={person.name}>
            
           
            <div className="person-content">
              <div className="person-top">
                <div className="person-avatar">{person.avatar}</div>

                <div>
                  <h3>{person.name}</h3>

                  <p className="icon-text">
                    <MapPin size={16} />
                    {person.city}
                  </p>
                </div>
              </div>

              <p className="person-bio">{person.bio}</p>

              <div className="person-interests">
                {person.interests.map((interest) => (
                  <span key={interest}>{interest}</span>
                ))}
              </div>
            </div>

            
            <div className="person-actions">
              <button type="button" onClick={handleAddPerson}>
                <UserPlus size={16} />
                Додати
              </button>

              <button className="secondary" type="button" onClick={() => navigate("/messages")}>
                <MessageSquare size={16} />
                Написати
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PeoplePage;
