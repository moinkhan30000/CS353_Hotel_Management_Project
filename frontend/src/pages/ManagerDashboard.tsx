import React, { useState } from 'react';
import './ManagerDashboard.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const ManagerDashboard = () => {
    const [status, setStatus] = useState('');

 return (
    <div className="dashboard-container">
        <header className="dashboard-header">
            <h1 className="brand">HORIZONSTAY</h1>
            <li><a href="/">Logout</a></li>
            <div className="user-info">
                
                <span>Moin Khan</span>
                <span>👤</span>
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
                <div className="see-more">
                    <a href="#">See more</a>
                </div>
            </div>
            <div className="manage-account">
                <h3>Manage Account</h3>
                <ul>
                    <li><a href="/managerprofile">Personal Details</a></li>
                    <li><a href="#">Edit Hotel Images</a></li>
                    <li><a href="#">Respond to Reviews</a></li>
                    <li><a href="#">Manage Bookings</a></li>
                </ul>
            </div>
        </div>

        <div className="grid-container">
            <div className="hotel-description">
                <h3>Hotel Description</h3>
                <p>
                    Discover the perfect blend of comfort, elegance, and calm at Oasis Hotel. Designed as a sanctuary amidst the city's bustle, Oasis offers beautifully appointed rooms, a serene courtyard garden, and world-class hospitality. Wake up to peaceful mornings, indulge in gourmet dining at our signature restaurant, or unwind in our rooftop pool with skyline views. Whether you're here for a quick escape or an extended stay, Oasis Hotel welcomes you to relax, recharge, and feel at home.
                </p>
                <button>Edit</button>
            </div>
            <div className="status-box">
                <h3>Status</h3>
                <label className="switch">
                    <input type="checkbox" checked={status === 'active'} onChange={() => setStatus(status === 'active' ? 'inactive' : 'active')} />
                    <span className="slider"></span>
                </label>
                <span>{status === 'active' ? 'Active' : 'Inactive'}</span>

            </div>
        </div>

        <div className="grid-container">

        
        <div className="rooms-box">
            <div className="rooms-header">
                <h3>Rooms</h3>
                <button>Edit</button>
            </div>
        </div>

        <div className="amenities-box">
            <h3>Amenities</h3>
            <div className="amenities-grid">
                <label><input type="checkbox" /> Wifi</label>
                <label><input type="checkbox" /> Mini Bar</label>
                <label><input type="checkbox" /> Extra Toiletries</label>
                <label><input type="checkbox" /> Coffee/Tea Maker</label>
                <label><input type="checkbox" /> Streaming Services</label>
            </div>
            <button className="add-button">Add</button>
        </div>
        </div>
      </main>
      <Footer/>
    </div>
    
  );
};

export default ManagerDashboard;
