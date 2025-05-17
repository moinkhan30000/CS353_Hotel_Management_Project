import './HotelCard.css';

type Props = {
  image: string;
  name: string;
  location: string;
  price: number;
};

const HotelCard = ({ image, name, location, price }: Props) => (
  <div className="hotel-card">
    <img src={image} alt={name} />
    <h4>{name}</h4>
    <p>{location}</p>
    <p>${price.toLocaleString()}</p>
  </div>
);

export default HotelCard;
