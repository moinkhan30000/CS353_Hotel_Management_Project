import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer/Footer';
import { api, currentUser, logout } from '../services/api';
import './ManagerDashboard.css';
import './EditHotelImagesPage.css';

interface HotelImage { id: number; url: string }
interface Hotel { id: number; images: HotelImage[] }

const EditHotelImagesPage = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = currentUser();

  useEffect(() => { api<Hotel>('/hotels/mine/').then(setHotel); }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!hotel || !event.target.files) return;
    const uploaded = await Promise.all(Array.from(event.target.files).map(file => {
      const data = new FormData();
      data.append('image', file);
      return api<HotelImage>(`/hotels/${hotel.id}/images/`, { method: 'POST', body: data });
    }));
    setHotel({ ...hotel, images: [...hotel.images, ...uploaded] });
  };

  const removeImage = async (image: HotelImage) => {
    await api(`/hotel-images/${image.id}/`, { method: 'DELETE' });
    if (hotel) setHotel({ ...hotel, images: hotel.images.filter(item => item.id !== image.id) });
  };

  return <div className="page-wrapper"><div className="dashboard-container">
    <header className="dashboard-header"><div className="header-left"><h1 className="brand">HORIZONSTAY</h1></div>
      <nav className="dashboard-nav"><a href="/managerhoteldashboard" className="nav-link">Dashboard</a>
        <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}><span className="user-name">{user ? `${user.first_name} ${user.last_name}` : 'Manager'}</span>
          {dropdownOpen && <div className="dropdown-content"><a href="/" onClick={logout}>Logout</a></div>}
        </div></nav>
    </header>
    <main className="dashboard-main"><h2 className="welcome-title">Edit Hotel Images</h2>
      <div className="image-gallery">{hotel?.images.map((image, index) => <div key={image.id} className="image-card"><img src={image.url} alt={`hotel-${index}`} /><button className="remove-btn" onClick={() => removeImage(image)}>&times;</button></div>)}</div>
      <div className="upload-wrapper"><input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" /><button className="upload-button" onClick={() => fileInputRef.current?.click()}>Upload</button></div>
    </main><Footer />
  </div></div>;
};

export default EditHotelImagesPage;
