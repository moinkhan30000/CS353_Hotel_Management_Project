import './HotelCard.css';
import { Link } from 'react-router-dom';

type Props = {
  image: string;
  name: string;
  location: string;
  price: number;
  id: number;
};

const HotelCard = ({ image, name, location, price, id }: Props) => (
  <Link to={`/properties/${id}`} className="hotel-card">
    <img src={image} alt={name} />
    <h4>{name}</h4>
    <p>{location}</p>
    <p>${price.toLocaleString()}</p>
  </Link>
);

export default HotelCard;
