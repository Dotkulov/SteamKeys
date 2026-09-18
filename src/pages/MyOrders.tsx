import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orders';
import type { Order } from '../types';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const copyKey = async (order: Order) => {
    try {
      await navigator.clipboard.writeText(order.key);
      setCopiedId(order.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Резервный вариант для http://localhost без https
      const ta = document.createElement('textarea');
      ta.value = order.key;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(order.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  if (loading) return <div className="container">Загрузка…</div>;

  return (
    <div className="container">
      <h1>Мои покупки</h1>
      {orders.length === 0 ? (
        <p>Вы ещё ничего не купили</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Игра</th>
              <th>Цена</th>
              <th>Ключ</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.gameTitle}</td>
                <td>{o.price} ₽</td>
                <td>
                  <span className="key">{o.key}</span>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                <td style={{ width: 1 }}>
                  <button
                    className="btn small"
                    onClick={() => copyKey(o)}
                  >
                    {copiedId === o.id ? 'Скопировано' : 'Копировать'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}