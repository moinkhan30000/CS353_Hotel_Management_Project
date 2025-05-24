import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameRegex = /^[\p{L}]+$/u;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // adjust
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !message) {
      setError('Please fill in all fields.');
      return;
    }

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError('Names can only contain letters.');
      return;
    }

    if (!/^[1-9]\d{9}$/.test(phone)) {
      setError('Phone number must be 10 digits and not start with 0.');
      return;
    }

    // ✅ Valid
    setError('');
    toast.success('Message sent successfully!');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <>
      <Header hideRegister />
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

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
