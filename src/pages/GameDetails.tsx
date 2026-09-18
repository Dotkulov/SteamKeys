import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGame } from '../api/games';
import { buyGame } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import type { Game } from '../types';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [boughtKey, setBoughtKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getGame(id)
      .then(setGame)
      .catch(() => setError('Игра не найдена'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) return navigate('/login');
    if (!game) return;
    setError('');
    setMessage('');
    setBoughtKey(null);
    try {
      const order = await buyGame(game.id);
      setBoughtKey(order.key);
      setMessage('Покупка успешна!');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Не удалось купить');
    }
  };

  const copyKey = async () => {
    if (!boughtKey) return;
    try {
      await navigator.clipboard.writeText(boughtKey);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = boughtKey;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <div className="container">Загрузка…</div>;
  if (error && !game) return <div className="container error">{error}</div>;
  if (!game) return null;

  return (
    <div className="container game-details">
      <img src={game.image} alt={game.title} />
      <div>
        <h1>{game.title}</h1>
        {game.genre && <p className="genre">{game.genre}</p>}
        <p>{game.description}</p>
        <p className="price big">{game.price} ₽</p>

        <button className="btn primary" onClick={handleBuy}>
          Купить ключ
        </button>

        {message && !boughtKey && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {boughtKey && (
          <div className="key-box">
            <span className="key-label">Ваш ключ активации</span>
            <div className="key-row">
              <span className="key">{boughtKey}</span>
              <button className="btn small" onClick={copyKey}>
                {copied ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
            <span className="genre">Ключ также доступен в разделе «Мои покупки»</span>
          </div>
        )}
      </div>
    </div>
  );
}