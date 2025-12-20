// server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

io.on('connection', (socket) => {
  console.log(`Пользователь подключен: ${socket.id}`);
  // Присоединение к конкретной доске (комнате)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Обработка рисования (координаты)
  socket.on('draw-data', (data) => {
    // Отправляем всем в комнате, кроме отправителя
    socket.to(data.roomId).emit('draw-data', data);
  });

  // Обработка изменений в слоях или истории
  socket.on('history-update', (data) => {
    socket.to(data.roomId).emit('history-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
});

// Простой HTTP маршрут для проверки
app.get('/', (req, res) => {
  res.json({ message: 'Whiteboard server is running' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed for: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`);
});