import './Header.css';

const Header = () => {
  return (
    <header className="nav">
      <div className="logo">HORIZONSTAY</div>
      <nav>
        <a href="#">Home</a>
        <a href="#">Hotels</a>
        <a href="#">Login</a>
        <a href="#">Register</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
