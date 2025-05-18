import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ResetPasswordPage.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Simulate API response (you'll replace this with real fetch later)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (token === 'validtoken123') {
      setMessage('Password reset successfully. You may now log in.');
      setError('');
    } else {
      setError('Invalid or expired token.');
      setMessage('');
    }
  };

  return (
    <>
      <Header hideLogin />
      <div className="reset-container">
        <div className="reset-box">
          <h2>Reset Password</h2>
          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPasswordPage;
