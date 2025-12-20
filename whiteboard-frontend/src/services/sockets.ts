import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const socket = io(URL, {
  transports: ['websocket'], 
  upgrade: false, 
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('Мы в сети! ID:', socket.id);
  socket.emit('join-room', { roomId: 1 });
});