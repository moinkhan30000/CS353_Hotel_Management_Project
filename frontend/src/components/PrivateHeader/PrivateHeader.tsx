import { useState } from 'react';
import { Link } from 'react-router-dom';
import { currentUser } from '../../services/api';
import './PrivateHeader.css';

interface PrivateHeaderProps { username: string; onLogout: () => void }
const PrivateHeader = ({ username, onLogout }: PrivateHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = currentUser();
  const dashboard = user?.role === 'manager' ? '/managerhoteldashboard' : user?.role === 'admin' ? '/admindashboard' : '/guest-dashboard';
  return <header className="nav private-nav"><Link to="/" className="logo">HORIZONSTAY</Link><nav><Link to="/">Home</Link><Link to="/properties">Stays</Link><Link to="/contact">Contact</Link><Link to={dashboard}>Dashboard</Link></nav><div className="user-info" tabIndex={0} onClick={() => setDropdownOpen(!dropdownOpen)} onBlur={() => setDropdownOpen(false)}><span className="user-name">{username} <span aria-hidden="true">▾</span></span>{dropdownOpen && <div className="dropdown-content"><button className="logout-button" onMouseDown={event => event.preventDefault()} onClick={onLogout}>Logout</button></div>}</div></header>;
};
export default PrivateHeader;
