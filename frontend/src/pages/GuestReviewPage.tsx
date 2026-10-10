import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Footer from '../components/Footer/Footer';
import { api } from '../services/api';
import './GuestDashboard.css';
import './GuestReviewPage.css';

interface Booking { id: number; created_at: string; status: string; hotel: { name: string }; review?: Review }
interface Review { id: number; booking: number; text: string; rating: number }

const GuestReviewPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const [editing, setEditing] = useState<Booking | null>(null);

  useEffect(() => {
    Promise.all([api<Booking[]>('/bookings/'), api<Review[]>('/reviews/')]).then(([items, reviews]) => setBookings(items.filter(item => item.status === 'confirmed').map(item => ({ ...item, review: reviews.find(review => review.booking === item.id) }))));
  }, []);

  const save = async () => {
    if (!editing || rating < 1 || rating > 10 || !text.trim()) return toast.error('Enter a review and a rating from 1 to 10.');
    const review = await api<Review>(editing.review ? `/reviews/${editing.review.id}/` : '/reviews/', { method: editing.review ? 'PATCH' : 'POST', body: JSON.stringify({ booking: editing.id, text, rating }) });
    setBookings(items => items.map(item => item.id === editing.id ? { ...item, review } : item));
    setEditing(null);
    toast.success('Review saved.');
  };

  return <div className="page-wrapper"><div className="dashboard-container"><main className="dashboard-main styled-background">
    <h2 className="dashboard-title">Hotel Reviews</h2><div className="payment-history-container">
      {bookings.map(booking => <div className="transaction-row" key={booking.id}><div style={{ flex: 1 }}>{booking.id} | {booking.created_at.slice(0, 10)} | {booking.hotel.name}{booking.review && <div><strong>Review:</strong> {booking.review.text}<br /><strong>Rating:</strong> {booking.review.rating}/10</div>}</div>
        <button className="review-action-button" onClick={() => { setEditing(booking); setText(booking.review?.text ?? ''); setRating(booking.review?.rating ?? 1); }}>{booking.review ? 'Edit Review' : 'Add Review'}</button></div>)}
      {editing && <div className="transaction-row"><textarea value={text} onChange={event => setText(event.target.value)} /><input type="number" min="1" max="10" value={rating} onChange={event => setRating(Number(event.target.value))} /><button className="pay-button" onClick={save}>Save</button></div>}
      <div className="payment-history-actions"><button className="close-button" onClick={() => window.location.href='/guest-dashboard'}>Back</button></div>
    </div></main><Footer /></div></div>;
};

export default GuestReviewPage;
