import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../HotelCard/HotelCard';
import oasisImage from '../../assets/oasis.jpg';
import { api } from '../../services/api';
import './TopBookNow.css';

interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  images: { url: string }[];
  rooms: { price: string }[];
}

const TopBookNow = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Hotel[]>('/hotels/').then(setHotels).catch(() => setError('Hotels are temporarily unavailable.'));
  }, []);

  return <section className="top-hotels">
    <div className="section-heading"><div><span className="eyebrow">Guest favourites</span><h2>Top places to stay</h2></div><Link className="see-all" to="/properties">See all <span aria-hidden="true">→</span></Link></div>
    {error && <p className="section-message">{error}</p>}
    <div className="hotel-grid">{hotels.slice(0, 4).map(hotel => <HotelCard key={hotel.id} id={hotel.id} name={hotel.name} location={`${hotel.city}, ${hotel.country}`} price={hotel.rooms.length ? Math.min(...hotel.rooms.map(room => Number(room.price))) : 0} image={hotel.images[0]?.url || oasisImage} />)}</div>
    {!error && !hotels.length && <p className="section-message">Loading stays...</p>}
  </section>;
};

export default TopBookNow;
