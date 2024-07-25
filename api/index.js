const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;
const routes = require('./routers');
const cors = require('cors');
const pool = require('./db');
const Server = require("socket.io");
const http = require('http');
const server = http.createServer(app);

const io = Server(server, {
  cors: {
    origin: 'https://brad50916.github.io/chatweb/', // Replace with your client's domain
    methods: ['GET', 'POST'],
  },
});

const users = {}; 

io.on('connection', (socket) => {

  socket.on('register', (userId) => {
    users[userId] = socket.id;
  });

  socket.on('sendMessage', async (message) => {
    const { userId, toUserId, currentChatId, text } = message;
    const toSocketId = users[toUserId];
    const fromSocketId = users[userId];
    if (toSocketId) {
      try {
        const query = 'INSERT INTO messages (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *';
        const results = await pool.query(query, [currentChatId, userId, text]);
        if (toSocketId === fromSocketId) {
          io.to(toSocketId).emit('receiveMessage', results.rows[0]);
          return;
        }
        io.to(toSocketId).emit('receiveMessage', results.rows[0]);
        io.to(fromSocketId).emit('receiveMessage', results.rows[0]);
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.log(`User ${toUserId} not connected`);
      try {
        const query = 'INSERT INTO messages (chat_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *';
        const results = await pool.query(query, [currentChatId, userId, text]);
        io.to(fromSocketId).emit('receiveMessage', results.rows[0]);
      }
      catch (error) {
        console.error('Error sending message:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
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