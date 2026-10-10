import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader';
import { api, currentUser, logout, type CurrentUser } from '../services/api';
import './ManagerDashboard.css';
import './GuestDashboard.css';

interface Profile extends CurrentUser {
  date_of_birth?: string;
  identity_number?: string;
  gender?: string;
}

const profileFields = [
  ['first_name', 'First Name'],
  ['last_name', 'Last Name'],
  ['email', 'Email'],
  ['phone_number', 'Phone Number'],
  ['date_of_birth', 'Date of Birth'],
  ['gender', 'Gender'],
  ['identity_number', 'Identity Number'],
] as const;

const GuestProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Profile>('/profile/').then(setProfile);
  }, []);

  const save = async () => {
    if (!profile) return;
    try {
      const saved = await api<Profile>('/profile/', {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      setProfile(saved);
      localStorage.setItem('currentUser', JSON.stringify(saved));
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save profile.');
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <PrivateHeader username={currentUser()?.first_name || 'Guest'} onLogout={() => { logout(); navigate('/'); }} />
        <main className="dashboard-main styled-background">
          <p className="eyebrow">Your account</p>
          <h2 className="dashboard-title">Profile Details</h2>
          <p className="profile-lead">Keep your personal and contact information up to date.</p>
          <div className="payment-history-container">
            {profileFields.map(([key, label]) => (
              <div className="transaction-row" key={key}>
                <label>{label}:</label>
                {editing && key !== 'identity_number' ? (
                  <input name={key} value={profile[key] ?? ''} onChange={event => setProfile({ ...profile, [key]: event.target.value })} className="profile-input" />
                ) : (
                  <span>{profile[key] || '—'}</span>
                )}
              </div>
            ))}
            {error && <p className="error-message">{error}</p>}
            <div className="payment-history-actions">
              {editing ? <button className="pay-button" onClick={save}>Save</button> : <button className="pay-button" onClick={() => setEditing(true)}>Edit</button>}
              <button className="close-button" onClick={() => navigate('/guest-dashboard')}>Back</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default GuestProfile;
