# SteamKeys — магазин ключей игр Steam

Fullstack-приложение: каталог игр, JWT-аутентификация, покупка ключей, админ-панель.
Frontend — React + TypeScript + Vite. Backend — Node.js + Express.

---

## Возможности

- Каталог игр с постерами и поиском по названию
- Страница игры: описание, жанр, цена, кнопка «Купить ключ»
- Регистрация и вход по email/паролю (JWT)
- Защищённые маршруты: «Мои покупки» и «Админ-панель»
- Админ-панель: добавление и удаление игр (роль `admin`)
- Покупка ключей: генерация уникального Steam-ключа и его копирование
- Тёмная тема, единый стиль отображения ключей

---

## Стек

**Frontend:** React 18, TypeScript 5, Vite 5, React Router 6, Axios
**Backend:** Express 4, jsonwebtoken, bcryptjs, cors

---

## Структура

```
steam-keys-shop/
├── dev.bat              запуск одной кнопкой (backend + frontend)
├── install.bat          установка всех зависимостей
├── stop.bat             остановка процессов на портах 8080 и 5173
├── vite.config.ts       прокси /api → http://localhost:8080
├── .env                 VITE_API_URL
│
├── src/                 фронтенд
│   ├── api/             client, auth, games, orders
│   ├── context/         AuthContext
│   ├── components/      Navbar, GameCard, ProtectedRoute
│   └── pages/           Catalog, GameDetails, Login, Register, MyOrders, AdminPanel
│
└── server/              бэкенд
    ├── index.js         Express-сервер и все роуты
    └── package.json
```

---

## Запуск одной кнопкой

1. Двойной клик по `dev.bat`.
2. Скрипт:
   - проверит Node.js;
   - установит зависимости фронта и бэка (зеркало `registry.npmmirror.com`);
   - освободит порты 8080 и 5173;
   - запустит backend и frontend в отдельных окнах;
   - откроет браузер на `http://localhost:5173`.
3. Остановка — закрыть окна `SteamKeys Backend` и `SteamKeys Frontend`.

Watchdog в `dev.bat` перезапускает упавший сервер через 3 секунды. Логи — в `backend.log` и `frontend.log`.

### Ярлык на рабочий стол
Правый клик по `dev.bat` → Отправить → Рабочий стол (создать ярлык).
В свойствах ярлыка укажите рабочую папку: `...\steam-keys-shop`.

---

## Ручной запуск

Требуется Node.js 18+.

**Терминал 1 — backend:**
```powershell
cd server
npm install --registry=https://registry.npmmirror.com
node index.js
```
Ожидаемый вывод: `API ready: http://localhost:8080/api`
Окно не закрывать.

**Терминал 2 — frontend:**
```powershell
npm install --registry=https://registry.npmmirror.com
npm run dev
```
Открыть `http://localhost:5173/`.

---

## API

Базовый URL: `http://localhost:8080/api`
Защищённые эндпоинты требуют заголовок `Authorization: Bearer <token>`.

### Аутентификация
| Метод | Endpoint | Тело | Ответ |
|-------|----------|------|-------|
| POST | `/auth/register` | `{email, password}` | `{token, user}` |
| POST | `/auth/login` | `{email, password}` | `{token, user}` |
| GET | `/auth/me` | — | `{id, email, role}` — защищён |

Первый зарегистрированный пользователь получает роль `admin`. Остальные — `user`.

### Игры
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/games` | список игр |
| GET | `/games/:id` | одна игра |
| POST | `/games` | создать — защищён, admin |
| PUT | `/games/:id` | изменить — защищён, admin |
| DELETE | `/games/:id` | удалить — защищён, admin |

### Заказы
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/orders` | купить ключ — защищён |
| GET | `/orders/my` | мои покупки — защищён |

### Типы
```ts
interface User  { id: number; email: string; role: 'admin' | 'user'; }
interface Game  { id: number; title: string; price: number; image: string; description: string; genre?: string; }
interface Order { id: number; gameId: number; gameTitle: string; price: number; key: string; createdAt: string; }
```

---

## Тестовые сценарии

1. Проверка backend: открыть `http://localhost:8080/api/games` — должен вернуться JSON со списком игр.
2. Регистрация: `http://localhost:5173/register`, email `admin@test.ru`, пароль `123456` — автоматически выдаётся роль `admin`.
3. Покупка: открыть любую игру → «Купить ключ» → появляется блок с ключом `STEAM-XXXXXXXX-YYYYYYYY` и кнопкой «Копировать».
4. Мои покупки: ключ отображается в едином стиле, доступна кнопка копирования.
5. Админка: под `admin@test.ru` открыть «Админ» → добавить/удалить игру.
6. Защита маршрутов: без входа `/orders` и `/admin` перенаправляют на `/login`; под обычным пользователем `/admin` недоступен.

---

## Частые проблемы

**`[vite] http proxy error: ECONNREFUSED`**
Backend не запущен. Проверить:
```powershell
netstat -ano | findstr :8080
```
Пусто → запустить `node index.js` в папке `server/`.

**`Cannot GET /api/games`**
Запущен json-server вместо Express. json-server отдаёт данные по `/games` без префикса `/api`. Остановить json-server и запустить `node index.js`.

**«Не удалось загрузить игры» на сайте**
1. Backend отвечает на `http://localhost:8080/api/games`?
2. В `vite.config.ts` нет `rewrite` (он ломает Express)?
3. Vite перезапущен после правки конфига?

**`EADDRINUSE :::8080`**
Порт занят. Освободить:
```powershell
netstat -ano | findstr :8080
taskkill /F /PID <PID>
```

**`Cannot use import statement outside a module`**
В `server/package.json` добавить `"type": "module"`.

**`npm install` падает с `ECONNRESET`**
Использовать зеркало:
```powershell
npm install --registry=https://registry.npmmirror.com
```

**Постеры не отображаются**
CDN `steamstatic.com` может блокироваться. Заменить URL в `server/index.js` на заглушку:
```js
image: 'https://placehold.co/460x215/1b2532/7ee787?text=Game'
```

---

## Скрипты

**Frontend:**
- `npm run dev` — dev-сервер на `localhost:5173`
- `npm run build` — production-сборка в `dist/`
- `npm run preview` — просмотр сборки

**Backend (`server/`):**
- `npm run dev` — запуск Express
- `npm start` — то же (production)

**Batch-файлы:**
- `dev.bat` — запуск всего с автоперезапуском
- `install.bat` — установка зависимостей
- `stop.bat` — остановка процессов

---

## Лицензия

Учебный проект. Названия игр и постеры принадлежат правообладателям (Valve, Capcom, Sony, Konami и др.) и используются в демонстрационных целях.
