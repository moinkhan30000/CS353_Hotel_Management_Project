import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PrivateHeader.css';

interface PrivateHeaderProps {
  username: string;
  onLogout: () => void;
}

const PrivateHeader: React.FC<PrivateHeaderProps> = ({ username, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="nav private-nav">
      <div className="logo">HORIZONSTAY</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <div
        className="user-info"
        tabIndex={0}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onBlur={() => setDropdownOpen(false)}
      >
        <span className="user-name">{username} ▼</span>
        {dropdownOpen && (
          <div className="dropdown-content">
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default PrivateHeader;
