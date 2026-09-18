import { Link } from 'react-router-dom';
import type { Game } from '../types';

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="card">
      <img src={game.image} alt={game.title} className="card-img" />
      <div className="card-body">
        <h3>{game.title}</h3>
        <p className="price">{game.price} ₽</p>
        <Link to={`/game/${game.id}`} className="btn">Подробнее</Link>
      </div>
    </div>
  );
}