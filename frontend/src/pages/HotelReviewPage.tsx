import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import { api } from '../services/api';
import './ManagerDashboard.css';
import './HotelReviewPage.css';

interface Review { id: number; booking: number; guest_name: string; rating: number; text: string; response: string; created_at: string }

const HotelReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  useEffect(() => { api<Review[]>('/reviews/').then(setReviews); }, []);
  const saveReply = async (review: Review) => {
    const saved = await api<Review>(`/reviews/${review.id}/`, { method: 'PATCH', body: JSON.stringify({ response: replyText }) });
    setReviews(items => items.map(item => item.id === saved.id ? saved : item)); setReplyingTo(null);
  };
  return <div className="page-wrapper"><div className="dashboard-container"><main className="dashboard-main"><h2 className="welcome-title">Hotel Reviews</h2><div className="reviews-container">
    {reviews.map(review => <div className="review-card" key={review.id}><div className="review-guest"><div><strong>{review.guest_name}</strong> <span>{review.rating}/10</span><p>{review.text}</p></div></div><div className="review-info"><div className="review-meta"><p><strong>Booking ID:</strong> {review.booking}</p><p><strong>Review Post Date:</strong> {new Date(review.created_at).toLocaleDateString()}</p>{review.response && <p><strong>Reply:</strong> {review.response}</p>}</div>{replyingTo === review.id ? <div className="reply-box"><textarea value={replyText} onChange={event => setReplyText(event.target.value)} /><button className="nav-button" onClick={() => saveReply(review)}>Save Reply</button></div> : <button className="nav-button" onClick={() => { setReplyingTo(review.id); setReplyText(review.response); }}>{review.response ? 'Edit Reply' : 'Reply'}</button>}</div></div>)}
  </div></main><Footer /></div></div>;
};

export default HotelReviewsPage;
