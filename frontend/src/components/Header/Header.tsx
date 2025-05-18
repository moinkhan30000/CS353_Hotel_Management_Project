import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  hideLogin?: boolean;
  hideRegister?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideLogin = false, hideRegister = false }) => {
  return (
    <header className="nav">
      <div className="logo">HORIZONSTAY</div>
      <nav>
        <Link to="/">Home</Link>
        {!hideLogin && <Link to="/login">Login</Link>}
        {!hideRegister && <Link to="/register">Register</Link>}
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
