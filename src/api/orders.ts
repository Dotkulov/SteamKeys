import { api } from './client';
import type { Order } from '../types';

export const buyGame = (gameId: number) =>
  api.post<Order>('/orders', { gameId }).then(r => r.data);

export const getMyOrders = () =>
  api.get<Order[]>('/orders/my').then(r => r.data);