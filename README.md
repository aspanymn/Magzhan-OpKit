# Magzhan-OpKit

Fullstack-приложение для управления задачами с JWT-аутентификацией и real-time обновлениями через WebSocket.

---

## Технологии

### Backend
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Passport.js](https://www.passportjs.org/)
- [Socket.IO](https://socket.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- TypeScript

### Frontend
- [React 19](https://react.dev/)
- [React Router v7](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Socket.IO Client](https://socket.io/)
- [Vite](https://vitejs.dev/)
- TypeScript

### Инфраструктура
- **Docker / Docker Compose** — контейнеризация PostgreSQL и Redis

---

## Структура проекта

```
Magzhan-OpKit/
├── backend/                    # NestJS API-сервер
│   ├── prisma/
│   │   ├── schema.prisma       # Схема базы данных (User, Task)
│   │   └── migrations/         # Миграции Prisma
│   ├── src/
│   │   ├── auth/               # Модуль аутентификации
│   │   │   ├── dto/            # DTO для login/register
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── tasks/              # Модуль задач
│   │   │   ├── dto/            # DTO для создания/обновления задач
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.gateway.ts  # WebSocket-gateway
│   │   │   └── tasks.module.ts
│   │   ├── common/
│   │   │   ├── decorators/     # Кастомные декораторы (@GetUser)
│   │   │   └── guards/         # JWT Guard
│   │   ├── app.module.ts
│   │   ├── prisma.service.ts
│   │   └── main.ts
│   ├── .env                    # Переменные окружения
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx       # Страница входа
│   │   │   ├── Register.tsx    # Страница регистрации
│   │   │   └── Tasks.tsx       # Страница задач
│   │   ├── services/
│   │   │   ├── api.ts          # Axios-клиент
│   │   │   └── socket.ts       # Socket.IO-клиент
│   │   ├── App.tsx             # Корневой компонент с маршрутами
│   │   └── main.tsx
│   └── package.json
│
├── docker-compose.yml          # PostgreSQL + Redis
└── README.md
```

---

## Локальный запуск

### Требования

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) и Docker Compose

### 1. Клонировать репозиторий

```bash
git clone <https://github.com/aspanymn/Magzhan-OpKit.git>
cd Magzhan-OpKit
```

### 2. Запустить базу данных

```bash
docker-compose up -d
```

Поднимет PostgreSQL на порту `5432` и Redis на порту `6379`.

### 3. Настроить backend

```bash
cd backend
```

Создать файл `.env` если нет:

```env
DATABASE_URL="postgresql://opkit_user:opkit_password@localhost:5432/opkit_db"
JWT_SECRET="opkit-test-secret-key"
JWT_EXPIRES_IN="24h"
PORT=3001
NODE_ENV="development"
```

Установить зависимости и применить миграции:

```bash
npm install
npx prisma migrate deploy
```

Запустить сервер в режиме разработки:

```bash
npm run start:dev
```

Backend будет доступен по адресу: `http://localhost:3001`

### 4. Запустить frontend

Открыть новый терминал:

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу: `http://localhost:5173`

---

## API

| Метод | Путь | Описание | Auth |
|---|---|---|---|
| POST | `/auth/register` | Регистрация нового пользователя | Нет |
| POST | `/auth/login` | Вход, возвращает JWT-токен | Нет |
| GET | `/tasks` | Получить все задачи текущего пользователя | JWT |
| POST | `/tasks` | Создать задачу | JWT |
| PATCH | `/tasks/:id` | Обновить задачу | JWT |
| DELETE | `/tasks/:id` | Удалить задачу | JWT |

WebSocket-события (namespace `/tasks`): `taskCreated`, `taskUpdated`, `taskDeleted`.
