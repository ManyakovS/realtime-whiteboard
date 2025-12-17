# Сборка образа
docker build -t whiteboard-backend .

# Запуск контейнера
docker run -p 3000:3000 whiteboard-backend

# Сборка и запуск одной командой
docker build -t whiteboard-backend . && docker run -p 3000:3000 whiteboard-backend

# С переменными окружения
docker run -p 3000:3000 -e PORT=3000 -e NODE_ENV=production whiteboard-backend

# Для разработки (если используете Dockerfile для разработки)
docker run -p 3000:3000 -v $(pwd):/app whiteboard-backend