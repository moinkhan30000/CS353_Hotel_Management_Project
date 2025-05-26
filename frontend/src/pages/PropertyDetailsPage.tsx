import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './PropertyDetailsPage.css';

const sampleRoom = {
  name: 'The Oasis',
  location: 'Rio de Janeiro, Brazil',
  rating: 9.0,
  description: `Atlantica Golden Beach Hotel - Adults Only has a restaurant, bar, a shared lounge and garden in Paphos City. With free WiFi, this 4-star hotel offers a private beach area and a concierge service. The hotel features an outdoor swimming pool, fitness center, evening entertainment and a 24-hour front desk...`,
  features: [
    '2 swimming pools',
    'Free parking',
    'Free Wifi',
    'Non-smoking rooms',
    'Spa',
    'Fitness center',
    'Tea/Coffee Maker in All Rooms',
    'Bar',
    'Private beach area',
    'Very Good Breakfast',
  ],
  highlights: {
    breakfast: 'Very good Breakfast',
    swimmingPool: 'Private, Shallow end, Indoor swimming pool, Outdoor swimming pool',
    parking: 'Free parking, On-site parking, Accessible',
  },
  room: {
    type: 'Twin Room',
    beds: '2 Twin beds',
    guests: 2,
    price: 10000,
    highlights: [
      'Very good breakfast included',
      'Flexible to reschedule if plans change',
      'Non-refundable',
      'Pay online'
    ],
    features: ['Wifi', 'Mini Bar', 'Extra Toiletries', 'Coffee/Tea Maker', 'Streaming Services']
  }
};

const PropertyDetailsPage = () => {
  const [roomCount, setRoomCount] = useState(1);
  const navigate = useNavigate(); // ✅ Moved here inside the component

  return (
    <div className="property-details">
      <Header />
      <div className="hero-section">
        <div className="title-area">
          <div>
            <h2>{sampleRoom.name}</h2>
            <span>{sampleRoom.location}</span>
          </div>
          <div className="rating-review">
            <div className="rating-badge styled-rating">{sampleRoom.rating}/10</div>
            <button className="review-btn" onClick={() => navigate('/reviews_view')}>View Reviews</button>
          </div>
        </div>
        <div className="gallery">
          <img src="https://source.unsplash.com/600x400/?hotel,resort" alt="Main view" className="main-img" />
          <div className="thumbnail-row">
            {[...Array(6)].map((_, i) => (
              <img key={i} src={`https://source.unsplash.com/100x100/?room,view&sig=${i}`} alt={`thumb-${i}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="left-column">
          <p className="description">{sampleRoom.description}</p>
          <ul className="features-list">
            {sampleRoom.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>

          <div className="room-box">
            <h3>{sampleRoom.room.type}</h3>
            <p>{sampleRoom.room.beds}</p>
            <p>Guests: {sampleRoom.room.guests}</p>
            <p className="price">${sampleRoom.room.price.toLocaleString()}</p>
            <ul className="room-highlights">
              {sampleRoom.room.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <div className="checkbox-features">
              {sampleRoom.room.features.map((feature, i) => (
                <label key={i}>
                  <input type="checkbox" /> {feature}
                </label>
              ))}
            </div>
            <div className="room-select">
              <label>Select Rooms: </label>
              <select value={roomCount} onChange={(e) => setRoomCount(+e.target.value)}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
<button
  className="reserve-btn"
  onClick={() => navigate('/booking')}
>
  Reserve
</button>
          </div>
        </div>

        <div className="right-column">
          <div className="highlight-box">
            <h4>Property Highlights</h4>
            <p><strong>Breakfast Available:</strong> {sampleRoom.highlights.breakfast}</p>
            <p><strong>Swimming Pool:</strong> {sampleRoom.highlights.swimmingPool}</p>
            <p><strong>Parking:</strong> {sampleRoom.highlights.parking}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
