import React, { useState } from 'react';
import './ForgotPasswordPage.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    // Simulated API call
    if (email === 'test@example.com') {
      setMessage('Password reset link has been sent to your email.');
      setError('');
    } else {
      setError('No user found with this email.');
      setMessage('');
    }
  };

  return (
    <>
      <Header />
      <div className="forgot-container">
        <div className="forgot-box">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Reset Link</button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
