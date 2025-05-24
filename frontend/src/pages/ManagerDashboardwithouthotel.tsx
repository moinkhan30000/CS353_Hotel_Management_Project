import React, { useState } from 'react';
import './ManagerDashboardwithouthotel.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
const ManagerDashboardwoHotel = () => {
    const navigate = useNavigate();

 return (
    <div className="dashboard-container">
        <header className="dashboard-header">
            <h1 className="brand">HORIZONSTAY</h1>
            <div className="user-info">
                <span>Moin Khan</span>
                <span>👤</span>
            </div>
        </header>
        <div className="welcome-section">
            <h2 className="welcome-title">Welcome</h2>
        </div>
        <main className="dashboard-main">
            <div className="grid-container">
                <div className="register-card">
                    <h2>Register Hotel</h2>
                    <div className="register-box">
                        <div className="plus-icon">+</div>
                    </div>
                    <button className="register-button" onClick={() => navigate('/register/hotel')}>
                        <span className="btn-icon">🏨</span> Register Hotel
                    </button>
                </div>
                <div className="manage-account">
                    <h2>Manage Account</h2>
                    <li><a href="#">Personal Details</a></li>

                </div>
            </div>
        </main>
        <Footer/>
    </div>
    
  );
};

export default ManagerDashboardwoHotel;
