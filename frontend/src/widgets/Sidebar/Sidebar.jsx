import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users,
  GraduationCap,
  PlusSquare,
  Bookmark,
  CircleUserRound,
  Settings,
  X,
} from "lucide-react";

import { useAuth } from "../../app/providers";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();
  const menuItems = [
    { to: "/", label: "Головна", icon: Home, end: true },
    { to: "/events", label: "Події", icon: CalendarDays },
    { to: "/tutors", label: "Репетитори", icon: GraduationCap },
    { to: "/create-event", label: "Створити подію", icon: PlusSquare },
    { to: "/saved", label: "Збережене", icon: Bookmark },
    { to: "/profile", label: "Профіль", icon: CircleUserRound },
    { to: "/settings", label: "Налаштування", icon: Settings },
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <div className="sidebar-header">
          <h1 className="logo">Eventra</h1>
          <button className="sidebar-close-btn" type="button" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}>
              <Icon size={21} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {!isAuthenticated && <div className="sidebar-card">
          <div className="card-icon">
            <Users size={36} />
          </div>

        <h3>Знайди людей і події за інтересами!</h3>
        <p>
          Приєднуйся до спільнот, відкривай нові події та знайомся з цікавими
          людьми.
        </p>
          <NavLink to="/register" onClick={onClose}>
            <button type="button">Приєднатися</button>
          </NavLink>
        </div>}
      </aside>
    </>
  );
}

export default Sidebar;
