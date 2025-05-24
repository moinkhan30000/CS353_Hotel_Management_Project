import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import './LoginGuestPage.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    if (email === 'test@e' && password === '123') {
      alert('Login successful!');
      setError('');
      navigate("/guest-dashboard")
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <>
      <Header hideLogin />
      <div className="login-container">
        <div className="login-box">
          <h2>Login as Guest</h2>
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
