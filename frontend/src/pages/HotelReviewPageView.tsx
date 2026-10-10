import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { api } from '../services/api';
import './HotelReviewPageView.css';

interface Review { id: number; guest_name: string; rating: number; text: string; response: string; created_at: string }
const HotelReviewPageView = () => {
  const [params] = useSearchParams(); const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => { api<Review[]>(`/reviews/?hotel=${params.get('hotel') ?? ''}`).then(setReviews); }, [params]);
  return <div className="reviews-page"><Header /><div className="hero-banner"><h1>Welcome</h1></div><div className="reviews-container"><h2>Hotel Reviews</h2>{reviews.map(review => <div className="review-card" key={review.id}><div className="review-content"><strong>{review.guest_name}</strong> <span className="score">{review.rating}/10</span><p><strong>Date Posted:</strong> {new Date(review.created_at).toLocaleDateString()}</p><p>{review.text}</p>{review.response && <p><strong>Hotel reply:</strong> {review.response}</p>}</div></div>)}{!reviews.length && <p>No reviews yet.</p>}</div><Footer /></div>;
};
export default HotelReviewPageView;
