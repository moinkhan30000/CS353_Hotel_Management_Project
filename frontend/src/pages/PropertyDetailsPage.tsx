import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import oasisImage from '../assets/oasis.jpg';
import { api } from '../services/api';
import './PropertyDetailsPage.css';

interface HotelDetails {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
  rating: number;
  amenities: { name: string }[];
  images: { url: string }[];
  rooms: { id: number; name: string; room_type: string; capacity: number; quantity: number; price: string; amenities: { name: string }[] }[];
}

const PropertyDetailsPage = () => {
  const [roomCount, setRoomCount] = useState(1);
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [error, setError] = useState('');
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    api<HotelDetails>(`/hotels/${propertyId}/`)
      .then(setHotel)
      .catch(err => setError(err instanceof Error ? err.message : 'Unable to load property.'));
  }, [propertyId]);

  if (error) return <><Header /><main className="content"><p>{error}</p></main><Footer /></>;
  if (!hotel) return <><Header /><main className="content"><p>Loading property...</p></main><Footer /></>;

  const room = hotel.rooms[0];
  const image = hotel.images[0]?.url || oasisImage;
  const bookingQuery = new URLSearchParams({
    room: String(room?.id ?? ''),
    guests: String(roomCount),
    checkIn: searchParams.get('checkIn') ?? '',
    checkOut: searchParams.get('checkOut') ?? '',
  });

  return (
    <div className="property-details">
      <Header />
      <div className="hero-section">
        <div className="title-area">
          <div><h2>{hotel.name}</h2><span>{hotel.city}, {hotel.country}</span></div>
          <div className="rating-review">
            <div className="rating-badge styled-rating">{hotel.rating.toFixed(1)}/10</div>
            <button className="review-btn" onClick={() => navigate(`/reviews_view?hotel=${hotel.id}`)}>View Reviews</button>
          </div>
        </div>
        <div className="gallery">
          <img src={image} alt={hotel.name} className="main-img" />
          <div className="thumbnail-row">
            {(hotel.images.length ? hotel.images : [{ url: image }]).map((item, index) => <img key={index} src={item.url} alt={`${hotel.name} view ${index + 1}`} />)}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="left-column">
          <p className="description">{hotel.description}</p>
          <ul className="features-list">{hotel.amenities.map(item => <li key={item.name}>{item.name}</li>)}</ul>
          <div className="room-box">
            <h3>{room?.room_type || 'No rooms available'}</h3>
            <p>{room?.name}</p>
            <p>Guests: {room?.capacity ?? 0}</p>
            <p className="price">${Number(room?.price ?? 0).toLocaleString()}</p>
            <ul className="room-highlights"><li>Flexible booking dates</li><li>Secure wallet payment</li></ul>
            <div className="checkbox-features">
              {(room?.amenities ?? []).map(item => <label key={item.name}><input type="checkbox" checked readOnly /> {item.name}</label>)}
            </div>
            <div className="room-select">
              <label>Select Rooms: </label>
              <select value={roomCount} onChange={event => setRoomCount(Number(event.target.value))}>
                {Array.from({ length: Math.min(room?.quantity ?? 1, 5) }, (_, index) => index + 1).map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
            <button className="reserve-btn" disabled={!room} onClick={() => navigate(`/booking?${bookingQuery}`)}>Reserve</button>
          </div>
        </div>
        <div className="right-column">
          <div className="highlight-box">
            <h4>Property Highlights</h4>
            {hotel.amenities.map(item => <p key={item.name}><strong>{item.name}</strong></p>)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
