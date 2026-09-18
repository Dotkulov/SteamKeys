import { api } from './client';
import type { AuthResponse, User } from '../types';

export const loginRequest = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data);

export const registerRequest = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { email, password }).then(r => r.data);

export const meRequest = () =>
  api.get<User>('/auth/me').then(r => r.data);