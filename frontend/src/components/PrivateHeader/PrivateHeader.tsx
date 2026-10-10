import { useState } from 'react';
import { Link } from 'react-router-dom';
import { currentUser } from '../../services/api';
import './PrivateHeader.css';

interface PrivateHeaderProps {
  username: string;
  onLogout: () => void;
}

const PrivateHeader = ({ username, onLogout }: PrivateHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = currentUser();
  const dashboard = user?.role === 'manager' ? '/managerhoteldashboard' : user?.role === 'admin' ? '/admindashboard' : '/guest-dashboard';
  const profile = user?.role === 'manager' ? '/managerprofile' : user?.role === 'admin' ? '/admindashboard/profile' : '/guest-profile';
  const roleLinks = user?.role === 'manager'
    ? [
        { to: '/manage-bookings', label: 'Bookings' },
        { to: '/rooms', label: 'Rooms' },
        { to: '/edit-hotel-images', label: 'Hotel images' },
        { to: '/reviews', label: 'Guest reviews' },
      ]
    : user?.role === 'admin'
      ? [{ to: '/admindashboard/reports', label: 'Reports' }]
      : [
          { to: '/reservation-history', label: 'Reservations' },
          { to: '/payment-history', label: 'Payments' },
          { to: '/guest-topup', label: 'Wallet top-up' },
          { to: '/guest-reviews', label: 'My reviews' },
        ];

  return (
    <header className="nav private-nav">
      <Link to="/" className="logo">HORIZONSTAY</Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/properties">Stays</Link>
        <Link to="/contact">Contact</Link>
        <Link to={dashboard}>Dashboard</Link>
      </nav>
      <div
        className="user-info"
        tabIndex={0}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setDropdownOpen(!dropdownOpen);
        }}
        onBlur={() => setDropdownOpen(false)}
      >
        <span className="user-name">{username}<span className="account-chevron" aria-hidden="true" /></span>
        {dropdownOpen && (
          <div className="dropdown-content">
            <Link to={profile} onMouseDown={(event) => event.preventDefault()}>Profile</Link>
            <Link to={dashboard} onMouseDown={(event) => event.preventDefault()}>Dashboard</Link>
            <div className="dropdown-divider" />
            {roleLinks.map((link) => <Link key={link.to} to={link.to} onMouseDown={(event) => event.preventDefault()}>{link.label}</Link>)}
            <div className="dropdown-divider" />
            <button className="logout-button" onMouseDown={(event) => event.preventDefault()} onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default PrivateHeader;
