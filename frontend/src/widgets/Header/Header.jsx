import { Users, Bell, MessageSquare, Search, ChevronDown } from "lucide-react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="search">
        <Search size={20} />
        <input placeholder="Пошук людей і подій за інтересами" />
      </div>

      <div className="header-actions">
        <button className="header-icon-btn">
          <Users size={22} />
        </button>

        <button className="header-icon-btn">
          <Bell size={22} />
        </button>

        <button className="header-icon-btn">
          <MessageSquare size={22} />
        </button>

        <div className="user">
          <div className="avatar">М</div>
          <span>Марія Іваненко</span>
          <ChevronDown size={18} />
        </div>
      </div>
    </header>
  );
}

export default Header;