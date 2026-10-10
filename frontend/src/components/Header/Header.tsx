import { Link, NavLink } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  hideLogin?: boolean;
  hideRegister?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideLogin = false, hideRegister = false }) => {
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
