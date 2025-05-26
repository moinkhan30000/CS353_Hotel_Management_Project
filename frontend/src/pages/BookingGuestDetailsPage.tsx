import React, { useState } from 'react';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader';
import Footer from '../components/Footer/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingGuestDetailsPage.css';

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

  const handleReserve = () => {
    if (!isFormValid()) {
      alert('Please fill all fields correctly.');
      return;
    }
    setDisabled(true);
    setFormData(createInitialData());
    setShowReceipt(true);
  };

  const handleReceiptClose = () => navigate('/guest-dashboard');

  const mockUsername = 'GuestUser';
  const handleLogout = () => {
    console.log('Logged out');
    navigate('/login');
  };

  return (
    <div className="guest-details-page">
      <PrivateHeader username={mockUsername} onLogout={handleLogout} />
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
            <p><strong>Wallet ID:</strong> 39495347</p>
            <p><strong>Balance:</strong> 2763.25 TL</p>
            <button onClick={handleTopUp}>TOP-UP</button>
          </div>
          <div className="payment-box">
            <p><strong>Payment</strong></p>
            <p className="amount">10,000 TL</p>
            <button className="reserve-btn" onClick={handleReserve}>Confirm & Pay</button>
          </div>
        </div>
      </div>

      {showReceipt && (
        <div className="receipt-modal">
          <div className="receipt-content">
            <h3>Transaction Details</h3>
            <p className="check-icon">✔️</p>
            <h4>Payment Successful</h4>
            <p>Thank you for confirming your reservation at Oasis Hotel from 12-09-25 till 20-09-25. We hope your stay goes smoothly, thank you for choosing HorizonStay</p>
            <p><strong>Transaction ID:</strong> 9328448AFK</p>
            <p><strong>Status:</strong> Successful</p>
            <p><strong>Transaction Amount:</strong> 10,000 TL</p>
            <p><strong>Method of Payment:</strong> Wallet</p>
            <p><strong>Transaction Type:</strong> Reservation</p>
            <p><strong>Points Earned:</strong> 3000 Points</p>
            <button onClick={handleReceiptClose}>OK</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingGuestDetailsPage;