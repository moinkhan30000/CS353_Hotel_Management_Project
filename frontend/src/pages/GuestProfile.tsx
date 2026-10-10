import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import { api, type CurrentUser } from '../services/api';
import './ManagerDashboard.css';
import './GuestDashboard.css';

interface Profile extends CurrentUser { date_of_birth?: string; identity_number?: string; gender?: string }
const GuestProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null); const [editing, setEditing] = useState(false); const [error, setError] = useState('');
  useEffect(() => { api<Profile>('/profile/').then(setProfile); }, []);
  const save = async () => { if (!profile) return; try { const saved = await api<Profile>('/profile/', { method: 'PATCH', body: JSON.stringify(profile) }); setProfile(saved); localStorage.setItem('currentUser', JSON.stringify(saved)); setEditing(false); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save profile.'); } };
  if (!profile) return <p>Loading profile...</p>;
  return <div className="page-wrapper"><div className="dashboard-container"><main className="dashboard-main styled-background"><h2 className="dashboard-title">Profile Details</h2><div className="payment-history-container">
    {(['first_name', 'last_name', 'email', 'phone_number', 'date_of_birth', 'gender', 'identity_number'] as const).map(key => <div className="transaction-row" key={key}><label>{key.replace(/_/g, ' ')}:</label>{editing && key !== 'identity_number' ? <input name={key} value={profile[key] ?? ''} onChange={event => setProfile({ ...profile, [key]: event.target.value })} className="profile-input" /> : <span>{profile[key] || '—'}</span>}</div>)}
    {error && <p className="error-message">{error}</p>}<div className="payment-history-actions">{editing ? <button className="pay-button" onClick={save}>Save</button> : <button className="pay-button" onClick={() => setEditing(true)}>Edit</button>}<button className="close-button" onClick={() => window.location.href='/guest-dashboard'}>Back</button></div>
  </div></main><Footer /></div></div>;
};
export default GuestProfile;
