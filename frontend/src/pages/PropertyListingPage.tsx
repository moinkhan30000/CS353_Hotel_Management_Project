import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader';
import Footer from '../components/Footer/Footer';
import './PropertyListingPage.css';

const propertiesData = [
  {
    id: 1,
    name: 'The Oasis',
    location: 'Rio de Janeiro, Brazil',
    rating: 9.0,
    price: 10000,
    imageUrl: '/src/assets/oasis.jpg',
  },
  // Add more properties as needed
];

const PropertyListingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [location, setLocation] = useState('Rio de Janeiro');
  const [checkIn, setCheckIn] = useState('2025-06-20');
  const [checkOut, setCheckOut] = useState('2025-06-25');
  const [guests, setGuests] = useState('2');

  const [budgetFilter, setBudgetFilter] = useState<number | null>(2000);
  const [ratingFilter, setRatingFilter] = useState<number | null>(9);

  const filteredProperties = propertiesData.filter(property => {
    let budgetMatch = true;
    if (budgetFilter === 2000) {
      budgetMatch = property.price >= 2000 && property.price <= 10000;
    } else if (budgetFilter === 10000) {
      budgetMatch = property.price > 10000 && property.price <= 20000;
    } else if (budgetFilter === 20000) {
      budgetMatch = property.price > 20000 && property.price <= 40000;
    }

    let ratingMatch = true;
    if (ratingFilter === 9) {
      ratingMatch = property.rating >= 9;
    } else if (ratingFilter === 5) {
      ratingMatch = property.rating >= 5 && property.rating < 9;
    } else if (ratingFilter === 4) {
      ratingMatch = property.rating < 4;
    }

    const locationMatch = location
      ? property.location.toLowerCase().includes(location.toLowerCase())
      : true;

    return budgetMatch && ratingMatch && locationMatch;
  });

  const handleSearch = () => {
    console.log({ location, checkIn, checkOut, guests });
  };

  return (
    <>
      {isLoggedIn ? (
        <PrivateHeader
          username="Moin Khan"
          onLogout={() => setIsLoggedIn(false)}
        />
      ) : (
        <Header />
      )}

      <main className="property-page-wrapper">
        <h1 className="page-title">Properties</h1>

        <div className="search-bar">
          <div className="field">
            <span className="icon">📍</span>
            <div>
              <label>Location</label>
              <input
                type="text"
                placeholder="Add destination"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="icon">📅</span>
            <div>
              <label>Check in</label>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="icon">📅</span>
            <div>
              <label>Check out</label>
              <input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <span className="icon">👥</span>
            <div>
              <label>Guests</label>
              <input
                type="text"
                placeholder="Add guests"
                value={guests}
                onChange={e => setGuests(e.target.value)}
              />
            </div>
          </div>
          <button className="search-btn" onClick={handleSearch}>
            🔍
          </button>
        </div>

        <div className="content-wrapper">
          <aside className="filters">
            <div className="filter-section">
              <h3>Filter by:</h3>
              <div className="filter-group">
                <strong>Budget:</strong>
                <label>
                  <input
                    type="radio"
                    name="budget"
                    checked={budgetFilter === 2000}
                    onChange={() => setBudgetFilter(2000)}
                  />
                  2000 - 10000$
                </label>
                <label>
                  <input
                    type="radio"
                    name="budget"
                    checked={budgetFilter === 10000}
                    onChange={() => setBudgetFilter(10000)}
                  />
                  10000 - 20000$
                </label>
                <label>
                  <input
                    type="radio"
                    name="budget"
                    checked={budgetFilter === 20000}
                    onChange={() => setBudgetFilter(20000)}
                  />
                  20000 - 40000$
                </label>
              </div>
              <div className="filter-group">
                <strong>Rating:</strong>
                <label>
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === 9}
                    onChange={() => setRatingFilter(9)}
                  />
                  9.0
                </label>
                <label>
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === 5}
                    onChange={() => setRatingFilter(5)}
                  />
                  5.0 - 8.0
                </label>
                <label>
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === 4}
                    onChange={() => setRatingFilter(4)}
                  />
                  {'< 4.0'}
                </label>
              </div>
            </div>
          </aside>

          <section className="property-list">
            {filteredProperties.map(property => (
              <Link to={`/properties/${property.id}`} className="property-card" key={property.id}>
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="property-image"
                />
                <div className="property-info">
                  <h2>{property.name}</h2>
                  <p className="location">{property.location}</p>
                </div>
                <div className="property-rating-price">
                  <p className="rating">
                    Wonderful {property.rating.toFixed(1)}
                  </p>
                  <p className="price">${property.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PropertyListingPage;
