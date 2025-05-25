import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './HotelReviewPage.css';

const reviewsData = [
  {
    id: 1,
    guest: 'Sebastian',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 'Wonderful 9.0/10.0',
    review: 'Clean rooms, friendly staff, and a relaxing rooftop vibe. Loved the overall stay — just wish the breakfast was a bit quicker!',
    bookingId: '23452',
    date: '12/05/2025',
    reply: ''
  },
  {
    id: 2,
    guest: 'Evangeline',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    rating: 'Wonderful 8.0/10.0',
    review: 'Clean rooms, friendly staff, and a relaxing rooftop vibe. Loved the overall stay — just wish the breakfast was a bit quicker!',
    bookingId: '29482',
    date: '10/04/2025',
    reply: 'Thank you for your kind feedback! We’ll work on breakfast speed.'
  }
];

const HotelReviewsPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reviews, setReviews] = useState(reviewsData);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (id: number) => {
    setReplyingTo(id);
    const review = reviews.find(r => r.id === id);
    setReplyText(review?.reply || '');
  };

  const saveReply = (id: number) => {
    const updated = reviews.map(r => r.id === id ? { ...r, reply: replyText } : r);
    setReviews(updated);
    setReplyingTo(null);
    setReplyText('');
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
          <h2 className="welcome-title">Hotel Reviews</h2>
          <div className="reviews-container">
            {reviews.map((r) => (
              <div className="review-card" key={r.id}>
                <div className="review-guest">
                  <img src={r.avatar} alt={r.guest} className="guest-avatar" />
                  <div>
                    <strong>{r.guest}</strong> <span>{r.rating}</span>
                    <p>{r.review}</p>
                  </div>
                </div>
                <div className="review-info">
                  <div className="review-meta">
                    <p><strong>Booking Id :</strong> {r.bookingId}</p>
                    <p><strong>Review Post Date:</strong> {r.date}</p>
                  </div>
                  {replyingTo === r.id ? (
                    <div className="reply-box">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                      />
                      <button className="nav-button" onClick={() => saveReply(r.id)}>Save Reply</button>
                    </div>
                  ) : (
                    <button
                      className="nav-button"
                      onClick={() => handleReply(r.id)}
                    >
                      {r.reply ? 'View/Edit Reply' : 'Reply'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HotelReviewsPage;