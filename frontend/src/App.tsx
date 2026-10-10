import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import LoginManagerPage from './pages/LoginManagerPage';
import LoginGuestPage from './pages/LoginGuestPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterChoicePage from './pages/RegisterChoicePage';
import RegisterManagerPage from './pages/RegisterManagerPage';
import RegisterGuestPage from './pages/RegisterGuestPage';
import HotelRegisterPage from './pages/HotelRegisterPage';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerDashboardwoHotel from './pages/ManagerDashboardwithouthotel';
import GuestDashboard from './pages/GuestDashboard';
import ManagerProfilePage from './pages/ManagerProfile';
import Contact from './pages/Contact';
import LoginchoicePage from './pages/Loginchoice';
import ManageBookingPage from './pages/ManageBookingPage';
import EditHotelImagesPage from './pages/EditHotelImagesPage';
import HotelReviewsPage from './pages/HotelReviewPage'; 
import ManageRoomsPage from './pages/ManageRoomsPage';
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import ReportsPage from './pages/Reportlist';
import ReportDetailsPage from './pages/Reportview';
import GuestPaymentHistory from './pages/GuestPaymentHistory';
import GuestProfile from './pages/GuestProfile';
import GuestReservationHistory from './pages/GuestReservationHistory';
import GuestReviewPage from './pages/GuestReviewPage';
import GuestTopUpPage from './pages/GuestTopUpPage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailsPage';
import HotelReviewPageView from './pages/HotelReviewPageView';
import BookingGuestDetailsPage from './pages/BookingGuestDetailsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const guest = (element: ReactNode) => <ProtectedRoute role="guest">{element}</ProtectedRoute>;
const manager = (element: ReactNode) => <ProtectedRoute role="manager">{element}</ProtectedRoute>;
const admin = (element: ReactNode) => <ProtectedRoute role="admin">{element}</ProtectedRoute>;


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginchoicePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegisterChoicePage />} />
        <Route path="/register/manager" element={<RegisterManagerPage />} />
        <Route path="/register/guest" element={<RegisterGuestPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/manage-bookings" element={manager(<ManageBookingPage />)} />
        <Route path="/register/hotel" element={manager(<HotelRegisterPage />)} />
        <Route path="/login/manager" element={<LoginManagerPage />} />
        <Route path="/login/guest" element={<LoginGuestPage />} />
        <Route path="/managerdashboard" element={manager(<ManagerDashboardwoHotel />)} />
        <Route path="/managerhoteldashboard" element={manager(<ManagerDashboard />)} />
        <Route path="/managerprofile" element={manager(<ManagerProfilePage />)} />
        <Route path="/guest-dashboard" element={guest(<GuestDashboard />)} />
        <Route path="/edit-hotel-images" element={manager(<EditHotelImagesPage />)} />
        <Route path="/reviews" element={manager(<HotelReviewsPage />)} />
        <Route path="/rooms" element={manager(<ManageRoomsPage />)} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/admindashboard" element={admin(<AdminDashboard />)} />
        <Route path="/admindashboard/profile" element={admin(<AdminProfile />)} />
        <Route path="/admindashboard/reports" element={admin(<ReportsPage />)} />
        <Route path="/admindashboard/reports/view" element={admin(<ReportDetailsPage />)} />
        <Route path="/payment-history" element={guest(<GuestPaymentHistory />)} />
        <Route path="/guest-profile" element={guest(<GuestProfile />)} />
        <Route path="/reservation-history" element={guest(<GuestReservationHistory />)} />
        <Route path="/guest-reviews" element={guest(<GuestReviewPage />)} />
        <Route path="/guest-topup" element={guest(<GuestTopUpPage />)} />
        <Route path="/properties" element={<PropertyListingPage />} />
        <Route path="/properties/:propertyId" element={<PropertyDetailPage />} />
        <Route path="/reviews_view" element={<HotelReviewPageView />} />
        <Route path="/booking" element={guest(<BookingGuestDetailsPage />)} />


      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </Router>
  );
}

export default App;
