import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { api, currentUser, logout } from '../services/api';
import './ManagerDashboard.css';

interface Hotel { id: number; name: string; rating: number; description: string; status: string; amenities: { id: number; name: string }[]; rooms: { quantity: number }[] }

const displayLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());

const ManagerDashboard = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null); const [editingDescription, setEditingDescription] = useState(false); const [description, setDescription] = useState(''); const [newAmenity, setNewAmenity] = useState(''); const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); const user = currentUser();
  useEffect(() => { api<Hotel | null>('/hotels/mine/').then(value => { if (!value) navigate('/managerdashboard'); else { setHotel(value); setDescription(value.description); } }); }, [navigate]);
  const updateHotel = async (changes: Partial<Hotel>) => { if (!hotel) return; const saved = await api<Hotel>(`/hotels/${hotel.id}/`, { method: 'PATCH', body: JSON.stringify(changes) }); setHotel(saved); };
  const saveDescription = async () => { await updateHotel({ description }); setEditingDescription(false); };
  const addAmenity = async () => { if (!hotel || !newAmenity.trim()) return; const amenity = await api<{ id: number; name: string }>('/amenities/', { method: 'POST', body: JSON.stringify({ name: newAmenity.trim() }) }); await updateHotel({ ...hotel, amenities: undefined, rooms: undefined, amenity_ids: [...hotel.amenities.map(item => item.id), amenity.id] } as Partial<Hotel>); setNewAmenity(''); };
  if (!hotel) return <p>Loading hotel...</p>;
  const capacity = hotel.rooms.reduce((total, room) => total + room.quantity, 0);
  return <div className="dashboard-container"><header className="dashboard-header"><div className="header-left"><h1 className="brand">HORIZONSTAY</h1></div><div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}><span className="user-name">{user ? `${user.first_name} ${user.last_name}` : 'Manager'}</span>{dropdownOpen && <div className="dropdown-content"><a href="/" onClick={logout}>Logout</a></div>}</div></header>
    <div className="welcome-section"><h2 className="welcome-title">Welcome</h2></div><main className="dashboard-main"><div className="grid-container"><div className="hotel-card"><div className="hotel-card-content"><div className="hotel-image"><div><div className="hotel-name">{hotel.name}</div><div className="hotel-id">Hotel ID: {hotel.id}</div></div></div><div className="hotel-info"><div className="info-label">Rating:</div><div>{hotel.rating.toFixed(1)}</div><div className="info-label">Room capacity:</div><div>{capacity}</div></div></div></div><div className="manage-account"><h3>Manage Account</h3><ul><li><a href="/managerprofile">Personal Details</a></li><li><a href="/edit-hotel-images">Edit Hotel Images</a></li><li><a href="/reviews">Respond to Reviews</a></li><li><a href="/manage-bookings">Manage Bookings</a></li></ul></div></div>
      <div className="grid-container"><div className="hotel-description"><h3>Hotel Description</h3>{editingDescription ? <><textarea value={description} onChange={event => setDescription(event.target.value)} rows={6} className="editable-textarea" /><button onClick={saveDescription}>Save</button></> : <><p>{hotel.description || 'No description added.'}</p><button onClick={() => setEditingDescription(true)}>Edit</button></>}</div><div className="status-box"><h3>Status</h3><label className="switch"><input type="checkbox" checked={hotel.status === 'open'} onChange={() => updateHotel({ status: hotel.status === 'open' ? 'closed' : 'open' })} /><span className="slider"></span></label><span>{displayLabel(hotel.status)}</span></div></div>
      <div className="grid-container"><div className="rooms-box"><div className="rooms-header"><h3>Rooms</h3><button className="nav-button" onClick={() => navigate('/rooms')}>Go to Edit Page</button></div></div><div className="amenities-box"><h3>Amenities</h3><div className="amenities-grid">{hotel.amenities.map(item => <span key={item.id}>{item.name}</span>)}<input value={newAmenity} onChange={event => setNewAmenity(event.target.value)} placeholder="New amenity" /><button onClick={addAmenity}>Add</button></div></div></div>
    </main><Footer /></div>;
};
export default ManagerDashboard;
