import React from 'react';
import './Reportlist.css';
import { useNavigate } from 'react-router-dom';
const ReportsPage = () => {
    const navigate = useNavigate();
  return (
    <div className="page-container">
      <header className="header">
        <div className="logo">HORIZONSTAY</div>
        <div className="profile-button">Moin Khan <span className="profile-icon">👤</span></div>
      </header>

      <main className="main">
        <h1 className="welcome-text">Welcome</h1>
        <div className="reports-box">
          <h2 className="reports-title">Reports List</h2>

          <div className="report-header">Report Id | Date | Time</div>

          <div className="report-row">
            <div className="report-details">Report Id | Date | Time</div>
            <div className="report-actions">
              <button className="edit-button">Edit</button>
              <button className="download-button" onClick={() => navigate('/admindashboard/reports/view')}>View</button>
            </div>
          </div>


          <button className="back-button" onClick={() => navigate('/admindashboard')}>Back</button>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
