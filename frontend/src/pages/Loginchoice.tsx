import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Loginchoice.css';

const LoginchoicePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header hideLogin />
      <div className="choice-container">
        <h2>Select Login Type</h2>
        <div className="choice-buttons">
          <button onClick={() => navigate('/login/guest')}>Login as Guest</button>
          <button onClick={() => navigate('/login/manager')}>Login as Manager</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginchoicePage;
