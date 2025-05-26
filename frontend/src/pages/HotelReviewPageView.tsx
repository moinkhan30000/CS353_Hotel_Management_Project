import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './HotelReviewPageView.css';

const reviews = [
  {
    id: 1,
    name: 'Sebastian',
    rating: 9.0,
    date: 'dd/yy/mm',
    content: 'Clean rooms, friendly staff, and a relaxing rooftop vibe. Loved the overall stay — just wish the breakfast was a bit quicker!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'Evangeline',
    rating: 8.0,
    date: 'dd/yy/mm',
    content: 'Clean rooms, friendly staff, and a relaxing rooftop vibe. Loved the overall stay — just wish the breakfast was a bit quicker!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

const HotelReviewPageView = () => {
  return (
    <div className="reviews-page">
      <Header />
      <div className="hero-banner">
        <h1>Welcome</h1>
      </div>
      <div className="reviews-container">
        <h2>Hotel Reviews</h2>
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <img src={review.image} alt={review.name} className="avatar" />
            <div className="review-content">
              <strong>{review.name}</strong> <span className="score">Wonderful {review.rating}/10.0</span>
              <p><strong>Date Posted :</strong> {review.date}</p>
              <p>{review.content}</p>
            </div>
            <button className="reply-btn">View Reply</button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default HotelReviewPageView;
