import Header from '../components/Header/Header';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader';
import HeroSection from '../components/HeroSection/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import TopBookNow from '../components/TopBookNow/TopBookNow';
import PromoSection from '../components/PromoSection/PromoSection';
import Footer from '../components/Footer/Footer';
import { currentUser, logout } from '../services/api';

const HomePage = () => {
  const user = currentUser();
  const username = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : '';

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <>
      {user ? (
        <PrivateHeader username={username} onLogout={handleLogout} />
      ) : (
        <Header />
      )}

      <HeroSection />
      <WhyChooseUs />
      <TopBookNow />
      <PromoSection />
      <Footer />
    </>
  );
};

export default HomePage;
