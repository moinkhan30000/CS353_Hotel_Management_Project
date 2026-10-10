import { useState } from 'react';
import promoImage from '../../assets/promo.jpg';
import { api } from '../../services/api';
import './PromoSection.css';

const PromoSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const result = await api<{ detail: string }>('/newsletter/subscribe/', { method: 'POST', body: JSON.stringify({ email }) });
      setMessage(result.detail);
      setEmail('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to subscribe right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="promo"><div className="promo-image-wrap"><img src={promoImage} alt="A welcoming HorizonStay destination" /></div><div className="promo-content"><span className="eyebrow">Travel inspiration</span><h3>Offers worth packing for</h3><p>Get thoughtful destination ideas and selected hotel offers in your inbox.</p><form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} /><button type="submit" disabled={submitting}>{submitting ? 'Subscribing...' : 'Subscribe'}</button></form>{message && <p className="form-message" role="status">{message}</p>}</div></section>;
};

export default PromoSection;
