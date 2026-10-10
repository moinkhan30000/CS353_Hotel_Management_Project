import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import { api, type CurrentUser } from '../services/api';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState<CurrentUser | null>(null); const [editing, setEditing] = useState(false);
  useEffect(() => { api<CurrentUser>('/profile/').then(setProfile); }, []);
  const save = async () => { if (!profile) return; const saved = await api<CurrentUser>('/profile/', { method: 'PATCH', body: JSON.stringify(profile) }); setProfile(saved); localStorage.setItem('currentUser', JSON.stringify(saved)); setEditing(false); };
  if (!profile) return <p>Loading profile...</p>;
  return <div className="profile-page"><header className="profile-header"><h1>HORIZONSTAY</h1><span>{profile.first_name} {profile.last_name}</span></header><main className="profile-main"><h2>Admin Profile</h2>{(['first_name', 'last_name', 'email', 'phone_number'] as const).map(key => <div className="profile-row" key={key}><label>{key.replace(/_/g, ' ')}</label>{editing ? <input value={profile[key] ?? ''} onChange={event => setProfile({ ...profile, [key]: event.target.value })} /> : <span>{profile[key] || '—'}</span>}</div>)}<button onClick={editing ? save : () => setEditing(true)}>{editing ? 'Save' : 'Edit'}</button></main><Footer /></div>;
};
export default AdminProfile;
