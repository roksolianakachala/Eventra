import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./ProfilePage.css";

function ProfileInterestsPage() {
  const navigate = useNavigate();

  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await apiRequest("/profile/interests/list");
        setInterests(data);
      } catch (error) {
        alert(error.message || "Не вдалося завантажити інтереси");
      }
    };

    fetchInterests();
  }, []);

  const toggleInterest = (interestId) => {
    setSelected((current) =>
      current.includes(interestId)
        ? current.filter((id) => id !== interestId)
        : [...current, interestId]
    );
  };

  const saveInterests = async () => {
    const auth = JSON.parse(localStorage.getItem("eventra_auth") || "{}");
    const token = auth?.token;

    if (!token) {
      alert("Немає токена");
      return;
    }

    await apiRequest("/profile/interests", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        interestIds: selected,
      }),
    });

    alert("Інтереси додано");
    navigate("/profile");
  };

  return (
    <div className="profile-page">
      <div className="profile-title">
        <h1>Оберіть інтереси</h1>
        <p>Виберіть теми, які вам цікаві</p>
      </div>

      <div className="interests-list">
        {interests.map((interest) => (
          <button
            key={interest.interestId}
            type="button"
            className={
              selected.includes(interest.interestId) ? "active-interest" : ""
            }
            onClick={() => toggleInterest(interest.interestId)}
          >
            {interest.name}
          </button>
        ))}
      </div>

      <div className="profile-actions">
        <button type="button" onClick={saveInterests}>
          Додати
        </button>

        <button
          className="cancel-btn"
          type="button"
          onClick={() => navigate("/profile")}
        >
          Скасувати
        </button>
      </div>
    </div>
  );
}

export default ProfileInterestsPage;