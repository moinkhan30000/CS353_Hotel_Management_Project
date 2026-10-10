import  { useState } from 'react';
import './ManagerDashboardwithouthotel.css';
import Footer from '../components/Footer/Footer'; 
import { useNavigate } from 'react-router-dom';
import { currentUser, logout } from '../services/api';

const ManagerDashboardwoHotel = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = currentUser();

  const handleLogout = () => {

    logout();
    navigate('/');
  };

  return (
    <>
      <header className="manager-custom-header">
        <div className="manager-header-left" onClick={() => navigate('/managerdashboard')}>
          <h1>HORIZONSTAY</h1>
        </div>
        <div className="manager-header-right">
          <span className="manager-header-home" onClick={() => navigate('/managerdashboard')}>Home</span>
          <div className="manager-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>{user ? `${user.first_name} ${user.last_name}` : 'Manager'}</span>
            <span>👤</span>
            {dropdownOpen && (
              <div className="manager-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="manager-dashboard-container">
        <div className="manager-welcome-section">
          <h2 className="manager-welcome-title">Welcome</h2>
        </div>

        <div className="manager-dashboard-main">
          <div className="manager-grid-container">
            <div className="manager-register-card">
              <h2>Register Hotel</h2>
              <div className="manager-register-box">
                <div className="plus-icon">+</div>
              </div>
              <button
                className="manager-register-button"
                onClick={() => navigate('/register/hotel')}
              >
                <span className="manager-btn-icon">🏨</span> Register Hotel
              </button>
            </div>

            <div className="manager-account-box">
              <h2>Manage Account</h2>
              <ul>
                <li><a href="/managerprofile">Personal Details</a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ManagerDashboardwoHotel;
