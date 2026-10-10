import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import { api, currentUser, logout } from '../services/api';
import './ManagerDashboard.css';

interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  status: string;
  guests: { id: number; name: string; age: number }[];
}

const displayLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());

const ManageBookingPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const user = currentUser();

  useEffect(() => { api<Booking[]>('/bookings/').then(setBookings); }, []);

  const cancelBooking = async (id: number) => {
    const updated = await api<Booking>(`/bookings/${id}/cancel/`, { method: 'POST' });
    setBookings(items => items.map(item => item.id === id ? updated : item));
  };

  return (
    <div className="page-wrapper"><div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left"><h1 className="brand">HORIZONSTAY</h1></div>
        <nav className="dashboard-nav">
          <a href="/managerhoteldashboard" className="nav-link">Dashboard</a>
          <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="user-name">{user ? `${user.first_name} ${user.last_name}` : 'Manager'}</span>
            {dropdownOpen && <div className="dropdown-content"><a href="/" onClick={logout}>Logout</a></div>}
          </div>
        </nav>
      </header>
      <main className="dashboard-main">
        <h2 className="welcome-title">Manage Booking</h2>
        <div className="booking-list">
          <div className="booking-header"><span>Booking ID</span><span>Dates</span><span>Guests</span><span>Actions</span></div>
          {bookings.map(booking => <div key={booking.id} className="booking-item">
            <span className="booking-readonly">{booking.id}</span>
            <span>{booking.check_in} – {booking.check_out}</span>
            <span>{booking.guests.length}</span>
            <div className="booking-actions">
              <span className="booking-status">{displayLabel(booking.status)}</span>
              {booking.status !== 'cancelled' && <button className="nav-button danger" onClick={() => cancelBooking(booking.id)}>Cancel</button>}
            </div>
          </div>)}
          {!bookings.length && <p>No bookings available.</p>}
          <div style={{ marginTop: '2rem' }}><button className="nav-button" onClick={() => window.history.back()}>Back</button></div>
        </div>
      </main><Footer />
    </div></div>
  );
};

export default ManageBookingPage;
