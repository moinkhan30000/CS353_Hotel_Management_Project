import { Link, NavLink } from 'react-router-dom';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import { currentUser, logout } from '../../services/api';
import './Header.css';

interface HeaderProps {
  hideLogin?: boolean;
  hideRegister?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideLogin = false, hideRegister = false }) => {
  const user = currentUser();

  if (user) {
    const username = `${user.first_name} ${user.last_name}`.trim() || user.email;
    return <PrivateHeader username={username} onLogout={() => { logout(); window.location.href = '/'; }} />;
  }

  return (
    <header className="nav">
      <Link to="/" className="logo">HORIZONSTAY</Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/properties">Stays</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {!hideLogin && <NavLink to="/login">Login</NavLink>}
        {!hideRegister && <Link className="nav-cta" to="/register">Register</Link>}
      </nav>
    </header>
  );
};

export default Header;
