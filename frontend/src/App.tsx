import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/manage-bookings" element={<ManageBookingPage />} />
        <Route path="/register/hotel" element={<HotelRegisterPage />} />
        <Route path="/login/manager" element={<LoginManagerPage />} />
        <Route path="/login/guest" element={<LoginGuestPage />} />
        <Route path="/managerdashboard" element={<ManagerDashboardwoHotel />} />
        <Route path="/managerhoteldashboard" element={<ManagerDashboard />} />
        <Route path="/managerprofile" element={<ManagerProfilePage />} />
        <Route path="/guest-dashboard" element={<GuestDashboard />} />
        <Route path="/edit-hotel-images" element={<EditHotelImagesPage />} />
        <Route path="/reviews" element={<HotelReviewsPage />} />
        <Route path="/rooms" element={<ManageRoomsPage />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admindashboard/profile" element={<AdminProfile />} />
        <Route path="/admindashboard/reports" element={<ReportsPage />} />
        <Route path="/admindashboard/reports/view" element={<ReportDetailsPage />} />
        <Route path="/payment-history" element={<GuestPaymentHistory />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </Router>
  );
}

export default App;
