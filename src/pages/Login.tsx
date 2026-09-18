import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ошибка входа');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container form-page">
      <h1>Вход</h1>
      <form onSubmit={onSubmit} className="form">
        <input type="email" required placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" required placeholder="Пароль"
          value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button disabled={busy}>{busy ? '...' : 'Войти'}</button>
      </form>
      <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </div>
  );
}