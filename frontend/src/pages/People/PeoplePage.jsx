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

function PeoplePage() {
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
      name: "Марія Іваненко",
      city: "Львів, Україна",
      interests: ["Музика", "Подорожі", "Книги"],
      bio: "Люблю події, нові знайомства та творчі зустрічі.",
      avatar: "М",
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
            className={index === 0 ? "active category-btn" : "category-btn"}
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
              <button>
                <UserPlus size={16} />
                Додати
              </button>

              <button className="secondary">
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