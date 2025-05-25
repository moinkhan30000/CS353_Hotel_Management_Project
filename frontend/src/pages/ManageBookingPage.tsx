import { useState } from 'react';
import './ManagerDashboard.css';
import Footer from '../components/Footer/Footer';

const ManageBookingPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [bookings, setBookings] = useState([
    { id: 'B001', date: '2025-06-10', guests: 2 },
    { id: 'B002', date: '2025-06-12', guests: 4 },
  ]);

  const toggleEdit = (index: number) => {
    setEditing((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleChange = (index: number, field: string, value: string | number) => {
    const updated = [...bookings];
    updated[index] = { ...updated[index], [field]: value };
    setBookings(updated);
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="brand">HORIZONSTAY</h1>
          </div>

          <nav className="dashboard-nav">
            <a href="/managerhoteldashboard" className="nav-link">Dashboard</a>
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
          <h2 className="welcome-title">Manage Booking</h2>
          <div className="booking-list">
            <div className="booking-header">
              <span>Booking ID</span>
              <span>Date</span>
              <span>Guests</span>
              <span>Actions</span>
            </div>

            {bookings.map((booking, index) => (
              <div key={booking.id} className="booking-item">
                <span className="booking-readonly">{booking.id}</span>

                {editing[index] ? (
                  <>
                    <input
                      type="date"
                      value={booking.date}
                      onChange={(e) => handleChange(index, 'date', e.target.value)}
                      className="booking-input"
                    />
                    <input
                      type="number"
                      value={booking.guests}
                      onChange={(e) => handleChange(index, 'guests', Number(e.target.value))}
                      className="booking-input"
                    />
                  </>
                ) : (
                  <>
                    <span>{booking.date}</span>
                    <span>{booking.guests}</span>
                  </>
                )}

                <div className="booking-actions">
                  <button className="nav-button" onClick={() => toggleEdit(index)}>
                    {editing[index] ? 'Save' : 'Edit'}
                  </button>
                  <button
                    className="nav-button danger"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2rem' }}>
              <button className="nav-button" onClick={() => window.history.back()}>Back</button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ManageBookingPage;
