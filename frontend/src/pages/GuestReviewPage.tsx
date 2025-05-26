import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ReviewableBooking {
  bookingId: string;
  bookingDate: string;
  hotelName: string;
  review?: string;
  rating?: number;
}

const GuestReviewPage = () => {
  const [bookings, setBookings] = useState<ReviewableBooking[]>([
    { bookingId: 'R12345', bookingDate: '2025-05-01', hotelName: 'Oasis Hotel' },
    { bookingId: 'R12348', bookingDate: '2025-04-20', hotelName: 'Istanbul Hotel' },
  ]);

  const [currentReview, setCurrentReview] = useState('');
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const triggerConfirm = (id: string) => {
    if (currentRating < 0 || currentRating > 10) {
      toast.error('Rating must be a number between 0 and 10.');
      return;
    }
    setPendingId(id);
    setShowConfirm(true);
  };

  const handleReview = () => {
    if (!pendingId) return;
    const updated = bookings.map(b =>
      b.bookingId === pendingId ? { ...b, review: currentReview, rating: currentRating } : b
    );
    setBookings(updated);
    setEditingId(null);
    setCurrentReview('');
    setCurrentRating(0);
    setShowConfirm(false);
    setPendingId(null);
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="brand">HORIZONSTAY</h1>
          </div>
          <nav className="dashboard-nav">
            <a href="/guest-dashboard" className="nav-link">Home</a>
            <div className="user-info">
              <span className="user-name">Moin Khan ▼</span>
            </div>
          </nav>
        </header>

        <main className="dashboard-main styled-background">
          <h2 className="dashboard-title">Hotel Reviews</h2>

          <div className="payment-history-container">
            <div className="payment-history-header">
              Booking Id | Booking Date | Hotel Name
            </div>
            {bookings.map((b, idx) => (
              <div key={idx} className="transaction-row">
                <div style={{ flex: 1 }}>
                  {b.bookingId} | {b.bookingDate} | {b.hotelName}
                  {b.review && (
                    <div>
                      <strong>Review:</strong> {b.review}<br />
                      <strong>Rating:</strong> {b.rating?.toFixed(1)}/10
                    </div>
                  )}
                </div>
                {editingId === b.bookingId ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <textarea
                      value={currentReview}
                      onChange={e => setCurrentReview(e.target.value)}
                      placeholder="Write your review..."
                      rows={3}
                      style={{ borderRadius: '1rem', padding: '0.5rem' }}
                    />
                    <label>
                      Rating (0–10):
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={10}
                        value={currentRating}
                        onChange={e => setCurrentRating(parseFloat(e.target.value))}
                        style={{ marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '0.5rem', width: '80px' }}
                      />
                    </label>
                    <button className="pay-button" onClick={() => triggerConfirm(b.bookingId)}>
                      Submit Review
                    </button>
                  </div>
                ) : (
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setEditingId(b.bookingId);
                      setCurrentReview(b.review || '');
                      setCurrentRating(b.rating || 0);
                    }}
                  >
                    {b.review ? 'Edit Review' : 'Add Review'}
                  </button>
                )}
              </div>
            ))}

            <div className="payment-history-actions">
              <button className="close-button" onClick={() => window.location.href='/guest-dashboard'}>
                Back
              </button>
            </div>
          </div>

          {showConfirm && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirm Submission</h3>
                <p>
                  Submit your review with a rating of <strong>{currentRating}/10</strong>?
                </p>
                <div className="modal-actions">
                  <button className="pay-button" onClick={handleReview}>Yes, Submit</button>
                  <button className="close-button" onClick={() => setShowConfirm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default GuestReviewPage;
