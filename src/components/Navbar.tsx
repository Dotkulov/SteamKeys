import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">SteamKeys</Link>
      <div className="nav-links">
        <NavLink to="/">Каталог</NavLink>
        {user && <NavLink to="/orders">Мои покупки</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin">Админ</NavLink>}
      </div>
      <div className="nav-auth">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Войти</NavLink>
            <NavLink to="/register">Регистрация</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}