import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import heroImage from '../../assets/hero.jpg';

const HeroSection = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }
    // Navigate to /properties with location query param
    navigate(`/properties?search=${encodeURIComponent(location)}`);
  };

  // Set min date for check-in and check-out inputs
  const today = new Date().toISOString().split('T')[0];

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
        justifyContent: 'center',
        paddingBottom: '2rem',
      }}
    >
      <div className="search-box">
        <h1>Good Morning!</h1>
        <p>Book Hotels seamlessly from anywhere across the world</p>
        <div className="search-bar">
          <div className="field">
            <span className="icon" aria-label="Location">📍</span>
            <div>
              <label htmlFor="location-input">Location</label>
              <input
                id="location-input"
                type="text"
                placeholder="Add destination"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="icon" aria-label="Check in date">📅</span>
            <div>
              <label htmlFor="checkin-input">Check in</label>
              <input
                id="checkin-input"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="icon" aria-label="Check out date">📅</span>
            <div>
              <label htmlFor="checkout-input">Check out</label>
              <input
                id="checkout-input"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="icon" aria-label="Guests">👥</span>
            <div>
              <label htmlFor="guests-input">Guests</label>
              <input
                id="guests-input"
                type="number"
                min={1}
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          </div>
          <button className="search-btn" onClick={handleSearch} aria-label="Search hotels">
            🔍 Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
