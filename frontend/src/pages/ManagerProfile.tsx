import React, { useState } from 'react';
import './ManagerProfile.css';

const ManagerProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Moin Khan',
    email: 'moin@example.com',
    hotel: 'Oasis Hotel',
    phone: '+1234567890',
    address: '123 Main St',
    country: 'USA',
    city: 'New York',
    password: '********'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">HORIZONSTAY</div>
        <nav className="managerprofilenav">
          <a href="/managerhoteldashboard">Dashboard</a>
          <div className="managerprofile-button">
            <span>{profile.name}</span>
            <span className="icon">👤</span>
          </div>
        </nav>
      </header>

      <main className="main">
        <h1 className="welcome">Welcome</h1>
        <div className="profile-box">
          <h2>Manager Profile Details</h2>
          {Object.entries(profile).map(([key, value]) => (
            <div className="profile-field" key={key}>
              <label className="field-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <span className="field-value">{value}</span>
              )}
            </div>
          ))}
          <button className="edit-button" onClick={toggleEdit}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ManagerProfilePage;