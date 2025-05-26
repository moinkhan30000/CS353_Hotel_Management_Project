import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';
import './GuestPaymentHistory.css'; // optional if you extract CSS

interface Transaction {
  id: string;
  status: 'Completed' | 'Pending' | 'Failed';
  amount: number;
  type: 'Reservation' | 'Top-up' | 'Penalty';
}

const GuestPaymentHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN12345', status: 'Completed', amount: 150, type: 'Reservation' },
    { id: 'TXN12346', status: 'Completed', amount: 300, type: 'Top-up' },
    { id: 'TXN12347', status: 'Failed', amount: 200, type: 'Reservation' },
    { id: 'TXN12348', status: 'Completed', amount: 20, type: 'Penalty' },
  ]);

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
              <span className="user-name">Moin Khan ▼</span>
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
                {txn.id} | {txn.status} | {txn.amount} TL | {txn.type}
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
