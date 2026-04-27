import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users,
  GraduationCap,
  PlusSquare,
  Bookmark,
  MessageSquare,
  CircleUserRound,
  Settings,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    { to: "/", label: "Головна", icon: Home, end: true },
    { to: "/events", label: "Події", icon: CalendarDays },
    { to: "/people", label: "Люди", icon: Users },
    { to: "/tutors", label: "Репетитори", icon: GraduationCap },
    { to: "/create-event", label: "Створити подію", icon: PlusSquare },
    { to: "/saved", label: "Збережене", icon: Bookmark },
    { to: "/messages", label: "Повідомлення", icon: MessageSquare },
    { to: "/profile", label: "Профіль", icon: CircleUserRound },
    { to: "/settings", label: "Налаштування", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <h1 className="logo">Eventra</h1>

      <nav className="sidebar-nav">
        {menuItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <Icon size={21} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        <div className="card-icon">
          <Users size={36} />
        </div>

        <h3>Знайди людей і події за інтересами!</h3>
        <p>
          Приєднуйся до спільнот, відкривай нові події та знайомся з цікавими
          людьми.
        </p>
        <button>Приєднатися</button>
      </div>
    </aside>
  );
}

export default Sidebar;