import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';
import './GuestPaymentHistory.css';
import { api, currentUser } from '../services/api';

interface Transaction {
  id: number;
  status: string;
  amount: string;
  transaction_type: string;
}

const GuestPaymentHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const user = currentUser();

  useEffect(() => {
    api<{ transactions: Transaction[] }>('/wallet/').then(value => setTransactions(value.transactions));
  }, []);

  const clearHistory = () => {
    setTransactions([]);
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
              <span className="user-name">{user ? `${user.first_name} ${user.last_name}` : 'Guest'}</span>
            </div>
          </nav>
        </header>

        <main className="dashboard-main styled-background">
          <h2 className="dashboard-title">Payment History</h2>

          <div className="payment-history-container">
            <div className="payment-history-header">
              Transaction Id | Status | Amount | Type
            </div>

            {transactions.map((txn, index) => (
              <div key={index} className="transaction-row">
                {txn.id} | {txn.status} | {Number(txn.amount).toFixed(2)} | {txn.transaction_type.replace('_', ' ')}
              </div>
            ))}

            {transactions.length === 0 && (
              <p style={{ marginTop: '1rem' }}>No transaction history available.</p>
            )}

            <div className="payment-history-actions">
              <button className="cancel-button" onClick={clearHistory}>Clear History</button>
              <button className="close-button" onClick={() => window.location.href='/guest-dashboard'}>Back</button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default GuestPaymentHistory;
