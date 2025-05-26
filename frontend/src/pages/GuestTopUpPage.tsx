import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './GuestDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const GuestTopUpPage = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const walletId = '39495347';
  const currentBalance = 2763.25;

  const isValidCardDetails = () => {
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3,4}$/;
    const month = parseInt(expMonth);
    const year = parseInt(expYear);
    const currentDate = new Date();
    const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2));
    const currentMonth = currentDate.getMonth() + 1;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid top-up amount.');
      return false;
    }
    if (!cardRegex.test(cardNumber)) {
      toast.error('Card number must be exactly 16 digits.');
      return false;
    }
    if (!cvvRegex.test(cvv)) {
      toast.error('CVV must be 3 or 4 digits.');
      return false;
    }
    if (isNaN(month) || month < 1 || month > 12) {
      toast.error('Invalid expiry month.');
      return false;
    }
    if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error('Card has expired.');
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (!isValidCardDetails()) return;
    setShowPopup(true);
  };

  const handleClose = () => {
    setAmount('');
    setCardNumber('');
    setExpMonth('');
    setExpYear('');
    setCvv('');
    setShowPopup(false);
    navigate('/guest-dashboard');
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="brand">HORIZONSTAY</h1>
          </div>
          <nav className="dashboard-nav">
            <a href="/guest-dashboard" className="nav-link">Home</a>
            <div className="user-info">
              <span className="user-name">Moin Khan ▼</span>
            </div>
          </nav>
        </header>

        <main className="dashboard-main styled-background">
          <h2 className="dashboard-title">Top-Up</h2>
          <div className="payment-history-container">
            <p><strong>Wallet ID:</strong> {walletId}</p>
            <p><strong>Current Balance:</strong> {currentBalance.toFixed(2)}</p>
            <input
              className="transaction-row"
              placeholder="Amount Recharge"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              type="number"
              min="1"
              step="0.01"
            />
            <input
              className="transaction-row"
              placeholder="Credit/Debit Card Number"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              maxLength={16}
              inputMode="numeric"
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <input
                className="transaction-row"
                placeholder="MM"
                value={expMonth}
                onChange={e => setExpMonth(e.target.value)}
                style={{ flex: 1 }}
                maxLength={2}
                inputMode="numeric"
              />
              <input
                className="transaction-row"
                placeholder="YY"
                value={expYear}
                onChange={e => setExpYear(e.target.value)}
                style={{ flex: 1 }}
                maxLength={2}
                inputMode="numeric"
              />
              <input
                className="transaction-row"
                placeholder="CVV"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                style={{ flex: 1 }}
                maxLength={4}
                inputMode="numeric"
              />
            </div>
            <div className="payment-history-actions">
              <button className="pay-button" onClick={handleConfirm}>Confirm</button>
            </div>
          </div>

          {showPopup && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Transaction Details</h3>
                <hr />
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Top-Up Successful</p>
                  <p><strong>Transaction ID:</strong> 9328448AFK</p>
                  <p><strong>Status:</strong> Successful</p>
                  <p><strong>Transaction Amount:</strong> {parseFloat(amount).toFixed(2).toLocaleString()} TL</p>
                  <p><strong>Method of Payment:</strong> Credit Card</p>
                  <p><strong>Transaction Type:</strong> Top-Up</p>
                  <button className="pay-button" onClick={handleClose}>OK</button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default GuestTopUpPage;
