import { Users, Bell, MessageSquare, Search, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/providers";
import "./Header.css";

function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };


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
            {user.avatarUrl ? (
              <img className="avatar" src={user.avatarUrl} alt={user.fullName} />
            ) : (
              <div className="avatar">{user.initials}</div>
            )}
            
            <span>{user.fullName}</span>
            <ChevronDown size={18} />
          </Link>
          
          <button className="header-auth-actions" type="button" onClick={handleLogout}>
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
