import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';
import Footer from '../components/Footer/Footer';

const ManagerDashboard = () => {
  const [status, setStatus] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(
    'Discover the perfect blend of comfort, elegance, and calm at Oasis Hotel. Designed as a sanctuary amidst the city\'s bustle, Oasis offers beautifully appointed rooms, a serene courtyard garden, and world-class hospitality. Wake up to peaceful mornings, indulge in gourmet dining at our signature restaurant, or unwind in our rooftop pool with skyline views. Whether you\'re here for a quick escape or an extended stay, Oasis Hotel welcomes you to relax, recharge, and feel at home.'
  );
  const [amenities, setAmenities] = useState<string[]>([
    'Wifi',
    'Mini Bar',
    'Extra Toiletries',
    'Coffee/Tea Maker',
    'Streaming Services',
  ]);
  const [editingAmenities, setEditingAmenities] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  return (
    <div className="dashboard-container">
<header className="dashboard-header">
  <div className="header-left">
    <h1 className="brand">HORIZONSTAY</h1>
  </div>
  <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
    <span className="user-name">Moin Khan ▼</span>
    {dropdownOpen && (
      <div className="dropdown-content">
        <a href="/">Logout</a>
      </div>
    )}
  </div>
</header>


      <div className="welcome-section">
        <h2 className="welcome-title">Welcome</h2>
      </div>

      <main className="dashboard-main">
        <div className="grid-container">
          <div className="hotel-card">
            <div className="hotel-card-content">
              <div className="hotel-image">
                <div>
                  <div className="hotel-name">Oasis Hotel</div>
                  <div className="hotel-id">Hotel ID: 32424</div>
                </div>
              </div>
              <div className="hotel-info">
                <div className="info-label">Rating:</div>
                <div>Wonderful 9.0</div>
                <div className="info-label">Hotel Capacity:</div>
                <div>200/400</div>
              </div>
            </div>

          </div>

          <div className="manage-account">
            <h3>Manage Account</h3>
            <ul>
              <li><a href="/managerprofile">Personal Details</a></li>
              <li><a href="/edit-hotel-images">Edit Hotel Images</a></li>
              <li><a href="/reviews">Respond to Reviews</a></li>
              <li><a href="/manage-bookings">Manage Bookings</a></li>
            </ul>
          </div>
        </div>

        <div className="grid-container">
          <div className="hotel-description">
            <h3>Hotel Description</h3>
            {editingDescription ? (
              <>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="editable-textarea"
                />
                <button onClick={() => setEditingDescription(false)}>Save</button>
              </>
            ) : (
              <>
                <p>{description}</p>
                <button onClick={() => setEditingDescription(true)}>Edit</button>
              </>
            )}
          </div>

          <div className="status-box">
            <h3>Status</h3>
            <label className="switch">
              <input
                type="checkbox"
                checked={status === 'active'}
                onChange={() => setStatus(status === 'active' ? 'inactive' : 'active')}
              />
              <span className="slider"></span>
            </label>
            <span>{status === 'active' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <div className="grid-container">
          <div className="rooms-box">
            <div className="rooms-header">
              <h3>Rooms</h3>
              <button className="nav-button" onClick={() => navigate('/rooms')}>Go to Edit Page</button>
            </div>
          </div>

          <div className="amenities-box">
            <h3>Amenities</h3>
            {editingAmenities ? (
              <>
                <div className="amenities-grid">
                  {amenities.map((item, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        checked
                        onChange={() => toggleAmenity(item)}
                      />{' '}
                      {item}
                    </label>
                  ))}
                  <input
                    type="text"
                    placeholder="New amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                  />
                  <button onClick={addAmenity}>Add</button>
                </div>
                <button onClick={() => setEditingAmenities(false)}>Save</button>
              </>
            ) : (
              <>
                <div className="amenities-grid">
                  {amenities.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
                </div>
                <button onClick={() => setEditingAmenities(true)}>Edit</button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManagerDashboard;