import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './HotelRegisterPage.css';

interface RoomData {
  type: string;
  count: string;
  capacity: string;
  price: string;
  amenities: string[];
}

const HotelRegisterPage = () => {
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [room, setRoom] = useState<RoomData>({
    type: '',
    count: '',
    capacity: '',
    price: '',
    amenities: [],
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      console.log(`${images.length} images selected.`);
    }
  }, [images]);

  const handleAddAmenity = () => {
    const trimmed = newAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities([...amenities, trimmed]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
    setRooms(rooms.map((r) => ({
      ...r,
      amenities: r.amenities.filter((a) => a !== amenity),
    })));
    setRoom({
      ...room,
      amenities: room.amenities.filter((a) => a !== amenity),
    });
  };

  const handleAddRoom = () => {
    if (room.type && room.count && room.capacity && room.price) {
      if (editIndex !== null) {
        const updated = [...rooms];
        updated[editIndex] = room;
        setRooms(updated);
        setEditIndex(null);
      } else {
        setRooms([...rooms, room]);
      }
      setRoom({
        type: '',
        count: '',
        capacity: '',
        price: '',
        amenities: [],
      });
    }
  };

  const handleEditRoom = (index: number) => {
    setRoom(rooms[index]);
    setEditIndex(index);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
    if (editIndex === index) {
      setRoom({ type: '', count: '', capacity: '', price: '', amenities: [] });
      setEditIndex(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Hotel Registered Successfully!');
  };

  return (
    <>
      <Header hideLogin hideRegister />
      <div className="register-container">
        <div className="register-box wide">
          <h2>Hotel Registration</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input type="text" placeholder="Hotel Name" value={hotelName} onChange={(e) => setHotelName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[1-9][0-9]{9}"
            title="Enter a 10-digit phone number starting with 1-9"
            required
            />

            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />

            <label className="custom-file-upload">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
              Upload Images
            </label>
            {images.length > 0 && (
              <ul className="image-list">
                {images.map((file, idx) => (
                  <li key={idx} className="image-item">
                    {file.name}
                    <span className="remove-btn-icon" onClick={() => handleRemoveImage(idx)}>×</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="amenities-section">
              <div className="amenity-input-group">
                <input type="text" placeholder="Add Amenity" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} />
                <button type="button" className="add-btn" onClick={handleAddAmenity}>+ Add</button>
              </div>
              {amenities.length > 0 ? (
                <ul className="amenity-list">
                  {amenities.map((a, i) => (
                    <li key={i}>
                      {a}
                      <span className="remove-btn-icon" onClick={() => handleRemoveAmenity(a)}>×</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="amenity-placeholder">No amenities added yet.</p>
              )}
            </div>

            <div className="room-section" ref={formRef}>
              <input type="text" placeholder="Room Type" value={room.type} onChange={(e) => setRoom({ ...room, type: e.target.value })} />
              <input type="number" placeholder="Room Count" min="1" value={room.count} onChange={(e) => setRoom({ ...room, count: e.target.value })} />
              <input type="number" placeholder="Room Cap." min="1" value={room.capacity} onChange={(e) => setRoom({ ...room, capacity: e.target.value })} />
              <input type="number" placeholder="Room Price" min="0" value={room.price} onChange={(e) => setRoom({ ...room, price: e.target.value })} />

              <div className="room-amenities-select">
                {amenities.length > 0 ? amenities.map((a, i) => (
                  <label key={i} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={a}
                      checked={room.amenities.includes(a)}
                      onChange={(e) => {
                        const selected = e.target.checked
                          ? [...room.amenities, a]
                          : room.amenities.filter((item) => item !== a);
                        setRoom({ ...room, amenities: selected });
                      }}
                    />
                    {a}
                  </label>
                )) : (
                  <p className="amenity-placeholder">Add amenities to assign them to rooms.</p>
                )}
              </div>

              <button type="button" onClick={handleAddRoom}>{editIndex !== null ? 'Update Room' : '+ Add Room'}</button>
            </div>

            {rooms.length > 0 && (
              <div className="added-rooms">
                <h3>Added Rooms</h3>
                <ul>
                  {rooms.map((r, idx) => (
                    <li key={idx} className="room-summary">
                      <div>
                        <strong>Type:</strong> {r.type}, <strong>Count:</strong> {r.count},
                        <strong> Capacity:</strong> {r.capacity}, <strong>Price:</strong> ${r.price},
                        <strong> Amenities:</strong> {r.amenities.join(', ') || 'None'}
                      </div>
                      <div className="room-actions">
                        <button type="button" onClick={() => handleEditRoom(idx)}>Edit</button>
                        <button type="button" onClick={() => handleDeleteRoom(idx)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HotelRegisterPage;