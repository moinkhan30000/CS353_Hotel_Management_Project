import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import './LoginGuestPage.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { login } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      await login(email, password, 'admin');
      setError('');
      navigate('/admindashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in.');
    }
  };

  return (
    <>
      <Header hideLogin />
      <div className="login-container">
        <div className="login-box">
          <h2>Login as Admin</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>

          <p className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
