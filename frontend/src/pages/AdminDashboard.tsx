import "./AdminDashboard.css";
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { api, currentUser, logout } from '../services/api';
const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = currentUser();
    const generateReport = async () => {
      try {
        const report = await api('/reports/', { method: 'POST', body: JSON.stringify({ title: 'Platform report' }) });
        localStorage.setItem('selectedReport', JSON.stringify(report));
        navigate('/admindashboard/reports/view');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Unable to generate report.');
      }
    };
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">HORIZONSTAY</div>
        <nav className="nav-links">
          <a href="/" onClick={logout}>Logout</a>
          <a href="#">Hotels</a>
        </nav>
        <div className="profile">
          <span className="profile-name">{user ? `${user.first_name} ${user.last_name}` : 'Administrator'}</span>
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
          <button className="dashboard-button" onClick={generateReport}>Generate Report</button>
          
          <button className="dashboard-button" onClick={() => navigate('/admindashboard/reports')}>Report List</button>
        </div>
        
      </main>
      <Footer />
    </div>
    
  );
};

export default AdminDashboard;
