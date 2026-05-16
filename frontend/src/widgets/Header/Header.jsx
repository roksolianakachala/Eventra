import { Users, Bell, MessageSquare, Search, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/providers";
import { useEffect, useState } from "react";
import "./Header.css";

function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
  logoutUser();
  navigate("/login");
};

useEffect(() => {
  const fetchProfile = async () => {
    const auth = JSON.parse(localStorage.getItem("eventra_auth") || "{}");
    const token = auth?.token;

    if (!token) return;

    const res = await fetch("https://eventra-j1tj.onrender.com/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProfile(data);
  };

  if (isAuthenticated) {
    fetchProfile();
  }
}, [isAuthenticated]);


  const handleNotificationsClick = () => {
    // TODO: Connect notifications to the backend notifications API.
    alert("Сповіщення будуть доступні після підключення backend.");
  };

  return (
    <header className="header">
      <button className="menu-btn" type="button" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={24} />
      </button>

      <div className="search">
        <Search size={20} />
        <input placeholder="Пошук людей і подій за інтересами" />
      </div>

      <div className="header-actions">
        <Link className="header-icon-btn" to="/people" aria-label="Open people">
          <Users size={22} />
        </Link>

        <button className="header-icon-btn" type="button" onClick={handleNotificationsClick}>
          <Bell size={22} />
        </button>

        <Link className="header-icon-btn" to="/messages" aria-label="Open messages">
          <MessageSquare size={22} />
        </Link>

        {isAuthenticated ? (
          <>
          <Link className="user" to="/profile" aria-label="Open my profile">
            {profile?.avatar_url || user.avatarUrl || user.avatar_url ? (
              <img className="avatar" src={profile?.avatar_url || user.avatarUrl || user.avatar_url} alt={user.fullName}/>
            ) : (
              <div className="avatar">{user.initials}</div>
            )}
            
            <span>{user.fullName}</span>
            <ChevronDown size={18} />
          </Link>
          
          <button className="logout-btn" type="button" onClick={handleLogout}>
            Вийти
          </button>
        </>
        ) : (
          <div className="header-auth-actions">
            <Link to="/login">Увійти</Link>
            <Link to="/register">Реєстрація</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
