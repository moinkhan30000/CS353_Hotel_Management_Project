import React from 'react';
import './Reportview.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
const ReportDetailsPage = () => {
    const navigate = useNavigate();
  return (
    <div className="page-container">
      <header className="reportviewheader">
        <div className="logo">HORIZONSTAY</div>
        <div className="profile-button">Moin Khan <span className="profile-icon">👤</span></div>
      </header>

      <main className="reportmain">
        <h1 className="welcome-text">Welcome</h1>

        <div className="reports-box">
          <h2 className="reports-title">Report</h2>
          <p>
            Discover the perfect blend of comfort, elegance, and calm at Oasis Hotel.
            Designed as a sanctuary amidst the city’s bustle, Oasis offers beautifully
            appointed rooms, a serene courtyard garden, and world-class hospitality.
            Wake up to peaceful mornings, indulge in gourmet dining at our signature
            restaurant, or unwind in our rooftop pool with skyline views. Whether you’re
            here for a quick escape or an extended stay, Oasis Hotel welcomes you to relax,
            recharge, and feel at home.
          </p>
          <p><strong>Report ID:</strong> 39495347</p>
        </div>

        <div className="button-group">
          
          <button className="back-button" onClick={() => navigate('/admindashboard/reports')}>Back</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetailsPage;