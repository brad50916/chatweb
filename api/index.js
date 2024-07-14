const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5001
const routes = require('./routers')
const cors = require('cors')
const pool = require('./db');
const Server = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your client's domain
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', async (message) => {
    const { userId, currentChatId, text } = message;
    try {
      const query = 'INSERT INTO messages (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *';
      const results = await pool.query(query, [currentChatId, userId, text]);
      io.emit('receiveMessage', results.rows[0]);
    }
    catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use('/', routes)

server.listen(port, () => {
  console.log(`App running on port ${port}.`)
})