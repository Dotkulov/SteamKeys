export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

export interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  genre?: string;
}

export interface Order {
  id: number;
  gameId: number;
  gameTitle: string;
  price: number;
  key: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}