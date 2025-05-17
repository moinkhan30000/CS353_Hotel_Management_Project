import './PromoSection.css';
import promoImage from '../../assets/promo.jpg';

const PromoSection = () => {
  return (
    <section className="promo">
      <img src={promoImage} alt="Promo" />
      <div className="promo-content">
        <h3>Get special offers, and more from travelworld</h3>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default PromoSection;
