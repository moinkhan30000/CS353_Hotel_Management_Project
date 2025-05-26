import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css'; // You can create this for any custom styling

interface Reservation {
  hotelName: string;
  location: string;
  bookingId: string;
}

const GuestDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const reservations: Reservation[] = [
    { hotelName: 'Oasis Hotel', location: 'Rio de Janeiro', bookingId: '32424' },
    { hotelName: 'Istanbul Hotel', location: 'Istanbul', bookingId: '58309' },
    { hotelName: 'Ankara Hotel', location: 'Ankara', bookingId: '23939' },
  ];

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="brand">HORIZONSTAY</h1>
          </div>
          <nav className="dashboard-nav">
            <a href="/" className="nav-link">Home</a>
            <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="user-name">Moin Khan ▼</span>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <a href="/">Logout</a>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main className="dashboard-main">
          <h2 className="welcome-title">Welcome</h2>

          <section className="reservation-section">
            <div className="section-header">
              <h3>Reservation Cards</h3>
              <a href="#">See more &rsaquo;</a>
            </div>

            <div className="reservation-grid">
              {reservations.map((res, index) => (
                <div key={index} className="reservation-card" onClick={() => setSelectedReservation(res)}>
                  <div className="reservation-hotel">{res.hotelName}</div>
                  <div className="reservation-id">Booking ID: {res.bookingId}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="guest-links">
            <div className="link-card"><h4>Payment Info</h4><p>Transaction History</p></div>
            <div className="link-card"><h4>Manage Account</h4><p>Personal Details</p></div>
            <div className="link-card"><h4>Travel Activity</h4><p>Reservation History</p></div>
            <div className="link-card"><h4>Review Hotels</h4><p>Review Visited Hotels</p></div>
          </section>
        </main>

        {selectedReservation && (
          <div className="modal-overlay" onClick={() => setSelectedReservation(null)}>
            <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedReservation.hotelName}</h3>
              <p>{selectedReservation.location}</p>
              <p>Booking ID: {selectedReservation.bookingId}</p>

              <h4>Guests</h4>
              <div className="guest-info-grid">
                <div className="guest-column">
                  <input placeholder="Username" />
                  <input placeholder="Email" />
                  <input placeholder="Phone Number" />
                  <input placeholder="Identity Number" />
                  <input placeholder="Gender" />
                </div>
                <div className="guest-column">
                  <input placeholder="Username" />
                  <input placeholder="Email" />
                  <input placeholder="Phone Number" />
                  <input placeholder="Identity Number" />
                  <input placeholder="Gender" />
                </div>
              </div>

              <button className="upload-button" onClick={() => setSelectedReservation(null)}>Close</button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default GuestDashboard;
