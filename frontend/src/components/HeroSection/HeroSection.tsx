import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero.jpg';
import './HeroSection.css';

const HeroSection = () => {
  const [location, setLocation] = useState(''); const [checkIn, setCheckIn] = useState(''); const [checkOut, setCheckOut] = useState(''); const [guests, setGuests] = useState('1'); const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const handleSearch = () => { if (!location.trim()) return document.getElementById('location-input')?.focus(); const query = new URLSearchParams({ search: location, checkIn, checkOut, guests }); navigate(`/properties?${query}`); };
  return <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8, 28, 38, .78), rgba(8, 28, 38, .12)), url(${heroImage})` }}><div className="hero-copy"><span className="eyebrow light">Find your next stay</span><h1>Stay somewhere<br />worth remembering.</h1><p>Hand-picked hotels, straightforward booking, and everything you need in one place.</p></div><div className="search-box"><div className="search-bar"><div className="field"><span className="icon">⌖</span><div><label htmlFor="location-input">Where</label><input id="location-input" placeholder="City or hotel" value={location} onChange={event => setLocation(event.target.value)} /></div></div><div className="field"><span className="icon">◫</span><div><label htmlFor="checkin-input">Check in</label><input id="checkin-input" type="date" min={today} value={checkIn} onChange={event => setCheckIn(event.target.value)} /></div></div><div className="field"><span className="icon">◫</span><div><label htmlFor="checkout-input">Check out</label><input id="checkout-input" type="date" min={checkIn || today} value={checkOut} onChange={event => setCheckOut(event.target.value)} /></div></div><div className="field"><span className="icon">◎</span><div><label htmlFor="guests-input">Guests</label><input id="guests-input" type="number" min="1" value={guests} onChange={event => setGuests(event.target.value)} /></div></div><button className="search-btn" onClick={handleSearch}>Search stays</button></div></div></section>;
};
export default HeroSection;
