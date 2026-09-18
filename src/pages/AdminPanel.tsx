import { FormEvent, useEffect, useState } from 'react';
import { createGame, deleteGame, getGames } from '../api/games';
import type { Game } from '../types';

const empty = { title: '', price: 0, image: '', description: '', genre: '' };

export default function AdminPanel() {
  const [games, setGames] = useState<Game[]>([]);
  const [form, setForm] = useState<Omit<Game, 'id'>>(empty);
  const [error, setError] = useState('');

  const reload = () => getGames().then(setGames);
  useEffect(() => { reload(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createGame(form);
      setForm(empty);
      reload();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ошибка');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Удалить игру?')) return;
    await deleteGame(id);
    reload();
  };

  return (
    <div className="container">
      <h1>Админ-панель</h1>

      <h2>Добавить игру</h2>
      <form onSubmit={onSubmit} className="form">
        <input required placeholder="Название"
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input required type="number" min={0} placeholder="Цена"
          value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
        <input placeholder="URL картинки"
          value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <input placeholder="Жанр"
          value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
        <textarea placeholder="Описание"
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button>Добавить</button>
      </form>

      <h2>Список игр</h2>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Название</th><th>Цена</th><th></th></tr>
        </thead>
        <tbody>
          {games.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.title}</td>
              <td>{g.price} ₽</td>
              <td><button onClick={() => onDelete(g.id)}>Удалить</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}