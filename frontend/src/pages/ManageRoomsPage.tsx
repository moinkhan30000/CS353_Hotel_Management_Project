import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import './ManagerDashboard.css';
import './ManageRoomsPage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api, currentUser } from '../services/api';

interface Room {
  id?: number;
  type: string;
  count: number;
  capacity: number;
  price: number;
  editing: boolean;
}

const ManageRoomsPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const user = currentUser();

  useEffect(() => {
    api<Array<{ id: number; room_type: string; quantity: number; capacity: number; price: string }>>('/rooms/')
      .then(items => setRooms(items.map(item => ({ id: item.id, type: item.room_type, count: item.quantity, capacity: item.capacity, price: Number(item.price), editing: false }))));
  }, []);

  const toggleEdit = async (index: number) => {
    const updated = [...rooms];
    if (updated[index].editing && validateRoom(updated[index])) {
      const room = updated[index];
      const saved = await api<{ id: number }>(room.id ? `/rooms/${room.id}/` : '/rooms/', { method: room.id ? 'PATCH' : 'POST', body: JSON.stringify({ name: room.type, room_type: room.type, quantity: room.count, capacity: room.capacity, price: room.price }) });
      room.id = saved.id;
      toast.success('Room saved.');
    }
    updated[index].editing = !updated[index].editing;
    setRooms(updated);
  };

  const updateRoom = (
    index: number,
    field: keyof Room,
    value: string
  ) => {
    const updated = [...rooms];

    if (field === 'type') {
      updated[index].type = value.trim();
    } else {
      const parsed = Math.max(Number(value), 1);
      if (field === 'count' || field === 'capacity' || field === 'price') {
        updated[index][field] = parsed;
      }
    }

    setRooms(updated);
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      { type: '', count: 1, capacity: 1, price: 1, editing: true }
    ]);
  };

  const removeRoom = async (index: number) => {
    if (rooms[index].id) await api(`/rooms/${rooms[index].id}/`, { method: 'DELETE' });
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const validateRoom = (room: Room) => {
    return (
      room.type.trim().length > 0 &&
      room.count > 0 &&
      room.capacity > 0 &&
      room.price > 0
    );
  };

  const handleConfirm = () => {
    if (rooms.some(r => r.editing)) {
      toast.error('Please save all edits before confirming!', { position: 'top-center' });
      return;
    }

    const invalidRooms = rooms.filter(room => !validateRoom(room));
    if (invalidRooms.length > 0) {
      toast.error('All fields must be filled with valid values!', { position: 'top-center' });
      return;
    }

    toast.success('Rooms configuration saved!', { position: 'top-center' });
    setTimeout(() => navigate('/managerhoteldashboard'), 1500);
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
              <span className="user-name">{user ? `${user.first_name} ${user.last_name}` : 'Manager'}</span>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <a href="/">Logout</a>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main className="dashboard-main">
          <h2 className="welcome-title">Manage Rooms</h2>

          <div className="room-header">
            <span>Room Type</span>
            <span>Room Count</span>
            <span>Room Cap.</span>
            <span>Room Price</span>
            <span>Actions</span>
          </div>

          <div className="room-list">
            {rooms.map((room, index) => (
              <div className="room-row" key={index}>
                {room.editing ? (
                  <>
                    <input
                      type="text"
                      value={room.type}
                      onChange={(e) => updateRoom(index, 'type', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={room.count}
                      onChange={(e) => updateRoom(index, 'count', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={room.capacity}
                      onChange={(e) => updateRoom(index, 'capacity', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={room.price}
                      onChange={(e) => updateRoom(index, 'price', e.target.value)}
                      required
                    />
                  </>
                ) : (
                  <>
                    <div>{room.type}</div>
                    <div>{room.count}</div>
                    <div>{room.capacity}</div>
                    <div>{room.price}</div>
                  </>
                )}
                <div className="room-actions">
                  <button onClick={() => toggleEdit(index)}>{room.editing ? 'Save' : 'Edit'}</button>
                  <button className="remove-btn" onClick={() => removeRoom(index)}>×</button>
                </div>
              </div>
            ))}
          </div>

          <button className="add-room" onClick={addRoom}>Add Room Type +</button>
          <div className="upload-wrapper">
            <button className="upload-button" onClick={handleConfirm}>Confirm</button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ManageRoomsPage;
