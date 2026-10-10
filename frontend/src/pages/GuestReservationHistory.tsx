import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../services/api';

type Status = 'pending' | 'confirmed' | 'cancelled';

interface Reservation {
  bookingId: number;
  bookingDate: string;
  guestCount: number;
  hotelName: string;
  status: Status;
  amountPaid: number;
  amountDue: number;
  checkIn: string;
  checkOut: string;
}

const GuestReservationHistory = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    api<Array<{ id: number; created_at: string; guests: unknown[]; hotel: { name: string }; status: Status; amount_due: string; check_in: string; check_out: string }>>('/bookings/')
      .then(items => setReservations(items.map(item => ({ bookingId: item.id, bookingDate: item.created_at.slice(0, 10), guestCount: item.guests.length, hotelName: item.hotel.name, status: item.status, amountPaid: item.status === 'confirmed' ? Number(item.amount_due) : 0, amountDue: item.status === 'pending' ? Number(item.amount_due) : 0, checkIn: item.check_in, checkOut: item.check_out }))));
  }, []);

  const [enrolledInLoyalty] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);

  const handleClear = () => {
    const filtered = reservations.filter(r => r.status !== 'cancelled');
    toast.success('Cleared past reservations!');
    setReservations(filtered);
  };

  const handlePay = async (bookingId: number) => {
    try {
      await api(`/bookings/${bookingId}/pay/`, { method: 'POST' });
      setReservations(items => items.map(item => item.bookingId === bookingId ? { ...item, status: 'confirmed', amountPaid: item.amountDue, amountDue: 0 } : item));
      toast.success(`Booking ${bookingId} paid.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed.');
    }
  };

  const handleCancel = (bookingId: number) => {
    setPendingCancelId(bookingId);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    if (!pendingCancelId) return;

    try {
      await api(`/bookings/${pendingCancelId}/cancel/`, { method: 'POST' });
      setReservations(items => items.map(item => item.bookingId === pendingCancelId ? { ...item, status: 'cancelled' } : item));
      toast.warn(`Booking ${pendingCancelId} cancelled.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancellation failed.');
    } finally {
      setShowConfirm(false);
      setPendingCancelId(null);
    }
  };

  const getPointsInfo = (reservation: Reservation): string => {
    if (!enrolledInLoyalty) return '--';
    if (reservation.status === 'cancelled') return '0';
    const totalAmount = reservation.amountPaid + reservation.amountDue;
    const points = Math.floor(totalAmount / 10);
    if (reservation.status === 'confirmed') return `${points} earned`;
    if (reservation.status === 'pending') return `${points} if completed`;
    return '0';
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
          <h2 className="dashboard-title">Reservation History</h2>

          <div className="payment-history-container">
            <div className="payment-history-header">
              Booking Id | Booking Date | Guest Count | Hotel Name | Status | Actions
            </div>
            {reservations.map((r, index) => (
              <div key={index} className="transaction-row">
                <div style={{ flex: 1 }}>
                  <div>{r.bookingId} | {r.bookingDate} | {r.guestCount} guest(s) | {r.hotelName} | {r.status}</div>
                  <div>Stay: {r.checkIn} → {r.checkOut}</div>
                  <div>Total Paid: {r.amountPaid} TL</div>
                  <div>Loyalty Points: {getPointsInfo(r)}</div>
                </div>
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span>{r.amountPaid} TL paid | {r.amountDue} TL due</span>
                    <button className="pay-button" onClick={() => handlePay(r.bookingId)}>Pay</button>
                    <button className="cancel-button" onClick={() => handleCancel(r.bookingId)}>Cancel</button>
                  </div>
                )}
              </div>
            ))}

            <div className="payment-history-actions">
              <button className="cancel-button" onClick={handleClear}>Clear History</button>
              <button className="close-button" onClick={() => window.location.href='/guest-dashboard'}>Back</button>
            </div>
          </div>

          {showConfirm && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirm Cancellation</h3>
                <p>
                  Are you sure you want to cancel this reservation?<br />
                  A <strong>10% penalty</strong> will apply if eligible.
                </p>
                <div className="modal-actions">
                  <button className="cancel-button" onClick={confirmCancel}>Yes, Cancel</button>
                  <button className="close-button" onClick={() => setShowConfirm(false)}>No</button>
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

export default GuestReservationHistory;
