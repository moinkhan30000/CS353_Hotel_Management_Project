import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './RegisterManagerPage.css';
import { api } from '../services/api';

const RegisterManagerPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const nameRegex = /^[\p{L}]+$/u;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError('Names can only contain letters.');
      return;
    }

    if (!/^[1-9]\d{9}$/.test(phone)) {
      setError('Phone number must be 10 digits and not start with 0.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters and include a capital, a lowercase, a number, and a symbol.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // ✅ Valid - show toast and redirect
    try {
      await api('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone_number: phone, password, role: 'manager' }),
      });
      setError('');
      toast.success('Manager registered successfully!');
      setTimeout(() => navigate('/login/manager'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  return (
    <>
      <Header hideRegister />
      <div className="register-container">
        <div className="register-box">
          <h2>Manager Registration</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[\p{L}]+$/u.test(value)) setFirstName(value);
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[\p{L}]+$/u.test(value)) setLastName(value);
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setPhone(value);
                }
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterManagerPage;
