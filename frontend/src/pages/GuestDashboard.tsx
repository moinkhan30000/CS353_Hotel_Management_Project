import React, { useState } from 'react';
import './GuestDashboard.css'; // Assuming you have a separate CSS file for styling
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const UserDashboard = () => {
  const [userName] = useState('Moin Khan'); // Example username, replace with actual user data.

  // Example data
  const bookings = [
    { id: 1, hotelName: 'Oasis Hotel', bookingDate: new Date(2025, 4, 10), status: 'upcoming' },
    { id: 2, hotelName: 'Sunset Resort', bookingDate: new Date(2025, 3, 15), status: 'past' },
    { id: 3, hotelName: 'Mountain Retreat', bookingDate: new Date(2025, 5, 5), status: 'upcoming' },
  ];

  const payments = [
    { id: 1, hotelName: 'Oasis Hotel', amount: '$200', dueDate: new Date(2025, 4, 10), status: 'upcoming' },
    { id: 2, hotelName: 'Sunset Resort', amount: '$150', dueDate: new Date(2025, 3, 15), status: 'paid' },
  ];

  const reviews = [
    { id: 1, hotelName: 'Oasis Hotel', review: 'Great experience, highly recommend!' },
    { id: 2, hotelName: 'Mountain Retreat', review: 'Very peaceful, perfect for a getaway.' },
  ];

  return (
    <div className="dashboard-container">
     

      <main className="dashboard-main">
        <h2 className="welcome-title">Welcome {userName}!</h2>
        <div className="dashboard-box-container">
          {/* Bookings Section */}
          <div className="dashboard-box bookings">
            <h3>Your Bookings</h3>
            <div className="booking-grid">
              {bookings.map((booking) => {
                const bookingDate = booking.bookingDate.toLocaleDateString();
                const isUpcoming = booking.status === 'upcoming';
                return (
                  <div
                    key={booking.id}
                    className={`booking-box ${isUpcoming ? 'upcoming' : 'past'}`}
                  >
                    <h4>{booking.hotelName}</h4>
                    <p>Booking Date: {bookingDate}</p>
                    <p>Status: {isUpcoming ? 'Upcoming' : 'Past'}</p>
                    <button>{isUpcoming ? 'View Details' : 'Rebook'}</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payments Section */}
          <div className="dashboard-box payments">
            <h3>Your Payments</h3>
            <div className="payment-grid">
              {payments.map((payment) => {
                const dueDate = payment.dueDate.toLocaleDateString();
                return (
                  <div key={payment.id} className={`payment-box ${payment.status === 'paid' ? 'paid' : 'upcoming'}`}>
                    <h4>{payment.hotelName}</h4>
                    <p>Amount: {payment.amount}</p>
                    <p>Due Date: {dueDate}</p>
                    <p>Status: {payment.status === 'paid' ? 'Paid' : 'Upcoming'}</p>
                    <button>{payment.status === 'paid' ? 'View Receipt' : 'Pay Now'}</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="dashboard-box reviews">
            <h3>Your Reviews</h3>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-box">
                  <h4>{review.hotelName}</h4>
                  <p>{review.review}</p>
                </div>
              ))}
            </div>

          
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
