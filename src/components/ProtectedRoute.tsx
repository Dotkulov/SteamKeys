import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container">Загрузка…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}