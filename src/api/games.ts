import { api } from './client';
import type { Game } from '../types';

export const getGames = () =>
  api.get<Game[]>('/games').then(r => r.data);

export const getGame = (id: number | string) =>
  api.get<Game>(`/games/${id}`).then(r => r.data);

export const createGame = (data: Omit<Game, 'id'>) =>
  api.post<Game>('/games', data).then(r => r.data);

export const updateGame = (id: number, data: Partial<Game>) =>
  api.put<Game>(`/games/${id}`, data).then(r => r.data);

export const deleteGame = (id: number) =>
  api.delete(`/games/${id}`);