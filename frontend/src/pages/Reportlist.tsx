import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { api, currentUser } from '../services/api';
import './Reportlist.css';

interface Report { id: number; title: string; content: Record<string, unknown>; generated_at: string }

const ReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const user = currentUser();

  useEffect(() => { api<Report[]>('/reports/').then(setReports); }, []);

  const viewReport = (report: Report) => {
    localStorage.setItem('selectedReport', JSON.stringify(report));
    navigate('/admindashboard/reports/view');
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="logo">HORIZONSTAY</div>
        <div className="profile-button">{user ? `${user.first_name} ${user.last_name}` : 'Administrator'} <span className="profile-icon">User</span></div>
      </header>
      <main className="main">
        <h1 className="welcome-text">Welcome</h1>
        <div className="reports-box">
          <h2 className="reports-title">Reports List</h2>
          <div className="report-header">Report ID | Date | Title</div>
          {reports.map(report => (
            <div className="report-row" key={report.id}>
              <div className="report-details">{report.id} | {new Date(report.generated_at).toLocaleString()} | {report.title}</div>
              <div className="report-actions"><button className="download-button" onClick={() => viewReport(report)}>View</button></div>
            </div>
          ))}
          {!reports.length && <p>No reports generated yet.</p>}
          <button className="back-button" onClick={() => navigate('/admindashboard')}>Back</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportsPage;
