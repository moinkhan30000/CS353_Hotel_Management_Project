import React from "react";
import "./AdminDashboard.css";
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
    const navigate = useNavigate();
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">HORIZONSTAY</div>
        <nav className="nav-links">
          <a href="/">Logout</a>
          <a href="#">Hotels</a>
        </nav>
        <div className="profile">
          <span className="profile-name">Moin Khan</span>
          <span className="profile-icon">👤</span>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome Administrator</h1>
          <h3>Personal Details</h3>
          <a href ="/admindashboard/profile">Manage Account</a>
          
        </div>

        <div className="button-section">
          <button className="dashboard-button" >Generate Report</button>
          
          <button className="dashboard-button" onClick={() => navigate('/admindashboard/reports')}>Report List</button>
        </div>
        
      </main>
      <Footer />
    </div>
    
  );
};

export default AdminDashboard;
