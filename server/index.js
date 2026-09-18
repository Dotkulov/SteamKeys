import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const users = [];
const orders = [];

const games = [
  { id: 1, title: 'Resident Evil 4 Remake', price: 3499, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg', description: 'Ремейк культового хоррора про Леона Кеннеди.', genre: 'Survival Horror' },
  { id: 2, title: 'Resident Evil Village', price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg', description: 'Итан Уинтерс и леди Димитреску.', genre: 'Survival Horror' },
  { id: 3, title: 'Resident Evil 2 Remake', price: 2499, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/883710/header.jpg', description: 'Раккун-Сити, зомби и мистер X.', genre: 'Survival Horror' },
  { id: 4, title: 'Silent Hill 2 Remake', price: 3999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/header.jpg', description: 'Психологический хоррор про Джеймса Сандерленда.', genre: 'Psychological Horror' },
  { id: 5, title: "Marvel's Spider-Man Remastered", price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg', description: 'Питер Паркер в Нью-Йорке.', genre: 'Action-Adventure' },
  { id: 6, title: "Marvel's Spider-Man: Miles Morales", price: 2799, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/header.jpg', description: 'Майлз Моралес в зимнем Нью-Йорке.', genre: 'Action-Adventure' },
  { id: 7, title: 'The Last of Us Part I', price: 3999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg', description: 'Джоэл и Элли в постапокалипсисе.', genre: 'Action-Adventure' },
  { id: 8, title: 'God of War', price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg', description: 'Кратос и Атрей в скандинавских мифах.', genre: 'Action-Adventure' },
  { id: 9, title: 'God of War Ragnarök', price: 4999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg', description: 'Финал скандинавской саги.', genre: 'Action-Adventure' },
  { id: 10, title: 'Red Dead Redemption 2', price: 3499, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg', description: 'Дикий Запад и банда Ван дер Линде.', genre: 'Action-Adventure' },
  { id: 11, title: 'Cyberpunk 2077', price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg', description: 'Найт-Сити и наёмник V.', genre: 'RPG' },
  { id: 12, title: 'Elden Ring', price: 3999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', description: 'Соулслайк от FromSoftware.', genre: 'Action RPG' },
  { id: 13, title: 'Dark Souls III', price: 2499, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg', description: 'Финал трилогии Dark Souls.', genre: 'Action RPG' },
  { id: 14, title: 'Sekiro: Shadows Die Twice', price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg', description: 'Самурайский соулслайк.', genre: 'Action-Adventure' },
  { id: 15, title: 'The Witcher 3: Wild Hunt', price: 1999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg', description: 'Геральт из Ривии в поисках Цири.', genre: 'RPG' },
  { id: 16, title: 'Hogwarts Legacy', price: 3499, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg', description: 'Магия Хогвартса XIX века.', genre: 'RPG' },
  { id: 17, title: 'Starfield', price: 3999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg', description: 'Космическая RPG от Bethesda.', genre: 'RPG' },
  { id: 18, title: "Baldur's Gate 3", price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg', description: 'Пошаговая RPG по D&D.', genre: 'RPG' },
  { id: 19, title: 'Counter-Strike 2', price: 0, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg', description: 'Тактический шутер 5x5.', genre: 'FPS' },
  { id: 20, title: 'Dota 2', price: 0, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', description: 'MOBA с миллионными призовыми.', genre: 'MOBA' },
  { id: 21, title: 'Grand Theft Auto V', price: 1999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg', description: 'Лос-Сантос и GTA Online.', genre: 'Action-Adventure' },
  { id: 22, title: 'Hollow Knight', price: 599, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg', description: 'Метроидвания про рыцаря.', genre: 'Metroidvania' },
  { id: 23, title: 'Dead Space Remake', price: 2999, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1693980/header.jpg', description: 'Космический хоррор про некроморфов.', genre: 'Survival Horror' },
  { id: 24, title: 'Alan Wake 2', price: 3499, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg', description: 'Психологический хоррор от Remedy.', genre: 'Psychological Horror' },
  { id: 25, title: 'Outlast', price: 599, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/238320/header.jpg', description: 'Хоррор в заброшенной лечебнице.', genre: 'Survival Horror' },
  { id: 26, title: 'Amnesia: The Dark Descent', price: 399, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/57300/header.jpg', description: 'Классика инди-хоррора.', genre: 'Survival Horror' },
  { id: 27, title: 'Phasmophobia', price: 899, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg', description: 'Кооперативный хоррор про призраков.', genre: 'Co-op Horror' },
  { id: 28, title: 'Lethal Company', price: 399, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg', description: 'Кооп-хоррор про сбор мусора на лунах.', genre: 'Co-op Horror' },
];

let nextUserId = 1;
let nextGameId = 100;
let nextOrderId = 1;

function auth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Нет токена' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Неверный токен' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Только админ' });
  next();
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: 'Нужны email и пароль' });
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email занят' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, email, passwordHash, role: users.length === 0 ? 'admin' : 'user' };
  users.push(user);
  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Неверный логин или пароль' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Неверный логин или пароль' });
  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email, role: user.role } });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
});

app.get('/api/games', (req, res) => res.json(games));

app.get('/api/games/:id', (req, res) => {
  const g = games.find(x => x.id === +req.params.id);
  if (!g) return res.status(404).json({ message: 'Не найдено' });
  res.json(g);
});

app.post('/api/games', auth, adminOnly, (req, res) => {
  const { title, price, image, description, genre } = req.body;
  const game = { id: nextGameId++, title, price: +price, image, description, genre };
  games.push(game);
  res.status(201).json(game);
});

app.put('/api/games/:id', auth, adminOnly, (req, res) => {
  const g = games.find(x => x.id === +req.params.id);
  if (!g) return res.status(404).json({ message: 'Не найдено' });
  Object.assign(g, req.body);
  res.json(g);
});

app.delete('/api/games/:id', auth, adminOnly, (req, res) => {
  const i = games.findIndex(x => x.id === +req.params.id);
  if (i === -1) return res.status(404).json({ message: 'Не найдено' });
  games.splice(i, 1);
  res.status(204).end();
});

app.post('/api/orders', auth, (req, res) => {
  const { gameId } = req.body;
  const game = games.find(g => g.id === +gameId);
  if (!game) return res.status(404).json({ message: 'Игра не найдена' });
  const order = {
    id: nextOrderId++,
    gameId: game.id,
    gameTitle: game.title,
    price: game.price,
    key: 'STEAM-' + Math.random().toString(36).slice(2, 10).toUpperCase() + '-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
    userId: req.user.id,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders/my', auth, (req, res) => {
  res.json(orders.filter(o => o.userId === req.user.id));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API ready: http://localhost:${PORT}/api`);
});