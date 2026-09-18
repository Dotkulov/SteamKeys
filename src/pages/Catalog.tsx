import { useEffect, useState } from 'react';
import { getGames } from '../api/games';
import type { Game } from '../types';
import GameCard from '../components/GameCard';

export default function Catalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getGames()
      .then(setGames)
      .catch(() => setError('Не удалось загрузить игры'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="container">Загрузка…</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1>Каталог игр</h1>
      <input
        className="search"
        placeholder="Поиск игры…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid">
        {filtered.map(g => <GameCard key={g.id} game={g} />)}
      </div>
      {filtered.length === 0 && <p>Ничего не найдено</p>}
    </div>
  );
}