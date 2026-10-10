import { useEffect, useState } from 'react';
import { api, type CurrentUser } from '../services/api';
import './ManagerProfile.css';

interface Hotel { id: number; name: string; email: string; phone_number: string; address: string; country: string; city: string }
const ManagerProfilePage = () => {
  const [profile, setProfile] = useState<CurrentUser | null>(null); const [hotel, setHotel] = useState<Hotel | null>(null); const [editing, setEditing] = useState(false);
  useEffect(() => { Promise.all([api<CurrentUser>('/profile/'), api<Hotel | null>('/hotels/mine/')]).then(([user, value]) => { setProfile(user); setHotel(value); }); }, []);
  const save = async () => { if (!profile) return; const saved = await api<CurrentUser>('/profile/', { method: 'PATCH', body: JSON.stringify(profile) }); setProfile(saved); if (hotel) setHotel(await api<Hotel>(`/hotels/${hotel.id}/`, { method: 'PATCH', body: JSON.stringify(hotel) })); localStorage.setItem('currentUser', JSON.stringify(saved)); setEditing(false); };
  if (!profile) return <p>Loading profile...</p>;
  const fields: Array<[string, string, (value: string) => void]> = [['Name', `${profile.first_name} ${profile.last_name}`, value => { const [first_name, ...rest] = value.split(' '); setProfile({ ...profile, first_name, last_name: rest.join(' ') }); }], ['Email', profile.email, value => setProfile({ ...profile, email: value })], ['Phone', profile.phone_number ?? '', value => setProfile({ ...profile, phone_number: value })], ['Hotel', hotel?.name ?? '', value => hotel && setHotel({ ...hotel, name: value })], ['Address', hotel?.address ?? '', value => hotel && setHotel({ ...hotel, address: value })], ['Country', hotel?.country ?? '', value => hotel && setHotel({ ...hotel, country: value })], ['City', hotel?.city ?? '', value => hotel && setHotel({ ...hotel, city: value })]];
  return <div className="container"><header className="header"><div className="logo">HORIZONSTAY</div><nav className="managerprofilenav"><a href="/managerhoteldashboard">Dashboard</a><div className="managerprofile-button"><span>{profile.first_name} {profile.last_name}</span></div></nav></header><main className="main"><h1 className="welcome">Welcome</h1><div className="profile-box"><h2>Manager Profile Details</h2>{fields.map(([label, value, update]) => <div className="profile-field" key={label}><label className="field-label">{label}:</label>{editing ? <input value={value} onChange={event => update(event.target.value)} className="input-field" /> : <span className="field-value">{value || '—'}</span>}</div>)}<button className="edit-button" onClick={editing ? save : () => setEditing(true)}>{editing ? 'Save' : 'Edit'}</button></div></main></div>;
};
export default ManagerProfilePage;
