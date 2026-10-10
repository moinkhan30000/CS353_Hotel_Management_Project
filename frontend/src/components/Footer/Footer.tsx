import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => <footer className="footer"><div className="footer-brand"><strong>HORIZONSTAY</strong><p>Comfortable stays, confidently booked.</p></div><div className="footer-links"><div><h4>Support</h4><Link to="/contact">Help Center</Link><Link to="/contact">Safety</Link></div><div><h4>Explore</h4><Link to="/properties">All properties</Link><Link to="/register">Create account</Link></div><div><h4>Company</h4><Link to="/">About us</Link><Link to="/contact">Partnerships</Link></div></div><p className="copyright">© HorizonStay {new Date().getFullYear()} · Travel made straightforward</p></footer>;

export default Footer;
