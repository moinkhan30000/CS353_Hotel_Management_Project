import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { currentUser, type Role } from '../../services/api';

interface Props {
  children: ReactNode;
  role: Role;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const user = currentUser();
  if (!user || !localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
