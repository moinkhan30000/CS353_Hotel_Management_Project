import { useRef, useState } from 'react';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './EditHotelImagesPage.css';

const EditHotelImagesPage = () => {
  const [images, setImages] = useState<string[]>([
    '/src/assets/oasis.jpg',
    '/src/assets/oasis.jpg',
    '/src/assets/oasis.jpg',
    '/src/assets/oasis.jpg',
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploaded = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...uploaded]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="brand">HORIZONSTAY</h1>
          </div>
          <nav className="dashboard-nav">
            <a href="/managerhoteldashboard" className="nav-link">Dashboard</a>
            <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="user-name">Moin Khan ▼</span>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <a href="/">Logout</a>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main className="dashboard-main">
          <h2 className="welcome-title">Edit Hotel Images</h2>

          <div className="image-gallery">
            {images.map((img, index) => (
              <div key={index} className="image-card">
                <img src={img} alt={`hotel-${index}`} />
                <button className="remove-btn" onClick={() => removeImage(index)}>
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="upload-wrapper">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
              accept="image/*"
            />
            <button
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EditHotelImagesPage;
