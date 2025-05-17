import './HeroSection.css';
import heroImage from '../../assets/hero.jpg';

const HeroSection = () => {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      <div className="search-box">
        <h1>Good Morning!</h1>
        <p>Book Hotels seamlessly from anywhere across the world</p>
        <div className="search-bar">
          <div className="field">
            <span className="icon">📍</span>
            <div>
              <label>Location</label>
              <input type="text" placeholder="Add destination" />
            </div>
          </div>
          <div className="field">
            <span className="icon">📅</span>
            <div>
              <label>Check in</label>
              <input type="date" />
            </div>
          </div>
          <div className="field">
            <span className="icon">📅</span>
            <div>
              <label>Check out</label>
              <input type="date" />
            </div>
          </div>
          <div className="field">
            <span className="icon">👥</span>
            <div>
              <label>Guests</label>
              <input type="text" placeholder="Add guests" />
            </div>
          </div>
          <button className="search-btn">🔍</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
