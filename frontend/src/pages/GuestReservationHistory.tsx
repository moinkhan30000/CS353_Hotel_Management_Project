import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Status = 'Upcoming' | 'Completed' | 'Cancelled' | 'Passed';

interface Reservation {
  bookingId: string;
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
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      bookingId: 'R12345',
      bookingDate: '2025-05-01',
      guestCount: 2,
      hotelName: 'Oasis Hotel',
      status: 'Completed',
      amountPaid: 400,
      amountDue: 0,
      checkIn: '2025-05-10',
      checkOut: '2025-05-15',
    },
    {
      bookingId: 'R12346',
      bookingDate: '2025-05-10',
      guestCount: 1,
      hotelName: 'Istanbul Hotel',
      status: 'Upcoming',
      amountPaid: 150,
      amountDue: 150,
      checkIn: '2025-06-20',
      checkOut: '2025-06-23',
    },
    {
      bookingId: 'R12347',
      bookingDate: '2025-04-15',
      guestCount: 3,
      hotelName: 'Ankara Hotel',
      status: 'Cancelled',
      amountPaid: 200,
      amountDue: 0,
      checkIn: '2025-04-20',
      checkOut: '2025-04-25',
    },
  ]);

  const [enrolledInLoyalty] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const handleClear = () => {
    const filtered = reservations.filter(r => r.status === 'Upcoming');
    toast.success('Cleared past reservations!');
    setReservations(filtered);
  };

  const handlePay = (bookingId: string) => {
    toast.info(`Redirecting to payment for ${bookingId}`);
    window.location.href = '/payment';
  };

  const handleCancel = (bookingId: string) => {
    setPendingCancelId(bookingId);
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    if (!pendingCancelId) return;

    const updated: Reservation[] = reservations.map(r => {
      if (r.bookingId === pendingCancelId && r.status === 'Upcoming') {
        const today = new Date();
        const checkIn = new Date(r.checkIn);
        const daysBefore = (checkIn.getTime() - today.getTime()) / (1000 * 3600 * 24);

        if (daysBefore >= 7) {
          toast.warn(`Booking ${pendingCancelId} cancelled. 10% penalty applied.`);
          return { ...r, status: 'Cancelled', amountPaid: r.amountPaid * 0.9 };
        }

        toast.error('Cannot cancel less than 7 days before check-in.');
      }
      return r;
    });

    setReservations(updated);
    setShowConfirm(false);
    setPendingCancelId(null);
  };

  const getPointsInfo = (reservation: Reservation): string => {
    if (!enrolledInLoyalty) return '--';
    if (reservation.status === 'Cancelled' || reservation.status === 'Passed') return '0';
    const totalAmount = reservation.amountPaid + reservation.amountDue;
    const points = Math.floor(totalAmount / 10);
    if (reservation.status === 'Completed') return `${points} earned`;
    if (reservation.status === 'Upcoming') return `${points} if completed`;
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
                {r.status === 'Upcoming' && (
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
