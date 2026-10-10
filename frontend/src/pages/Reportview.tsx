import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { currentUser } from '../services/api';
import './Reportview.css';

const ReportDetailsPage = () => {
  const navigate = useNavigate();
  const user = currentUser();
  const report = JSON.parse(localStorage.getItem('selectedReport') ?? 'null') as { id: number; title: string; content: Record<string, unknown>; generated_at: string } | null;

  return (
    <div className="page-container">
      <header className="reportviewheader">
        <div className="logo">HORIZONSTAY</div>
        <div className="profile-button">{user ? `${user.first_name} ${user.last_name}` : 'Administrator'} <span className="profile-icon">User</span></div>
      </header>
      <main className="reportmain">
        <h1 className="welcome-text">Welcome</h1>
        <div className="reports-box">
          <h2 className="reports-title">Report</h2>
          {report ? <>
            <p><strong>{report.title}</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(report.content, null, 2)}</pre>
            <p><strong>Report ID:</strong> {report.id}</p>
            <p><strong>Generated:</strong> {new Date(report.generated_at).toLocaleString()}</p>
          </> : <p>Select or generate a report first.</p>}
        </div>
        <div className="button-group"><button className="back-button" onClick={() => navigate('/admindashboard/reports')}>Back</button></div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetailsPage;
