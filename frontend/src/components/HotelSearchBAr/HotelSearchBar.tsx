import { useState, useEffect } from 'react';
import './HotelSearchBar.css'; // You can copy the styles from HeroSection.css and modify

interface HotelSearchBarProps {
  initialLocation?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  onSearch?: (location: string, checkIn: string, checkOut: string, guests: string) => void;
}

const HotelSearchBar: React.FC<HotelSearchBarProps> = ({
  initialLocation = '',
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = '',
  onSearch = () => {},
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  useEffect(() => {
    setLocation(initialLocation);
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setGuests(initialGuests);
  }, [initialLocation, initialCheckIn, initialCheckOut, initialGuests]);

  const handleSearch = () => {
    onSearch(location, checkIn, checkOut, guests);
  };

  return (
    <div className="hotel-search-bar">
      <div className="field">
        <label>Location</label>
        <input
          type="text"
          placeholder="Add destination"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Check in</label>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
      </div>
      <div className="field">
        <label>Check out</label>
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
      </div>
      <div className="field">
        <label>Guests</label>
        <input
          type="number"
          min="1"
          placeholder="Add guests"
          value={guests}
          onChange={e => setGuests(e.target.value)}
        />
      </div>
      <button className="search-btn" onClick={handleSearch}>
        🔍 Search
      </button>
    </div>
  );
};

export default HotelSearchBar;
