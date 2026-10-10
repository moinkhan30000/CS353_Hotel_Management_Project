import type { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import { currentUser, logout, type Role } from '../../services/api';
import './ProtectedRoute.css';

interface Props {
  children: ReactNode;
  role: Role;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const user = currentUser();
  const navigate = useNavigate();

  if (!user || !localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  const username = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="protected-page">
      <PrivateHeader username={username} onLogout={handleLogout} />
      <div className="protected-content">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
