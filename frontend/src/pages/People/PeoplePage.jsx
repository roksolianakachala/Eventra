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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findOrCreateChat } from "../../services/chatService";
import { fetchPublicProfiles } from "../../services/profileService";

function PeoplePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(0);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messagingPersonId, setMessagingPersonId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filters = [
    { name: "Усі", Icon: Users },
    { name: "Музика", Icon: Music },
    { name: "Спорт", Icon: Dumbbell },
    { name: "Технології", Icon: Laptop },
    { name: "Освіта", Icon: GraduationCap },
    { name: "Мистецтво", Icon: Palette },
  ];

  useEffect(() => {
    const loadPeople = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const profiles = await fetchPublicProfiles();
        setPeople(Array.isArray(profiles) ? profiles : []);
      } catch (error) {
        setErrorMessage(error.message || "Не вдалося завантажити людей.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPeople();
  }, []);

  const filteredPeople = useMemo(() => {
    const selectedFilter = filters[activeFilter]?.name;

    if (!selectedFilter || selectedFilter === "Усі") {
      return people;
    }

    return people.filter((person) =>
      Array.isArray(person.interests) && person.interests.includes(selectedFilter)
    );
  }, [activeFilter, people]);

  const handleAddPerson = () => {
    alert("Додавання людей буде доступне після підключення backend.");
  };

  const handleMessagePerson = async (person) => {
    if (messagingPersonId) return;

    try {
      setMessagingPersonId(person.id);
      const chat = await findOrCreateChat(person.id);
      navigate("/messages", { state: { chatId: chat.id } });
    } catch (error) {
      alert(error.message || "Не вдалося створити чат.");
    } finally {
      setMessagingPersonId(null);
    }
  };

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

      {errorMessage && <p className="people-message error">{errorMessage}</p>}
      {isLoading && <p className="people-message">Завантаження людей...</p>}

      {!isLoading && filteredPeople.length === 0 && !errorMessage && (
        <p className="people-message">Поки немає профілів для цього фільтра.</p>
      )}

      <div className="people-grid">
        {filteredPeople.map((person) => (
          <article className="person-card" key={person.id}>
            <div className="person-content">
              <div className="person-top">
                {person.avatarUrl ? (
                  <img className="person-avatar" src={person.avatarUrl} alt={person.name} />
                ) : (
                  <div className="person-avatar">{person.avatar}</div>
                )}

                <div>
                  <h3>{person.name}</h3>

                  <p className="icon-text">
                    <MapPin size={16} />
                    {person.location || "Локацію не вказано"}
                  </p>
                </div>
              </div>

              <p className="person-bio">{person.bio}</p>

              <div className="person-interests">
                {Array.isArray(person.interests) && person.interests.length > 0 ? (
                  person.interests.map((interest) => (
                    <span key={interest}>{interest}</span>
                  ))
                ) : (
                  <span>Інтереси не вказано</span>
                )}
              </div>
              
            </div>

            <div className="person-actions">
              <button type="button" onClick={handleAddPerson}>
                <UserPlus size={16} />
                Додати
              </button>

              <button
                className="secondary"
                type="button"
                onClick={() => handleMessagePerson(person)}
                disabled={messagingPersonId === person.id}
              >
                <MessageSquare size={16} />
                {messagingPersonId === person.id ? "Відкриваємо..." : "Написати"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PeoplePage;
