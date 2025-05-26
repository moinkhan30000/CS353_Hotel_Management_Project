import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Guest {
  username: string;
  email: string;
  phone: string;
  identity: string;
  gender: string;
}

interface Reservation {
  hotelName: string;
  location: string;
  bookingId: string;
  amountPaid: number;
  amountDue: number;
  checkIn: string;
  checkOut: string;
  guests: Guest[];
}

const GuestDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [canceled, setCanceled] = useState<string | null>(null);
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([
    {
      hotelName: 'Oasis Hotel',
      location: 'Rio de Janeiro',
      bookingId: '32424',
      amountPaid: 150,
      amountDue: 50,
      checkIn: '2025-06-20',
      checkOut: '2025-06-25',
      guests: [
        {
          username: 'john_doe',
          email: 'john@example.com',
          phone: '+5521999999999',
          identity: 'ID20234234',
          gender: 'Male',
        },
        {
          username: 'jane_doe',
          email: 'jane@example.com',
          phone: '+5521988888888',
          identity: 'ID20235555',
          gender: 'Female',
        },
      ],
    },
    {
      hotelName: 'Istanbul Hotel',
      location: 'Istanbul',
      bookingId: '58309',
      amountPaid: 300,
      amountDue: 0,
      checkIn: '2025-06-15',
      checkOut: '2025-06-18',
      guests: [],
    },
    {
      hotelName: 'Ankara Hotel',
      location: 'Ankara',
      bookingId: '23939',
      amountPaid: 200,
      amountDue: 100,
      checkIn: '2025-06-10',
      checkOut: '2025-06-12',
      guests: [],
    },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [reservationHistory, setReservationHistory] = useState<Reservation[]>([]);
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [points, setPoints] = useState(9800);

  // New states for redeem receipt popup
  const [showRedeemReceipt, setShowRedeemReceipt] = useState(false);
  const [redeemReceiptData, setRedeemReceiptData] = useState<{ transactionId: string; amount: number } | null>(null);

  const isCancellable = (checkIn: string) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const diffInTime = checkInDate.getTime() - today.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays >= 7;
  };

  const confirmCancel = () => {
    if (selectedReservation) {
      const penalty = (selectedReservation.amountPaid * 0.1).toFixed(2);
      const updated = activeReservations.filter(r => r.bookingId !== selectedReservation.bookingId);
      setActiveReservations(updated);
      setReservationHistory([...reservationHistory, selectedReservation]);
      setCanceled(`Canceled. 10% penalty applied: ${penalty} TL`);
      setSelectedReservation(null);
      setShowConfirm(false);
    }
  };

  const handleRedeem = () => {
    const redeemValue = parseInt(redeemAmount);
    if (isNaN(redeemValue) || redeemValue <= 0 || redeemValue > points) {
      toast.error('Invalid amount to redeem.', { position: 'top-center' });
      return;
    }
    toast.success(`Redeemed ${redeemValue} points successfully!`, { position: 'top-center' });
    setPoints(prev => prev - redeemValue);
    setShowRedeemPopup(false);
    setRedeemAmount('');

    // Show receipt popup with generated transaction ID and amount
    setRedeemReceiptData({
      transactionId: 'TXN' + Math.floor(Math.random() * 1000000000),
      amount: redeemValue,
    });
    setShowRedeemReceipt(true);
  };

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

        <main className="dashboard-main styled-background">
          <h2 className="dashboard-title">Welcome</h2>

          <section className="reservations-section">
            <div className="section-header">
              <h3>Reservation Cards</h3>
            </div>
            <div className="reservation-grid">
              {activeReservations.map((reservation, idx) => (
                <div
                  key={idx}
                  className="reservation-card"
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setCanceled(null);
                    setShowConfirm(false);
                  }}
                >
                  <p className="reservation-hotel">{reservation.hotelName}</p>
                  <p className="reservation-id">Booking ID: {reservation.bookingId}</p>
                </div>
              ))}
            </div>
          </section>

          {selectedReservation && !showConfirm && (
            <div className="popup">
              <h3>{selectedReservation.hotelName}</h3>
              <p>{selectedReservation.location}</p>
              <p>Booking ID: {selectedReservation.bookingId}</p>
              <p>Check-in: {selectedReservation.checkIn}</p>
              <p>Check-out: {selectedReservation.checkOut}</p>
              <p>Amount Paid: {selectedReservation.amountPaid} TL</p>
              <p>Amount Due: {selectedReservation.amountDue} TL</p>
              {selectedReservation.guests.length > 0 && (
                <div className="guest-info-grid">
                  {selectedReservation.guests.map((guest, i) => (
                    <div className="guest-column" key={i}>
                      <h4>Guest No.{i + 1}</h4>
                      <p><strong>Username:</strong> {guest.username}</p>
                      <p><strong>Email:</strong> {guest.email}</p>
                      <p><strong>Phone Number:</strong> {guest.phone}</p>
                      <p><strong>Identity Number:</strong> {guest.identity}</p>
                      <p><strong>Gender:</strong> {guest.gender}</p>
                    </div>
                  ))}
                </div>
              )}
              {selectedReservation.amountDue > 0 && (
                <button className="pay-button" onClick={() => window.location.href='/payment'}>
                  Pay Now
                </button>
              )}
              {isCancellable(selectedReservation.checkIn) && (
                <button className="cancel-button" onClick={() => setShowConfirm(true)}>Cancel Booking</button>
              )}
              <button className="close-button" onClick={() => setSelectedReservation(null)}>Close</button>
            </div>
          )}

          {showConfirm && selectedReservation && (
            <div className="popup">
              <h3>Confirm Cancellation</h3>
              <p>You will be charged a 10% penalty of {selectedReservation.amountPaid} TL</p>
              <p>Penalty: {(selectedReservation.amountPaid * 0.1).toFixed(2)} TL</p>
              <button className="cancel-button" onClick={confirmCancel}>Yes, Cancel Booking</button>
              <button className="close-button" onClick={() => setShowConfirm(false)}>Go Back</button>
            </div>
          )}

          {canceled && (
            <div className="popup">
              <p>{canceled}</p>
              <button className="close-button" onClick={() => setCanceled(null)}>Close</button>
            </div>
          )}

          <section className="guest-links">
            <div className="link-card">
              <h4><a href="/payment-history">Payment History</a></h4>
              <p>View your past transactions</p>
            </div>
            <div className="link-card">
              <h4><a href="/guest-profile">Manage Account</a></h4>
              <p>Personal Details</p>
            </div>
            <div className="link-card">
              <h4><a href="/reservation-history">Reservation History</a></h4>
              <p>View and manage your past and upcoming bookings.</p>
            </div>
            <div className="link-card">
              <h4><a href="/guest-reviews">Review Hotels</a></h4>
              <p>VRate Past Stays</p>
            </div>
          </section>

          <section className="wallet-section">
            <h3>Wallet</h3>
            <p>Wallet ID: 39495347</p>
            <p>
              Balance: 2763.25 TL
              <a href="/guest-topup" className="topup-button">TOP-UP</a>
            </p>
          </section>

          <section className="loyalty-section">
            <h3>Loyalty Program</h3>
            {enrolled ? (
              <>
                <p>Loyalty Points: {points}</p>
                <button className="loyalty-button" onClick={() => setShowRedeemPopup(true)}>Redeem Points</button>
              </>
            ) : (
              <button className="loyalty-button" onClick={() => setEnrolled(true)}>Enroll in Loyalty Program</button>
            )}
          </section>

          {showRedeemPopup && (
            <div className="popup">
              <h3>Top-Up</h3>
              <p><strong>Points Balance:</strong> {points}</p>
              <input
                className="transaction-row"
                type="number"
                min="0"
                placeholder="Points to Redeem"
                value={redeemAmount}
                onChange={e => setRedeemAmount(e.target.value)}
              />
              <button className="pay-button" onClick={handleRedeem}>Confirm</button>
              <button className="close-button" onClick={() => setShowRedeemPopup(false)}>Cancel</button>
            </div>
          )}

          {showRedeemReceipt && redeemReceiptData && (
            <div className="popup">
              <h3>Transaction Details</h3>
              <hr />
              <p style={{ textAlign: 'center', fontSize: '2rem', color: 'green' }}>✔</p>
              <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem' }}>Top-Up Successful</p>
              <p><strong>Transaction ID:</strong> {redeemReceiptData.transactionId}</p>
              <p><strong>Status:</strong> Successful</p>
              <p><strong>Transaction Amount:</strong> {redeemReceiptData.amount} TL</p>
              <p><strong>Method of Payment:</strong> Loyalty Points</p>
              <p><strong>Transaction Type:</strong> Top-Up</p>
              <button className="close-button" onClick={() => setShowRedeemReceipt(false)}>OK</button>
            </div>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default GuestDashboard;
