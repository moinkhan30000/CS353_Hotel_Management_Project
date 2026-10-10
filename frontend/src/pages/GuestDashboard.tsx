import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Footer from '../components/Footer/Footer';
import { api, currentUser, logout } from '../services/api';
import './ManagerDashboard.css';
import './GuestDashboard.css';

interface Booking { id: number; hotel: { name: string; city: string; country: string }; amount_due: string; check_in: string; check_out: string; status: string; guests: { name: string; age: number }[] }

const GuestDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]); const [selected, setSelected] = useState<Booking | null>(null); const [balance, setBalance] = useState(0); const [points, setPoints] = useState(0); const [redeemAmount, setRedeemAmount] = useState(''); const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = currentUser();
  const load = () => Promise.all([api<Booking[]>('/bookings/'), api<{ balance: string }>('/wallet/'), api<{ points: number }>('/loyalty/')]).then(([items, wallet, loyalty]) => { setBookings(items.filter(item => item.status !== 'cancelled')); setBalance(Number(wallet.balance)); setPoints(loyalty.points); });
  useEffect(() => { load(); }, []);
  const cancel = async () => { if (!selected) return; await api(`/bookings/${selected.id}/cancel/`, { method: 'POST' }); setBookings(items => items.filter(item => item.id !== selected.id)); setSelected(null); toast.success('Reservation cancelled.'); };
  const redeem = async () => { try { const result = await api<{ points: number; balance: string }>('/loyalty/redeem/', { method: 'POST', body: JSON.stringify({ points: Number(redeemAmount) }) }); setPoints(result.points); setBalance(Number(result.balance)); setRedeemAmount(''); toast.success('Points redeemed into your wallet.'); } catch (err) { toast.error(err instanceof Error ? err.message : 'Unable to redeem points.'); } };
  return <div className="page-wrapper"><div className="dashboard-container"><header className="dashboard-header"><div className="header-left"><h1 className="brand">HORIZONSTAY</h1></div><nav className="dashboard-nav"><a href="/" className="nav-link">Home</a><div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}><span className="user-name">{user ? `${user.first_name} ${user.last_name}` : 'Guest'}</span>{dropdownOpen && <div className="dropdown-content"><a href="/" onClick={logout}>Logout</a></div>}</div></nav></header>
    <main className="dashboard-main styled-background"><h2 className="dashboard-title">Welcome</h2><section className="reservations-section"><div className="section-header"><h3>Reservation Cards</h3></div><div className="reservation-grid">{bookings.map(booking => <div key={booking.id} className="reservation-card" onClick={() => setSelected(booking)}><p className="reservation-hotel">{booking.hotel.name}</p><p className="reservation-id">Booking ID: {booking.id}</p></div>)}{!bookings.length && <p>No active reservations.</p>}</div></section>
      {selected && <div className="popup"><h3>{selected.hotel.name}</h3><p>{selected.hotel.city}, {selected.hotel.country}</p><p>Check-in: {selected.check_in}</p><p>Check-out: {selected.check_out}</p><p>Amount: {Number(selected.amount_due).toFixed(2)}</p><p>Status: {selected.status}</p><button onClick={cancel}>Cancel Reservation</button><button onClick={() => setSelected(null)}>Close</button></div>}
      <section className="wallet-section"><h3>Wallet</h3><p>Balance: {balance.toFixed(2)}</p><a href="/guest-topup">Top up</a> | <a href="/payment-history">Payment history</a></section>
      <section className="loyalty-section"><h3>Loyalty Points</h3><p>{points} points</p><input type="number" min="1" value={redeemAmount} onChange={event => setRedeemAmount(event.target.value)} placeholder="Points to redeem" /><button onClick={redeem}>Redeem</button></section>
      <div className="payment-history-actions"><a href="/reservation-history">Reservation history</a><a href="/guest-reviews">Reviews</a><a href="/guest-profile">Profile</a></div>
    </main><Footer /></div></div>;
};
export default GuestDashboard;
