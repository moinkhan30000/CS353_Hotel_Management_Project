import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './RegisterChoicePage.css';

const RegisterChoicePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header hideLogin />
      <div className="choice-container">
        <h2>Select Registration Type</h2>
        <div className="choice-buttons">
          <button onClick={() => navigate('/register/guest')}>Register as Guest</button>
          <button onClick={() => navigate('/register/manager')}>Register as Manager</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterChoicePage;
