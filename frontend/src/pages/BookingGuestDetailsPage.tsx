import { useEffect, useState } from 'react';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader';
import Footer from '../components/Footer/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingGuestDetailsPage.css';
import { api, currentUser, logout } from '../services/api';

interface GuestFormData {
  username: string;
  email: string;
  phone: string;
  identity: string;
  gender: string;
  dob: string;
  isMyself: boolean;
}

type GuestField = keyof GuestFormData;

const BookingGuestDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const guestCount = Math.max(parseInt(query.get('guests') || '1', 10), 1);
  const roomId = Number(query.get('room'));
  const checkIn = query.get('checkIn') || '';
  const checkOut = query.get('checkOut') || '';

  const createInitialData = () =>
    Array.from({ length: guestCount }, () => ({
      username: '',
      email: '',
      phone: '',
      identity: '',
      gender: '',
      dob: '',
      isMyself: false,
    }));

  const [formData, setFormData] = useState<GuestFormData[]>(createInitialData());
  const [disabled, setDisabled] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    api<{ balance: string }>('/wallet/').then(value => setBalance(Number(value.balance))).catch(() => setPaymentError('Please log in as a guest to complete this booking.'));
    api<{ price: string }>(`/rooms/${roomId}/`).then(room => {
      const nights = Math.max(1, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
      setAmountDue(Number(room.price) * nights);
    }).catch(() => setPaymentError('This room is no longer available.'));
  }, [checkIn, checkOut, roomId]);

  const handleChange = (index: number, field: GuestField, value: string | boolean) => {
    const updated = [...formData];
    if (field === 'username' && typeof value === 'string') {
      value = value.replace(/[^a-zA-Z ]/g, '');
    }
    if (field === 'phone' && typeof value === 'string') {
      value = value.replace(/^0|[^0-9]/g, '').slice(0, 10);
    }
    if (field === 'identity' && typeof value === 'string') {
      value = value.replace(/^0|[^0-9]/g, '').slice(0, 11);
    }
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData(updated);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = () => {
    return formData.every(
      guest =>
        guest.username.trim().length > 0 &&
        isValidEmail(guest.email) &&
        /^[1-9][0-9]{9}$/.test(guest.phone) &&
        /^[1-9][0-9]{10}$/.test(guest.identity) &&
        guest.gender &&
        guest.dob
    );
  };

  const handleTopUp = () => navigate('/guest-topup');

  const handleReserve = async () => {
    if (!isFormValid()) {
      alert('Please fill all fields correctly.');
      return;
    }
    try {
      const booking = await api<{ id: number; amount_due: string }>('/bookings/', {
        method: 'POST',
        body: JSON.stringify({ room: roomId, check_in: checkIn, check_out: checkOut, guests: formData.map(guest => ({ name: guest.username, age: Math.max(1, new Date().getFullYear() - new Date(guest.dob).getFullYear()) })) }),
      });
      await api(`/bookings/${booking.id}/pay/`, { method: 'POST' });
      setTransactionId(String(booking.id));
      setBalance(value => value - Number(booking.amount_due));
      setDisabled(true);
      setShowReceipt(true);
      setPaymentError('');
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Unable to complete the booking.');
    }
  };

  const handleReceiptClose = () => navigate('/guest-dashboard');

  const user = currentUser();
  const username = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'Guest';
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="guest-details-page">
      <PrivateHeader username={username} onLogout={handleLogout} />
      <div className="guest-form-wrapper">
        {formData.map((guest, i) => (
          <div className="guest-card" key={i}>
            <h2>Guest Details ({i + 1})</h2>
            <input disabled={disabled} placeholder="Username" value={guest.username} onChange={(e) => handleChange(i, 'username', e.target.value)} />
            <input disabled={disabled} placeholder="Email" value={guest.email} onChange={(e) => handleChange(i, 'email', e.target.value)} />
            <input disabled={disabled} placeholder="Phone Number" value={guest.phone} onChange={(e) => handleChange(i, 'phone', e.target.value)} />
            <input disabled={disabled} placeholder="Identity Number" value={guest.identity} onChange={(e) => handleChange(i, 'identity', e.target.value)} />
            <select disabled={disabled} value={guest.gender} onChange={(e) => handleChange(i, 'gender', e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="dob-row">
              <label>Date of Birth</label>
              <input disabled={disabled} type="date" value={guest.dob} onChange={(e) => handleChange(i, 'dob', e.target.value)} />
            </div>
            <label className="myself-checkbox">
              <input disabled={disabled} type="checkbox" checked={guest.isMyself} onChange={(e) => handleChange(i, 'isMyself', e.target.checked)} /> Myself
            </label>
          </div>
        ))}

        <div className="wallet-summary">
          <div className="wallet-card">
            <p><strong>Wallet:</strong> Guest wallet</p>
            <p><strong>Balance:</strong> {balance.toFixed(2)}</p>
            <button onClick={handleTopUp}>TOP-UP</button>
          </div>
          <div className="payment-box">
            <p><strong>Payment</strong></p>
            <p className="amount">{amountDue.toFixed(2)}</p>
            <button className="reserve-btn" onClick={handleReserve}>Confirm & Pay</button>
            {paymentError && <p className="error-message">{paymentError}</p>}
          </div>
        </div>
      </div>

      {showReceipt && (
        <div className="receipt-modal">
          <div className="receipt-content">
            <h3>Transaction Details</h3>
            <p className="check-icon">✔️</p>
            <h4>Payment Successful</h4>
            <p>Thank you for confirming your reservation from {checkIn} until {checkOut}. We hope your stay goes smoothly.</p>
            <p><strong>Transaction ID:</strong> {transactionId}</p>
            <p><strong>Status:</strong> Successful</p>
            <p><strong>Transaction Amount:</strong> {amountDue.toFixed(2)}</p>
            <p><strong>Method of Payment:</strong> Wallet</p>
            <p><strong>Transaction Type:</strong> Reservation</p>
            <p><strong>Points Earned:</strong> {Math.floor(amountDue / 10)} Points</p>
            <button onClick={handleReceiptClose}>OK</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingGuestDetailsPage;
