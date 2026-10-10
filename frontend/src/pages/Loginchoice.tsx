import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { api, login, type Role } from '../services/api';
import './Loginchoice.css';

interface LoginPageProps {
  initialRole?: Role;
}

const roleOptions: Array<{ value: Role; label: string; description: string }> = [
  { value: 'guest', label: 'Guest', description: 'Book stays and manage reservations' },
  { value: 'manager', label: 'Manager', description: 'Manage your hotel and bookings' },
  { value: 'admin', label: 'Admin', description: 'Review reports and oversee the platform' },
];

const LoginchoicePage = ({ initialRole = 'guest' }: LoginPageProps) => {
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setRole(initialRole), [initialRole]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password, role);
      if (role === 'manager') {
        const hotel = await api<unknown | null>('/hotels/mine/');
        navigate(hotel ? '/managerhoteldashboard' : '/managerdashboard');
      } else {
        navigate(role === 'guest' ? '/guest-dashboard' : '/admindashboard');
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to log in.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRole = roleOptions.find((option) => option.value === role)!;
  const registerPath = role === 'manager' ? '/register/manager' : '/register/guest';

  return (
    <>
      <Header hideLogin />
      <main className="login-page">
        <section className="login-showcase" aria-label="HorizonStay welcome">
          <div className="login-showcase-content">
            <span className="login-eyebrow">Your stay starts here</span>
            <h1>Welcome back to HorizonStay</h1>
            <p>One secure place for guests, hotel managers, and platform administrators.</p>
          </div>
        </section>

        <section className="login-panel">
          <div className="login-form-wrap">
            <p className="login-kicker">Account access</p>
            <h2>Sign in</h2>
            <p className="login-intro">Choose your account type and enter your details.</p>

            <div className="role-selector" aria-label="Account type">
              {roleOptions.map((option) => (
                <button
                  className={role === option.value ? 'active' : ''}
                  type="button"
                  key={option.value}
                  aria-pressed={role === option.value}
                  onClick={() => {
                    setRole(option.value);
                    setError('');
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className="role-description">{selectedRole.description}</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />

              <div className="password-heading">
                <label htmlFor="login-password">Password</label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />

              {error && <p className="login-error" role="alert">{error}</p>}

              <button className="login-submit" type="submit" disabled={submitting}>
                {submitting ? 'Signing in…' : `Sign in as ${selectedRole.label}`}
              </button>
            </form>

            {role === 'admin' ? (
              <p className="login-register">Administrator accounts are issued by the platform.</p>
            ) : (
              <p className="login-register">
                New to HorizonStay? <Link to={registerPath}>Create an account</Link>
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LoginchoicePage;
