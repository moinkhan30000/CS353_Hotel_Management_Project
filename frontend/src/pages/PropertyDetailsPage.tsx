import { useState } from 'react';
import Header from '../components/Header/Header';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader';
import Footer from '../components/Footer/Footer';
import './PropertyDetailsPage.css';

interface RoomFeature {
  id: number;
  label: string;
}

interface RoomType {
  id: number;
  name: string;
  bedsDescription: string;
  guests: number;
  price: number;
  highlights: string[];
  features: RoomFeature[];
}

const sampleFeatures: RoomFeature[] = [
  { id: 1, label: 'Wifi' },
  { id: 2, label: 'Mini Bar' },
  { id: 3, label: 'Extra Toiletries' },
  { id: 4, label: 'Coffee/Tea Maker' },
  { id: 5, label: 'Streaming Services' },
];

const sampleRoomTypes: RoomType[] = [
  {
    id: 1,
    name: 'Twin Room',
    bedsDescription: '2 Twin beds',
    guests: 2,
    price: 10000,
    highlights: [
      'Very good breakfast included',
      'Flexible to reschedule if plans change',
      'Non-refundable',
      'Pay online',
    ],
    features: sampleFeatures,
  },
];

const PropertyDetailPage = () => {
  const [isLoggedIn] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [selectedRoomCount, setSelectedRoomCount] = useState(1);

  const toggleFeature = (featureId: number) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]
    );
  };

  const incrementRoomCount = () => setSelectedRoomCount(prev => prev + 1);
  const decrementRoomCount = () => setSelectedRoomCount(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      {isLoggedIn ? <PrivateHeader username="Moin Khan" onLogout={() => {}} /> : <Header />}

      <main className="property-detail-wrapper">
        <div className="property-banner">
          <h1>The Oasis</h1>
          <p>Rio de Janeiro, Brazil</p>
          <p className="rating">Wonderful 9.0</p>
          <button className="btn view-reviews">View Reviews</button>
        </div>

        <div className="gallery">
          <img src="/assets/oasis.jpg" alt="Main View" className="main-img" />
          <div className="thumbs">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <img key={i} src="/assets/oasis.jpg" alt={`Thumb ${i + 1}`} />
              ))}
          </div>
        </div>

        <section className="info-description">
          <div className="description">
            <p>
              Atlantica Golden Beach Hotel offers luxurious accommodations with a private beach,
              modern amenities, and scenic views. Guests can enjoy outdoor pools, fitness centers,
              and exquisite dining experiences.
            </p>
            <ul>
              <li>2 swimming pools</li>
              <li>Free parking</li>
              <li>Free Wifi</li>
              <li>Non-smoking rooms</li>
              <li>Spa</li>
              <li>Fitness center</li>
              <li>Tea/Coffee Maker in All Rooms</li>
              <li>Private beach area</li>
              <li>Very Good Breakfast</li>
            </ul>
          </div>

          <aside className="highlights">
            <h3>Property Highlights</h3>
            <ul>
              <li><strong>Breakfast:</strong> Very good Breakfast</li>
              <li><strong>Swimming Pool:</strong> Private, Indoor & Outdoor</li>
              <li><strong>Parking:</strong> Free & Accessible</li>
            </ul>
            <button className="btn reserve">Reserve</button>
          </aside>
        </section>

        <section className="room-section">
          <table>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Guests</th>
                <th>Price</th>
                <th>Highlights</th>
                <th>Rooms</th>
              </tr>
            </thead>
            <tbody>
              {sampleRoomTypes.map(room => (
                <tr key={room.id}>
                  <td>
                    <strong>{room.name}</strong>
                    <br />
                    <span>{room.bedsDescription}</span>
                    <div className="features">
                      {room.features.map(f => (
                        <label key={f.id}>
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(f.id)}
                            onChange={() => toggleFeature(f.id)}
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td>👤 x{room.guests}</td>
                  <td>${room.price.toLocaleString()}</td>
                  <td>
                    <ul>
                      {room.highlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="room-count">
                    <button onClick={decrementRoomCount}>-</button>
                    <span>{selectedRoomCount}</span>
                    <button onClick={incrementRoomCount}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PropertyDetailPage;
