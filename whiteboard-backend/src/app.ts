import express from 'express'
import { createServer } from 'http'

const app = express()
const httpServer = createServer(app)

// Define a route for the home page
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to my Express application.');
});

app.get('/users', (req, res) => {
  // Handle GET request for /users
  res.json([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
});

// Запуск сервера
const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})