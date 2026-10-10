import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { api, type Role } from '../services/api';
import './RegisterChoicePage.css';

type RegistrationRole = Exclude<Role, 'admin'>;

interface RegisterPageProps {
  initialRole?: RegistrationRole;
}

const RegisterChoicePage = ({ initialRole = 'guest' }: RegisterPageProps) => {
  const [role, setRole] = useState<RegistrationRole>(initialRole);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setRole(initialRole), [initialRole]);

  const selectRole = (selectedRole: RegistrationRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || (role === 'guest' && (!identityNumber || !dateOfBirth))) {
      setError('Please complete all required fields.');
      return;
    }
    if (!/^[\p{L}]+$/u.test(firstName) || !/^[\p{L}]+$/u.test(lastName)) {
      setError('Names can only contain letters.');
      return;
    }
    if (!/^[1-9]\d{9}$/.test(phone)) {
      setError('Phone number must be 10 digits and cannot start with 0.');
      return;
    }
    if (role === 'guest' && !/^[1-9]\d{10}$/.test(identityNumber)) {
      setError('Identity number must be 11 digits and cannot start with 0.');
      return;
    }
    if (role === 'guest') {
      const birthDate = new Date(dateOfBirth);
      const minimumDate = new Date();
      minimumDate.setFullYear(minimumDate.getFullYear() - 16);
      if (Number.isNaN(birthDate.getTime()) || birthDate > minimumDate) {
        setError('You must be at least 16 years old.');
        return;
      }
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await api('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          password,
          role,
          ...(role === 'guest' ? { identity_number: identityNumber, date_of_birth: dateOfBirth } : {}),
        }),
      });
      toast.success(`${role === 'guest' ? 'Guest' : 'Manager'} account created.`);
      navigate(`/login/${role}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header hideRegister />
      <main className="unified-register-page">
        <section className="register-showcase">
          <div>
            <span className="login-eyebrow">Join HorizonStay</span>
            <h1>Travel better, or grow your hotel.</h1>
            <p>Create the account that fits how you use HorizonStay. You can switch account type before submitting.</p>
          </div>
        </section>
        <section className="register-panel">
          <div className="register-form-wrap">
            <p className="login-kicker">Create an account</p>
            <h2>Get started</h2>
            <p className="register-intro">Choose your account type and enter your details.</p>

            <div className="register-role-selector" aria-label="Account type">
              <button type="button" className={role === 'guest' ? 'active' : ''} aria-pressed={role === 'guest'} onClick={() => selectRole('guest')}>Guest</button>
              <button type="button" className={role === 'manager' ? 'active' : ''} aria-pressed={role === 'manager'} onClick={() => selectRole('manager')}>Manager</button>
            </div>

            <form className="unified-register-form" onSubmit={handleSubmit}>
              <div className="register-name-row">
                <label>First name<input value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /></label>
                <label>Last name<input value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /></label>
              </div>
              <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
              <label>Phone number<input inputMode="numeric" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} autoComplete="tel" /></label>
              {role === 'guest' && (
                <div className="register-name-row">
                  <label>Identity number<input inputMode="numeric" maxLength={11} value={identityNumber} onChange={(event) => setIdentityNumber(event.target.value.replace(/\D/g, '').slice(0, 11))} /></label>
                  <label>Date of birth<input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} /></label>
                </div>
              )}
              <div className="register-name-row">
                <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label>
                <label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></label>
              </div>
              {error && <p className="register-error" role="alert">{error}</p>}
              <button className="register-submit" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : `Create ${role === 'guest' ? 'Guest' : 'Manager'} Account`}</button>
            </form>
            <p className="register-signin">Already have an account? <Link to={`/login/${role}`}>Sign in</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RegisterChoicePage;
