import React from "react";
import "./ManagerProfile.css";

const ManagerProfilePage = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">HORIZONSTAY</div>
        <nav className="managerprofilenav">
          <a href="/managerhoteldashboard">Hotel</a>
          <div className="managerprofile-button">
            <span>Moin Khan</span>
            <span className="icon">👤</span>
          </div>
        </nav>
      </header>

      <main className="main">
        <h1 className="welcome">Welcome</h1>
        <div className="profile-box">
          <h2>Manager Profile Details</h2>
          <div className="profile-field">Username</div>
          <div className="profile-field">Email</div>
          <div className="profile-field">Hotel Name</div>
          <div className="profile-field">Phone Number</div>
          <div className="profile-field">Address</div>
          <div className="profile-field">Country</div>
          <div className="profile-field">City</div>
          <div className="profile-field">Password</div>
          <button className="edit-button">Edit</button>
        </div>
      </main>
    </div>
  );
};

export default ManagerProfilePage;