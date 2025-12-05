# Real World Nuxt

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker

### Запуск с Docker Compose

1. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

2. Отредактируйте `.env` и установите свои значения (особенно `JWT_SECRET` и пароли БД)

3. Запустите контейнеры:
```bash
docker-compose up -d
```

4. Дождитесь готовности базы данных (обычно несколько секунд), затем примените миграции базы данных.

   **Важно:** Для применения миграций нужно использовать команды на хосте (не в контейнере), так как production образ не содержит исходных файлов.

   Убедитесь, что у вас установлены зависимости:
```bash
npm install
```

   Затем установите DATABASE_URL и примените миграции:
```bash
# Установите DATABASE_URL (замените пароль на ваш из .env)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realworld"
npm run db:migrate
```

   Или если используете `.env` файл, добавьте в него:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realworld
```
   Затем:
```bash
npm run db:migrate
```

   **Примечание:** Если получаете ошибку "User was denied access", убедитесь что:
   - База данных `realworld` создана (создается автоматически при первом запуске)
   - Пароль в DATABASE_URL совпадает с POSTGRES_PASSWORD из docker-compose.yml
   - Контейнер базы данных запущен и здоров: `docker-compose ps`

5. (Опционально) Заполните базу данных тестовыми данными:
```bash
npm run db:seed
```

6. Приложение будет доступно на `http://localhost:5900`

### Остановка контейнеров

```bash
docker-compose down
```

Для удаления всех данных (включая базу данных):
```bash
docker-compose down -v
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только приложение
docker-compose logs -f real-world-nuxt

# Только база данных
docker-compose logs -f postgres
```

### Подключение к базе данных

```bash
docker-compose exec postgres psql -U postgres -d realworld
```

---

## Resources

[database diagram](https://dbdiagram.io/d/Real-world-692dd29ad6676488ba1f2cb3)
