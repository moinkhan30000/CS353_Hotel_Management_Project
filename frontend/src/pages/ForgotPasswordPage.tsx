import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { api } from '../services/api';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api<{ detail: string }>('/auth/password-reset/', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      setMessage(result.detail);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to request a reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header hideLogin />
      <main className="password-page">
        <section className="password-showcase">
          <div>
            <span className="login-eyebrow">Secure account recovery</span>
            <h1>Let’s get you back to your stay.</h1>
            <p>Enter the email connected to your HorizonStay account and we’ll send reset instructions.</p>
          </div>
        </section>
        <section className="password-panel">
          <div className="password-form-wrap">
            <p className="login-kicker">Password help</p>
            <h2>Reset your password</h2>
            <p className="password-intro">We’ll send a secure reset link if the address belongs to an account.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="reset-email">Email address</label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {message && <p className="password-message success-message" role="status">{message}</p>}
              {error && <p className="password-message error-message" role="alert">{error}</p>}
              <button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send reset link'}</button>
            </form>
            <Link className="password-back" to="/login">Back to sign in</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
