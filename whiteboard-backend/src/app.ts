import express from 'express'
import { createServer } from 'http'

const app = express()
const httpServer = createServer(app)

app.get('/', (req, res) => {
  res.send('');
});

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
})