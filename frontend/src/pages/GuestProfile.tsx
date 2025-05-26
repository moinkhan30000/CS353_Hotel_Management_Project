import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './GuestDashboard.css';

const GuestProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    username: 'guest_user',
    email: 'guest@example.com',
    phone: '+1234567890',
    identityNumber: 'ID123456789',
    gender: 'Male',
    dob: '1995-04-20',
    password: 'Guest@1234',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setChangePassword(false);
    setError('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = () => {
    if (changePassword) {
      if (oldPassword !== profile.password) {
        setError('Old password is incorrect.');
        return;
      }
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
      if (!regex.test(newPassword)) {
        setError('Password must be 8+ chars, include upper, lower, number, special char.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setProfile({ ...profile, password: newPassword });
    }
    setIsEditing(false);
    setChangePassword(false);
    setError('');
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="brand">HORIZONSTAY</h1>
          </div>
          <nav className="dashboard-nav">
            <a href="/guest-dashboard" className="nav-link">Home</a>
            <div className="user-info">
              <span className="user-name">Moin Khan ▼</span>
            </div>
          </nav>
        </header>

        <main className="dashboard-main styled-background">
          <h2 className="dashboard-title">Profile Details</h2>

          <div className="payment-history-container">
            {Object.entries(profile).map(([key, value]) => (
              key !== 'password' && (
                <div key={key} className="transaction-row">
                  <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
                  {isEditing ? (
                    key === 'gender' ? (
                      <select name={key} value={value} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type={key === 'dob' ? 'date' : 'text'}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="profile-input"
                      />
                    )
                  ) : (
                    <span>{value}</span>
                  )}
                </div>
              )
            ))}

            {!changePassword && !isEditing && (
              <div className="transaction-row">
                <label>Password:</label>
                <span>********</span>
              </div>
            )}

            {isEditing && !changePassword && (
              <button className="pay-button" onClick={() => setChangePassword(true)}>
                Change Password
              </button>
            )}

            {isEditing && changePassword && (
              <>
                <div className="transaction-row">
                  <label>Old Password:</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="profile-input"
                  />
                </div>
                <div className="transaction-row">
                  <label>New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="profile-input"
                  />
                </div>
                <div className="transaction-row">
                  <label>Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="profile-input"
                  />
                </div>
              </>
            )}

            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

            <div className="payment-history-actions">
              {isEditing ? (
                <button className="pay-button" onClick={handleSave}>Save</button>
              ) : (
                <button className="pay-button" onClick={handleEditToggle}>Edit</button>
              )}
              <button className="close-button" onClick={() => window.location.href='/guest-dashboard'}>
                Back
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default GuestProfile;