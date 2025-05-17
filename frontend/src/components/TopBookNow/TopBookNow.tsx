import './TopBookNow.css';
import HotelCard from '../HotelCard/HotelCard';
import oasisImage from '../../assets/oasis.jpg';
import sanctuaryImage from '../../assets/sanctuary.jpg';

const hotels = [
  {
    name: 'The Oasis',
    location: 'Rio de Janeiro, Brazil',
    price: 10000,
    image: oasisImage,
  },
  {
    name: 'The Sanctuary',
    location: 'Bali, Indonesia',
    price: 9000,
    image: sanctuaryImage,
  },
  // Add more items based on your mockup
];

const TopBookNow = () => {
  return (
    <section className="top-hotels">
      <h2>TOP BOOK NOW</h2>
      <div className="hotel-grid">
        {hotels.map((hotel, i) => (
          <HotelCard key={i} {...hotel} />
        ))}
      </div>
      <button className="see-all">See all →</button>
    </section>
  );
};

export default TopBookNow;
