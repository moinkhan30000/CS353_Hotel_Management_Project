import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div>
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Safety</p>
        </div>
        <div>
          <h4>Company</h4>
          <p>About us</p>
          <p>Blog</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>FAQ</p>
          <p>Partnerships</p>
        </div>
      </div>
      <p className="copyright">
        © Horizonstay 2025 &nbsp; | &nbsp; Powered by Vite + React + TS
      </p>
    </footer>
  );
};

export default Footer;
