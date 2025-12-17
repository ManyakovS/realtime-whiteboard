# Запустить все сервисы
docker-compose up

# Запустить в фоновом режиме
docker-compose up -d

# Пересобрать и запустить
docker-compose up --build

# Остановить все сервисы
docker-compose down

# Просмотр логов
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Перезапустить конкретный сервис
docker-compose restart backend

# Проверить статус
docker-compose ps

# Выполнить команду в контейнере
docker-compose exec backend sh
docker-compose exec frontend sh

# Остановить и удалить volumes
docker-compose down -v