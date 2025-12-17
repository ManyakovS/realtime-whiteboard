# Сборка образа
docker build -t whiteboard-backend .

# Сборка образа dev
docker build -t backend-dev -f Dockerfile.dev .

# Запуск контейнера
docker run -p 3000:3000 whiteboard-backend

# Запуск контейнера dev
docker run -p 3000:3000 -v ${PWD}:/app backend-dev