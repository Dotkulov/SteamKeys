import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ошибка регистрации');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container form-page">
      <h1>Регистрация</h1>
      <form onSubmit={onSubmit} className="form">
        <input type="email" required placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" required minLength={6} placeholder="Пароль (мин. 6)"
          value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button disabled={busy}>{busy ? '...' : 'Создать аккаунт'}</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}