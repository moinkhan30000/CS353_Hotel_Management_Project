import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Contact.css';
const Contact = () => {
  return (
    <>
      <Header />
      <div className="register-container">
        <div className="register-box">
          <h2>Contact Us</h2>
          <div className="contact-info">
            <h3>Our Contact Information</h3>
            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
            <p><strong>Email:</strong> contact@example.com</p>
            <p><strong>Address:</strong> 123 Main Street, Cityville, USA</p>
            <p><strong>Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM</p>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
