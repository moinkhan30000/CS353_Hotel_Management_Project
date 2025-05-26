import { useState } from 'react';
import Header from '../components/Header/Header';
import PrivateHeader from '../components/PrivateHeader/PrivateHeader'; // Your private header
import HeroSection from '../components/HeroSection/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import TopBookNow from '../components/TopBookNow/TopBookNow';
import PromoSection from '../components/PromoSection/PromoSection';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = "Moin Khan"; 

  const handleLogout = () => {
    setIsLoggedIn(false);

  };

  return (
    <>
      {isLoggedIn ? (
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
