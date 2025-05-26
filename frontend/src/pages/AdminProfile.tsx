import React from "react";
import "./AdminProfile.css";
import Footer from '../components/Footer/Footer';
const AdminProfile = () => {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="logo">HORIZONSTAY</div>
        <nav>
          <a href="/">Logout</a>
          <a href="/admindashboard">Dashboard</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="profile-user">
          <span>Moin Khan</span>
          <div className="user-icon">👤</div>
        </div>
      </header>

      <div className="profile-content">
        <h1>Welcome</h1>
        <div className="profile-card">
          <h2>Administrator Profile Details</h2>
          <div className="profile-field">Username</div>
          <div className="profile-field">Email</div>
          <div className="profile-field">Hotel Name</div>
          <div className="profile-field">Phone Number</div>
          <div className="profile-field">Address</div>
          <div className="profile-field">Country</div>
          <div className="profile-field">City</div>
          <div className="profile-field">Password</div>

          <div className="button-group">
            <button className="edit-btn">Edit</button>
            <button className="access-btn">Access Level</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProfile;
